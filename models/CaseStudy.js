const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  context: { type: String }
}, { _id: false });

const ScreenSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  badge: { type: String },
  accentColor: { type: String, default: '#6366f1' }
}, { _id: false });

const CaseStudySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true,
    enum: ['mobile', 'saas', 'design-system', 'fintech', 'ecommerce'] 
  },
  categoryLabel: { type: String, required: true },
  tagline: { type: String, required: true },
  role: { type: String, default: 'Solo UX/UI Designer & Researcher' },
  roleTags: [{ type: String }],
  timeline: { type: String, default: '8 Weeks' },
  team: { type: String, default: '1 Product Manager, 3 Engineers, 1 UX Designer (Me)' },
  tools: [{ type: String }],
  keyMetrics: [MetricSchema],
  executiveSummary: {
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    impact: { type: String, required: true }
  },
  discovery: {
    challenge: { type: String },
    userPersona: {
      name: { type: String },
      role: { type: String },
      needs: [{ type: String }],
      painPoints: [{ type: String }]
    },
    researchInsights: [{ type: String }]
  },
  strategy: {
    iaHighlights: [{ type: String }],
    userFlowSteps: [{ type: String }],
    fastTrackWins: [{ type: String }]
  },
  craftsmanship: {
    typography: { type: String },
    colorPalette: [{ name: String, hex: String }],
    microInteractions: [{ type: String }],
    screens: [ScreenSchema]
  },
  impact: {
    outcomes: [{ type: String }],
    learnings: { type: String }
  },
  figmaUrl: { type: String },
  liveDemoUrl: { type: String },
  featured: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('CaseStudy', CaseStudySchema);
