import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import ttsRouter from './routes/tts.js';

config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', provider: process.env.TTS_PROVIDER || 'mock' });
});

// TTS endpoint
app.use('/api', ttsRouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(port, () => {
  console.log(`🚀 TTS Backend running on http://localhost:${port}`);
  console.log(`📡 Provider: ${process.env.TTS_PROVIDER || 'mock'}`);
});
