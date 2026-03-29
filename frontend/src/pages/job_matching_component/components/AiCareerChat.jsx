import React, { useMemo, useState } from 'react';
import { FiCpu, FiSend, FiBookOpen } from 'react-icons/fi';
import { sendCareerChatMessage } from '../../../services/aiChatService';
import './AiCareerChat.css';

export default function AiCareerChat({ studentSkills = [], stats = {}, recentActivities = [] }) {
    const [input, setInput] = useState('');
    const [inputError, setInputError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: 'I can help you plan how to meet job requirements. Ask about skill gaps, interview prep, or resume improvements and I will suggest practical steps and online courses.',
            recommendedCourses: [],
            suggestedNextSteps: []
        }
    ]);

    const tips = useMemo(
        () => [
            'How can I close my React skill gap for internships?',
            'I have trouble with coding tests. What should I do weekly?',
            'Suggest courses for backend + MongoDB roles.'
        ],
        []
    );

    const handleSend = async (messageOverride) => {
        const message = (messageOverride ?? input).trim();
        if (!message || isSending) return;

        // Validation: must contain at least one letter (not only numbers/symbols)
        const hasLetter = (() => {
            try {
                return new RegExp('\\p{L}', 'u').test(message);
            } catch {
                return /[A-Za-z]/.test(message);
            }
        })();
        if (!hasLetter) {
            setInputError('Please enter a valid text message (include at least one letter).');
            return;
        }

        setInputError('');

        const userEntry = { role: 'user', text: message };
        setMessages((prev) => [...prev, userEntry]);
        setInput('');
        setIsSending(true);

        try {
            const response = await sendCareerChatMessage({
                message,
                context: {
                    studentSkills,
                    stats,
                    recentActivities: recentActivities.slice(0, 5)
                }
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: response?.reply || 'I could not generate a full response right now. Please try again.',
                    recommendedCourses: Array.isArray(response?.recommendedCourses)
                        ? response.recommendedCourses
                        : [],
                    suggestedNextSteps: Array.isArray(response?.suggestedNextSteps)
                        ? response.suggestedNextSteps
                        : []
                }
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: error?.response?.data?.message || 'Unable to reach AI assistant right now. Please try again in a moment.',
                    recommendedCourses: [],
                    suggestedNextSteps: []
                }
            ]);
        } finally {
            setIsSending(false);
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        handleSend();
    };

    return (
        <div className="glass-panel ai-chat-wrapper">
            <div className="ai-chat-header">
                <div className="ai-chat-title">
                    <FiCpu /> AI Career Support Chat
                </div>
                <span className="ai-chat-badge">Not stored in database</span>
            </div>

            <div className="ai-chat-list">
                {messages.map((msg, index) => (
                    <div key={index} className={`ai-msg ${msg.role}`}>
                        <div className="ai-msg-label">{msg.role === 'assistant' ? 'Assistant' : 'You'}</div>
                        <div>{msg.text}</div>

                        {msg.role === 'assistant' && msg.recommendedCourses?.length > 0 && (
                            <div className="ai-courses">
                                {msg.recommendedCourses.map((course, i) => (
                                    <div key={`${course.title}-${i}`} className="ai-course-item">
                                        <a href={course.url} target="_blank" rel="noreferrer">
                                            <FiBookOpen style={{ marginRight: '6px' }} />
                                            {course.title}
                                        </a>
                                        <div className="ai-course-meta">{course.provider}</div>
                                        <div className="ai-course-meta">{course.reason}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {msg.role === 'assistant' && msg.suggestedNextSteps?.length > 0 && (
                            <ul className="ai-next-steps">
                                {msg.suggestedNextSteps.map((step, i) => (
                                    <li key={`${step}-${i}`}>{step}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={onSubmit} className="ai-chat-form">
                <input
                    className={`ai-chat-input ${inputError ? 'has-error' : ''}`}
                    type="text"
                    value={input}
                    onChange={(event) => {
                        setInput(event.target.value);
                        if (inputError) setInputError('');
                    }}
                    placeholder="Ask about your skill gaps or job requirement difficulties..."
                    disabled={isSending}
                />
                <button className="btn-primary ai-chat-send" type="submit" disabled={isSending}>
                    <FiSend style={{ marginRight: '6px' }} />
                    {isSending ? 'Thinking...' : 'Send'}
                </button>
            </form>

            {inputError && <div className="ai-chat-error" role="alert">{inputError}</div>}

            <div className="ai-chat-tips">
                {tips.map((tip) => (
                    <button key={tip} className="ai-chat-tip" onClick={() => handleSend(tip)} disabled={isSending}>
                        {tip}
                    </button>
                ))}
            </div>
        </div>
    );
}
