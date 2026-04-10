// Vercel Serverless Function — wraps the Express app
// This file lives at /api/index.js in the repo root.
// vercel.json routes all /api/* traffic here.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes       = require('../backend/routes/auth');
const countryRoutes    = require('../backend/routes/countries');
const universityRoutes = require('../backend/routes/universities');
const programRoutes    = require('../backend/routes/programs');
const profileRoutes    = require('../backend/routes/profile');
const chatRoutes       = require('../backend/routes/chat');
const usersRoutes      = require('../backend/routes/users');
const analyticsRoutes  = require('../backend/routes/analytics');

const app = express();

// CORS — allow the Vercel frontend domain and localhost for dev
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Mount all routes under /api/*
app.use('/api/auth',         authRoutes);
app.use('/api/countries',    countryRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/programs',     programRoutes);
app.use('/api/profile',      profileRoutes);
app.use('/api/chat',         chatRoutes);
app.use('/api/users',        usersRoutes);
app.use('/api/analytics',    analyticsRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'OK', ts: Date.now() }));

// 404 handler
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel (don't call app.listen)
module.exports = app;
