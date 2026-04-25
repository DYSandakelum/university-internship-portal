const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true
		},
		jobId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Job',
			required: true,
			index: true
		},
		reminderSent: {
			type: Boolean,
			default: false
		},
		reminderSentAt: {
			type: Date
		}
	},
	{
		timestamps: true
	}
);

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.models.SavedJob || mongoose.model('SavedJob', savedJobSchema);

