import { Router } from 'express';
import { getAiHealth, analyzeEvidence } from '../controllers/ai.controller.js';

const router = Router();

// GET /api/ai/health -> Proxies to Python AI Service /health
router.get('/health', getAiHealth);

// POST /api/ai/analyze -> Proxies to Python AI Service /analyze
router.post('/analyze', analyzeEvidence);

export default router;
