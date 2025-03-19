import express from 'express';
import cors from 'cors';
import flightSearchRouter from './interfaces/routes/flight-search.routes';
import { travelPreferenceRouter } from './interfaces/routes/travel-preference.routes';
import { flightRouter } from './interfaces/routes/flight.routes';

const app = express();

// Enable CORS for all routes


// ... rest of your Express configuration

app.use(cors({
  origin: 'http://localhost', // your frontend URL
  credentials: true // if you're using cookies/sessions
}));
// Middleware
app.use(express.json());

// Health check endpoint
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// API routes
app.use('/api/flight-search', flightSearchRouter);
app.use('/api/travel-preferences', travelPreferenceRouter);
app.use('/api/flights', flightRouter);
export default app; 