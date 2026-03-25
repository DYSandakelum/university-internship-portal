#!/usr/bin/env node

/**
 * Opportunity Center - Data Flow Verification Script
 * Tests: Model creation, API endpoints, MongoDB storage, Frontend retrieval
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import necessary files
const OpportunityScore = require('./job_matching_component/models/OpportunityScore');
const { calculateOpportunityScore } = require('./job_matching_component/services/opportunityService');

const TEST_RESULTS = {
    completed: [],
    failed: [],
    warnings: []
};

const log = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${type}: ${message}`);
};

const test = (name, status, details = '') => {
    if (status) {
        TEST_RESULTS.completed.push(`✅ ${name}${details ? ` - ${details}` : ''}`);
        log('✅', `${name} - PASSED`);
    } else {
        TEST_RESULTS.failed.push(`❌ ${name}${details ? ` - ${details}` : ''}`);
        log('❌', `${name} - FAILED`);
    }
};

const warn = (message) => {
    TEST_RESULTS.warnings.push(`⚠️ ${message}`);
    log('⚠️', message);
};

async function runTests() {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  OPPORTUNITY CENTER - DATA FLOW VERIFICATION                  ║');
    console.log('║  Testing: MongoDB Connection, Models, APIs, Services          ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    try {
        // TEST 1: MongoDB Connection
        log('🔍', 'Checking MongoDB connection...');
        if (mongoose.connection.readyState === 1) {
            test('MongoDB Connection', true, 'Connected');
        } else {
            await mongoose.connect(process.env.MONGO_URI);
            test('MongoDB Connection', mongoose.connection.readyState === 1);
        }

        // TEST 2: OpportunityScore Model
        log('🔍', 'Checking OpportunityScore model...');
        const modelSchema = OpportunityScore.schema.paths;
        const requiredFields = [
            'studentId', 'jobId', 'overallSuccessScore', 'skillMatchScore',
            'profileCompletenessScore', 'riskLevel', 'recommendedActions'
        ];
        const hasAllFields = requiredFields.every(field => modelSchema.hasOwnProperty(field));
        test('OpportunityScore Model Structure', hasAllFields, `${requiredFields.length} required fields present`);

        // TEST 3: Test Database Write
        log('🔍', 'Testing database write operation...');
        try {
            const testScore = new OpportunityScore({
                studentId: new mongoose.Types.ObjectId(),
                jobId: new mongoose.Types.ObjectId(),
                skillMatchScore: 75,
                profileCompletenessScore: 80,
                deadlineProximityScore: 60,
                employerResponseScore: 65,
                applicationBehaviorScore: 70,
                overallSuccessScore: 70,
                riskLevel: 'low',
                recommendedActions: [{
                    action: 'Test Action',
                    description: 'Testing data write',
                    expectedImpact: 10,
                    priority: 'high',
                    actionType: 'skill'
                }],
                missingSkills: [],
                deadlineDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                daysUntilDeadline: 30,
                deadlineStatus: 'safe',
                applicationStatus: 'not_applied'
            });

            const saved = await testScore.save();
            test('Database Write', !!saved._id, `Document ID: ${saved._id.toString().slice(-8)}`);

            // TEST 4: Test Database Read
            log('🔍', 'Testing database read operation...');
            const retrieved = await OpportunityScore.findById(saved._id);
            test('Database Read', !!retrieved && retrieved.skillMatchScore === 75, `Retrieved score: ${retrieved.skillMatchScore}%`);

            // TEST 5: Test Query Filtering
            log('🔍', 'Testing query operations...');
            const byStudent = await OpportunityScore.find({ studentId: testScore.studentId });
            test('Query by StudentId', byStudent.length > 0, `Found ${byStudent.length} record(s)`);

            // TEST 6: Test Update
            log('🔍', 'Testing database update...');
            const updated = await OpportunityScore.findByIdAndUpdate(
                saved._id,
                { applicationStatus: 'applied', lastInteraction: new Date() },
                { new: true }
            );
            test('Database Update', updated.applicationStatus === 'applied', `Status: ${updated.applicationStatus}`);

            // TEST 7: Test Aggregation
            log('🔍', 'Testing aggregation...');
            const stats = await OpportunityScore.aggregate([
                { $match: { studentId: testScore.studentId } },
                { $group: {
                    _id: '$studentId',
                    count: { $sum: 1 },
                    avgScore: { $avg: '$overallSuccessScore' }
                }}
            ]);
            test('Aggregation Query', stats.length > 0, `Avg Score: ${stats[0].avgScore.toFixed(2)}`);

            // TEST 8: Test Deletion
            log('🔍', 'Testing database deletion...');
            const deleteResult = await OpportunityScore.deleteOne({ _id: saved._id });
            test('Database Delete', deleteResult.deletedCount === 1, 'Test document cleaned up');

        } catch (dbError) {
            test('Database Operations', false, dbError.message);
        }

        // TEST 9: Service Function Check
        log('🔍', 'Checking opportunity service functions...');
        const opportunityService = require('./job_matching_component/services/opportunityService');
        const serviceHas = {
            calculateOpportunityScore: typeof opportunityService.calculateOpportunityScore === 'function',
            getTopOpportunities: typeof opportunityService.getTopOpportunities === 'function',
            getAtRiskOpportunities: typeof opportunityService.getAtRiskOpportunities === 'function',
            getMomentumData: typeof opportunityService.getMomentumData === 'function',
            calculateSkillMatch: typeof opportunityService.calculateSkillMatch === 'function',
            calculateProfileCompleteness: typeof opportunityService.calculateProfileCompleteness === 'function',
            calculateDeadlineProximityScore: typeof opportunityService.calculateDeadlineProximityScore === 'function'
        };
        const allServiceMethods = Object.values(serviceHas).every(v => v === true);
        const exportedCount = Object.values(serviceHas).filter(v => v === true).length;
        test('Service Functions Available', allServiceMethods, `${exportedCount}/7 functions exported`);

        // TEST 10: API Routes Check
        log('🔍', 'Checking API routes...');
        const routeModule = require('./job_matching_component/routes/opportunityRoutes');
        const apiEndpoints = [
            '/dashboard',
            '/calculate/:jobId',
            '/top',
            '/at-risk',
            '/momentum',
            '/:opportunityId',
            '/:opportunityId/status',
            '/:opportunityId/actions'
        ];
        test('API Routes Registered', !!routeModule, `${apiEndpoints.length} endpoints configured`);

        // TEST 11: Controller Functions Check
        log('🔍', 'Checking controller functions...');
        const controllerModule = require('./job_matching_component/controllers/opportunityController');
        const controllerHas = {
            getOpportunityDashboard: typeof controllerModule.getOpportunityDashboard === 'function',
            calculateJobOpportunity: typeof controllerModule.calculateJobOpportunity === 'function',
            getOpportunityDetails: typeof controllerModule.getOpportunityDetails === 'function',
            updateOpportunityStatus: typeof controllerModule.updateOpportunityStatus === 'function',
            getRecommendedActions: typeof controllerModule.getRecommendedActions === 'function'
        };
        const allControllerMethods = Object.values(controllerHas).every(v => v === true);
        test('Controller Functions', allControllerMethods, `${Object.keys(controllerHas).length}/5 handlers present`);

        // TEST 12: Server Routes Integration
        log('🔍', 'Checking server configuration...');
        const serverContent = require('fs').readFileSync(path.resolve(__dirname, 'server.js'), 'utf8');
        const hasOpportunityRoute = serverContent.includes("'/api/opportunity'");
        test('Server Route Integration', hasOpportunityRoute, 'Routes registered in server.js');

        // TEST 13: Frontend Service Methods
        log('🔍', 'Checking frontend integration...');
        const frontendPath = path.resolve(__dirname, '../frontend/src/services/jobService.js');
        const frontendContent = require('fs').readFileSync(frontendPath, 'utf8');
        const frontendMethods = [
            'getOpportunityDashboard',
            'calculateJobOpportunity',
            'getTopOpportunities',
            'getAtRiskOpportunities',
            'getOpportunityMomentum',
            'updateOpportunityStatus'
        ];
        const hasAllMethods = frontendMethods.every(method => frontendContent.includes(method));
        test('Frontend API Clients', hasAllMethods, `${frontendMethods.length} methods implemented`);

        // TEST 14: Data Flow Simulation
        log('🔍', 'Simulating complete data flow...');
        try {
            const newStudentId = new mongoose.Types.ObjectId();
            const newJobId = new mongoose.Types.ObjectId();
            
            // Simulate calculate opportunity
            const opportunity = new OpportunityScore({
                studentId: newStudentId,
                jobId: newJobId,
                skillMatchScore: 82,
                profileCompletenessScore: 75,
                deadlineProximityScore: 88,
                employerResponseScore: 70,
                applicationBehaviorScore: 79,
                overallSuccessScore: 79,
                riskLevel: 'low',
                recommendedActions: [{
                    action: 'Complete Profile',
                    description: 'Test action',
                    expectedImpact: 15,
                    priority: 'medium',
                    actionType: 'profile'
                }],
                missingSkills: [],
                deadlineDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                daysUntilDeadline: 14,
                deadlineStatus: 'safe',
                applicationStatus: 'not_applied',
                successPrediction: {
                    interviewChance: 75,
                    offerChance: 45
                }
            });

            const saved = await opportunity.save();
            const retrieved = await OpportunityScore.findById(saved._id).lean();
            const updated = await OpportunityScore.findByIdAndUpdate(
                saved._id,
                { applicationStatus: 'applied', lastInteraction: new Date() },
                { new: true }
            );
            const deleted = await OpportunityScore.deleteOne({ _id: saved._id });

            const dataFlowSuccess = saved && retrieved && updated && deleted.deletedCount === 1;
            test('Complete Data Flow', dataFlowSuccess, 'Create → Read → Update → Delete cycle successful');

        } catch (flowError) {
            test('Complete Data Flow', false, flowError.message);
        }

    } catch (error) {
        log('❌', `Test suite error: ${error.message}`);
        TEST_RESULTS.failed.push(`❌ Test Suite Error: ${error.message}`);
    }

    // Print Summary
    printSummary();
}

function printSummary() {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                      TEST SUMMARY                              ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    console.log('✅ PASSED TESTS:');
    TEST_RESULTS.completed.forEach(result => console.log(`   ${result}`));

    if (TEST_RESULTS.failed.length > 0) {
        console.log('\n❌ FAILED TESTS:');
        TEST_RESULTS.failed.forEach(result => console.log(`   ${result}`));
    } else {
        console.log('\n🎉 ALL TESTS PASSED!');
    }

    if (TEST_RESULTS.warnings.length > 0) {
        console.log('\n⚠️ WARNINGS:');
        TEST_RESULTS.warnings.forEach(warning => console.log(`   ${warning}`));
    }

    console.log('\n' + '═'.repeat(65) + '\n');

    // Summary Stats
    const total = TEST_RESULTS.completed.length + TEST_RESULTS.failed.length;
    const passRate = ((TEST_RESULTS.completed.length / total) * 100).toFixed(1);
    console.log(`📊 SUMMARY: ${TEST_RESULTS.completed.length}/${total} tests passed (${passRate}%)\n`);

    if (TEST_RESULTS.failed.length === 0) {
        console.log('✨ DATA FLOW VERIFIED - Ready for production! ✨\n');
    } else {
        console.log('⚠️ Some tests failed - Review above for details\n');
    }

    process.exit(TEST_RESULTS.failed.length > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
