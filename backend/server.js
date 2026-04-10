require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const countryRoutes = require('./routes/countries');
const universityRoutes = require('./routes/universities');
const programRoutes = require('./routes/programs');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chat');
const usersRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// FIX: CORS must be configured before routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// FIX: express.json() middleware was missing
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// FIX: Added 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// FIX: Added global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
