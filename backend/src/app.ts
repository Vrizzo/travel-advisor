import express from 'express';
import { travelPreferenceRouter } from './interfaces/routes/travel-preference.routes';

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// API routes
app.use('/api/travel-preferences', travelPreferenceRouter);

export default app; 