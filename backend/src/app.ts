import express, { Request, Response } from 'express';

const app = express();

app.get('/ping', (_req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

export default app; 