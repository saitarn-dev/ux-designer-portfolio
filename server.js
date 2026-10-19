require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const CaseStudy = require('./models/CaseStudy');
const Profile = require('./models/Profile');
const Message = require('./models/Message');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection state tracking
let isDbConnected = false;

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  isDbConnected = true;
  console.log('✅ Connected to MongoDB Atlas successfully.');
}).catch((err) => {
  console.error('❌ MongoDB Atlas connection error:', err.message);
  isDbConnected = false;
});

mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
  console.log('⚠️ MongoDB Atlas disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isDbConnected = true;
  console.log('🔄 MongoDB Atlas reconnected.');
});

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Get Profile Info
app.get('/api/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
});

// Get Case Studies (with optional category filter)
app.get('/api/case-studies', async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    const caseStudies = await CaseStudy.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.json(caseStudies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch case studies', details: err.message });
  }
});

// Get Single Case Study by Slug
app.get('/api/case-studies/:slug', async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findOne({ slug: req.params.slug });
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    res.json(caseStudy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch case study', details: err.message });
  }
});

// Submit Contact Message (Saves to MongoDB)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, role, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const newMessage = await Message.create({
      name,
      email,
      company: company || 'Not specified',
      role: role || 'Recruiter / Hiring Manager',
      subject: subject || 'Portfolio Opportunity',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message delivered directly to Sai Tara Artchompoo via MongoDB!',
      data: newMessage
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
});

// Get Received Messages (Admin / Recruiter View)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(20);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
});

// Fallback to index.html for SPA (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server (local environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 UX/UI Designer Portfolio server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
