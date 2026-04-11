const InterviewQuestion = require('../models/InterviewQuestion');
const InterviewAttempt = require('../models/InterviewAttempt');

const PAPER_TIME_LIMIT_MS = 10 * 60 * 1000;

const sanitizeRoleParam = (role) => String(role || '').trim();

const toPublicQuestion = (q) => ({
    id: String(q._id),
    questionNumber: q.questionNumber,
    question: q.question,
    options: q.options
});

const toAttemptResponse = ({ attempt, questions }) => {
    return {
        attempt: {
            id: String(attempt._id),
            role: attempt.role,
            paperNumber: attempt.paperNumber,
            startedAt: attempt.startedAt,
            expiresAt: attempt.expiresAt,
            submittedAt: attempt.submittedAt || null,
            timedOut: Boolean(attempt.timedOut),
            score: attempt.submittedAt ? attempt.score : null
        },
        questions: questions.map(toPublicQuestion)
    };
};

// GET /api/interviews/roles
const listRoles = async (req, res) => {
    try {
        const roles = await InterviewQuestion.distinct('role');
        roles.sort((a, b) => String(a).localeCompare(String(b)));
        return res.status(200).json({ roles });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/interviews/roles/:role/papers
const listPapersForRole = async (req, res) => {
    try {
        const role = sanitizeRoleParam(req.params.role);
        if (!role) return res.status(400).json({ message: 'role is required' });

        const paperNumbers = await InterviewQuestion.distinct('paperNumber', { role });
        paperNumbers.sort((a, b) => Number(a) - Number(b));

        return res.status(200).json({ role, papers: paperNumbers });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/interviews/roles/:role/papers/:paperNumber
const getPaperQuestions = async (req, res) => {
    try {
        const role = sanitizeRoleParam(req.params.role);
        const paperNumber = Number(req.params.paperNumber);

        if (!role) return res.status(400).json({ message: 'role is required' });
        if (!Number.isFinite(paperNumber) || paperNumber < 1 || paperNumber > 5) {
            return res.status(400).json({ message: 'paperNumber must be 1..5' });
        }

        const questions = await InterviewQuestion.find({ role, paperNumber })
            .select('_id role paperNumber questionNumber question options')
            .sort({ questionNumber: 1 });

        return res.status(200).json({
            role,
            paperNumber,
            questionCount: questions.length,
            questions: questions.map(toPublicQuestion)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/interviews/attempts/start
// body: { role, paperNumber }
const startAttempt = async (req, res) => {
    try {
        const role = sanitizeRoleParam(req.body.role);
        const paperNumber = Number(req.body.paperNumber);

        if (!role) return res.status(400).json({ message: 'role is required' });
        if (!Number.isFinite(paperNumber) || paperNumber < 1 || paperNumber > 5) {
            return res.status(400).json({ message: 'paperNumber must be 1..5' });
        }

        const questions = await InterviewQuestion.find({ role, paperNumber })
            .select('_id role paperNumber questionNumber question options')
            .sort({ questionNumber: 1 });

        if (questions.length !== 10) {
            return res.status(400).json({
                message: 'This paper is not ready (expected exactly 10 questions)',
                role,
                paperNumber,
                found: questions.length
            });
        }

        const startedAt = new Date();
        const expiresAt = new Date(startedAt.getTime() + PAPER_TIME_LIMIT_MS);

        const attempt = await InterviewAttempt.create({
            userId: req.user._id,
            role,
            paperNumber,
            questionIds: questions.map((q) => q._id),
            startedAt,
            expiresAt,
            answers: []
        });

        return res.status(201).json(toAttemptResponse({ attempt, questions }));
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/interviews/attempts/:attemptId
const getAttempt = async (req, res) => {
    try {
        const attempt = await InterviewAttempt.findById(req.params.attemptId);
        if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
        if (String(attempt.userId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to view this attempt' });
        }

        const questions = await InterviewQuestion.find({ _id: { $in: attempt.questionIds } })
            .select('_id role paperNumber questionNumber question options correctOptionIndex explanation')
            .sort({ questionNumber: 1 });

        if (!attempt.submittedAt) {
            return res.status(200).json(toAttemptResponse({ attempt, questions }));
        }

        // Submitted attempt: include review payload
        const answersByQuestionId = new Map(
            (attempt.answers || []).map((a) => [String(a.questionId), a])
        );

        const review = questions.map((q) => {
            const answer = answersByQuestionId.get(String(q._id));
            const selectedOptionIndex = answer?.selectedOptionIndex ?? null;
            const isCorrect = Boolean(answer?.isCorrect);

            return {
                id: String(q._id),
                questionNumber: q.questionNumber,
                question: q.question,
                options: q.options,
                selectedOptionIndex,
                correctOptionIndex: q.correctOptionIndex,
                isCorrect,
                explanation: q.explanation
            };
        });

        return res.status(200).json({
            attempt: {
                id: String(attempt._id),
                role: attempt.role,
                paperNumber: attempt.paperNumber,
                startedAt: attempt.startedAt,
                expiresAt: attempt.expiresAt,
                submittedAt: attempt.submittedAt,
                timedOut: Boolean(attempt.timedOut),
                score: attempt.score
            },
            review
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/interviews/attempts/:attemptId/submit
// body: { answers: [{ questionId, selectedOptionIndex }] }
const submitAttempt = async (req, res) => {
    try {
        const attempt = await InterviewAttempt.findById(req.params.attemptId);
        if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
        if (String(attempt.userId) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to submit this attempt' });
        }
        if (attempt.submittedAt) {
            return res.status(400).json({ message: 'Attempt already submitted' });
        }

        const now = new Date();
        const timedOut = now.getTime() > new Date(attempt.expiresAt).getTime();

        const submittedAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];
        const submittedMap = new Map();
        for (const a of submittedAnswers) {
            if (!a?.questionId) continue;
            const idx = a.selectedOptionIndex;
            submittedMap.set(String(a.questionId), Number.isFinite(Number(idx)) ? Number(idx) : null);
        }

        const questions = await InterviewQuestion.find({ _id: { $in: attempt.questionIds } })
            .select('_id role paperNumber questionNumber question options correctOptionIndex explanation')
            .sort({ questionNumber: 1 });

        if (questions.length !== attempt.questionIds.length) {
            return res.status(400).json({ message: 'Attempt questions are missing' });
        }

        let correctCount = 0;
        const answers = questions.map((q) => {
            const selectedOptionIndex = submittedMap.has(String(q._id))
                ? submittedMap.get(String(q._id))
                : null;
            const isCorrect =
                selectedOptionIndex !== null &&
                Number.isFinite(selectedOptionIndex) &&
                selectedOptionIndex === q.correctOptionIndex;
            if (isCorrect) correctCount++;

            return {
                questionId: q._id,
                selectedOptionIndex,
                correctOptionIndex: q.correctOptionIndex,
                isCorrect
            };
        });

        const total = questions.length;
        const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

        attempt.answers = answers;
        attempt.score = { correct: correctCount, total, percent };
        attempt.submittedAt = now;
        attempt.timedOut = timedOut;
        await attempt.save();

        // Return review payload
        const review = questions.map((q) => {
            const a = answers.find((x) => String(x.questionId) === String(q._id));
            const isCorrect = Boolean(a?.isCorrect);
            return {
                id: String(q._id),
                questionNumber: q.questionNumber,
                question: q.question,
                options: q.options,
                selectedOptionIndex: a?.selectedOptionIndex ?? null,
                correctOptionIndex: q.correctOptionIndex,
                isCorrect,
                explanation: q.explanation
            };
        });

        return res.status(200).json({
            attempt: {
                id: String(attempt._id),
                role: attempt.role,
                paperNumber: attempt.paperNumber,
                startedAt: attempt.startedAt,
                expiresAt: attempt.expiresAt,
                submittedAt: attempt.submittedAt,
                timedOut: Boolean(attempt.timedOut),
                score: attempt.score
            },
            review
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    listRoles,
    listPapersForRole,
    getPaperQuestions,
    startAttempt,
    getAttempt,
    submitAttempt
};
