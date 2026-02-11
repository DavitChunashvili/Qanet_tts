import express, { Request, Response } from 'express';
import { getTTSAudio } from '../services/ttsService.js';

const router = express.Router();

interface TTSRequest {
  text: string;
  locale: string;
  rate?: number;
  pitch?: number;
}

router.post('/tts', async (req: Request, res: Response) => {
  try {
    const { text, locale, rate = 1, pitch = 1 } = req.body as TTSRequest;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 1000) {
      return res.status(400).json({ error: 'Text exceeds 1000 characters' });
    }

    if (rate < 0.5 || rate > 2 || pitch < 0.5 || pitch > 2) {
      return res.status(400).json({ error: 'Rate and pitch must be between 0.5 and 2' });
    }

    const audioBuffer = await getTTSAudio({
      text: text.trim(),
      locale,
      rate,
      pitch
    });

    const provider = (process.env.TTS_PROVIDER || 'mock').toLowerCase();
    const contentType = provider === 'mock' ? 'audio/wav' : 'audio/mpeg';
    const filename = provider === 'mock' ? 'audio.wav' : 'audio.mp3';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'TTS generation failed'
    });
  }
});

export default router;
