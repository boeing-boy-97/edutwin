import { Router } from 'express';
import { z } from 'zod';
import { generateText } from '../services/ai.js';
import { prisma } from '../services/db.js';
import { requireAuth, AuthedRequest } from '../services/auth.js';

export const quizRouter = Router();
quizRouter.use(requireAuth);

const Schema = z.object({ subject: z.string().min(1), notes: z.string().min(20), count: z.number().int().min(5).max(30).default(10) });

quizRouter.post('/generate', async (req: AuthedRequest, res) => {
  const p = Schema.safeParse(req.body);
  if(!p.success) return res.status(400).json({ error: p.error.flatten() });
  const { subject, notes, count } = p.data;
  const prompt = `Create ${count} mixed-format questions (MCQ, True/False, Fill in the blank) from these notes with suggested answers and brief explanations. Return JSON array with fields: type, question, options (if MCQ), answer, explanation. Subject: ${subject}\nNotes:\n${notes}`;
  const json = await generateText(prompt);
  const quiz = await prisma.quiz.create({ data: { userId: req.userId!, subject, source: notes.slice(0,200), json } });
  res.json({ quiz });
});

quizRouter.get('/', async (req: AuthedRequest, res) => {
  const quizzes = await prisma.quiz.findMany({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' } });
  res.json({ quizzes });
});
