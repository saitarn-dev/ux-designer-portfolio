const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  role: { type: String, default: 'Recruiter' },
  subject: { type: String, default: 'Opportunity / Project Inquiry' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);
