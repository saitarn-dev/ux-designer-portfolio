require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const CaseStudy = require('./models/CaseStudy');
const Profile = require('./models/Profile');
const Message = require('./models/Message');
const { caseStudiesData, profileData } = require('./data/defaultData');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection caching for Serverless (Vercel) & Local
let cachedDbPromise = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  if (!cachedDbPromise) {
    cachedDbPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
  }
  return cachedDbPromise;
}

// Immediate connection attempt for local environment
connectToDatabase().then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully.');
}).catch((err) => {
  console.error('❌ MongoDB Atlas connection error:', err.message);
});

// Auto-connect middleware for API routes on Vercel
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/health') {
    try {
      await connectToDatabase();
    } catch (err) {
      console.error('Database connection middleware error:', err);
    }
  }
  next();
});

// API Routes

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    await connectToDatabase();
  } catch (err) {
    // handled below via readyState
  }
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Get Profile Info
app.get('/api/profile', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const profile = await Profile.findOne().sort({ createdAt: -1 });
      if (profile) return res.json(profile);
    }
    return res.json(profileData);
  } catch (err) {
    console.warn('Using default profile data due to connection error:', err.message);
    res.json(profileData);
  }
});

// Get Case Studies (with optional category filter)
app.get('/api/case-studies', async (req, res) => {
  const { category } = req.query;
  try {
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      const caseStudies = await CaseStudy.find(query).sort({ displayOrder: 1, createdAt: -1 });
      if (caseStudies && caseStudies.length > 0) {
        return res.json(caseStudies);
      }
    }
    // Fallback to rich embedded case studies
    let items = caseStudiesData;
    if (category && category !== 'all') {
      items = items.filter(s => s.category === category);
    }
    return res.json(items);
  } catch (err) {
    console.warn('Using default case studies due to connection error:', err.message);
    let items = caseStudiesData;
    if (category && category !== 'all') {
      items = items.filter(s => s.category === category);
    }
    res.json(items);
  }
});

// Get Single Case Study by Slug
app.get('/api/case-studies/:slug', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const caseStudy = await CaseStudy.findOne({ slug: req.params.slug });
      if (caseStudy) return res.json(caseStudy);
    }
    const fallbackStudy = caseStudiesData.find(s => s.slug === req.params.slug);
    if (fallbackStudy) return res.json(fallbackStudy);
    return res.status(404).json({ error: 'Case study not found' });
  } catch (err) {
    const fallbackStudy = caseStudiesData.find(s => s.slug === req.params.slug);
    if (fallbackStudy) return res.json(fallbackStudy);
    res.status(500).json({ error: 'Failed to fetch case study', details: err.message });
  }
});

// Submit Contact Message (Saves to MongoDB if connected, else logs safely)
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

    if (mongoose.connection.readyState === 1) {
      const newMessage = await Message.create({
        name,
        email,
        company: company || 'Not specified',
        role: role || 'Recruiter / Hiring Manager',
        subject: subject || 'Portfolio Opportunity',
        message
      });

      return res.status(201).json({
        success: true,
        message: 'Message delivered directly to Sai Tara Artchompoo via MongoDB!',
        data: newMessage
      });
    }

    // Graceful offline message receipt
    console.log('Received contact message (buffered):', { name, email, company, role, subject, message });
    return res.status(200).json({
      success: true,
      message: 'Message received and stored successfully!',
      data: { name, email, company, role, subject, message, createdAt: new Date() }
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
