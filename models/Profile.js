const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  period: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }]
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  institution: { type: String, required: true }
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  name: { type: String, default: 'Sai Tara Artchompoo' },
  roleTitle: { type: String, default: 'Mid-Level UX/UI Designer & Researcher' },
  tagline: { 
    type: String, 
    default: 'Crafting high-converting, human-centered digital experiences with rigorous UX thinking and meticulous UI craftsmanship.' 
  },
  location: { type: String, default: 'Bangkok, Thailand (Open to Remote / Hybrid Worldwide)' },
  availability: { type: String, default: 'Available for Full-time Roles & High-Impact Contracts' },
  email: { type: String, default: 'saitara.ux@gmail.com' },
  phone: { type: String, default: '+66 82 345 6789' },
  resumeUrl: { type: String, default: '/assets/resume-preview.html' },
  stats: [StatSchema],
  designPhilosophy: {
    title: { type: String, default: 'Empathetic UX × Pixel-Precision UI' },
    description: { 
      type: String, 
      default: 'I solve business problems by advocating fiercely for users. As a solo designer who collaborates tightly with Product Managers and Developers, I ensure every interaction is fast, accessible (WCAG AA), and measurably impactful.' 
    }
  },
  experiences: [ExperienceSchema],
  education: [EducationSchema],
  socials: {
    linkedin: { type: String, default: 'https://linkedin.com' },
    dribbble: { type: String, default: 'https://dribbble.com' },
    behance: { type: String, default: 'https://behance.net' },
    github: { type: String, default: 'https://github.com' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);
