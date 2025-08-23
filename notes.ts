import { Router } from 'express';
import { z } from 'zod';
import { generateText } from '../services/ai.js';
import { prisma } from '../services/db.js';
import { requireAuth, AuthedRequest } from '../services/auth.js';

export const notesRouter = Router();
notesRouter.use(requireAuth);

const Create = z.object({ subject: z.string().min(1), content: z.string().min(20), level: z.enum(['simple','detailed','mindmap']).default('simple') });

notesRouter.post('/summarize', async (req: AuthedRequest, res) => {
  const p = Create.safeParse(req.body);
  if(!p.success) return res.status(400).json({ error: p.error.flatten() });
  const { subject, content, level } = p.data;
  const prompt = `Summarize the following study content into ${level} student notes with bullet points and examples. Subject: ${subject}\nContent:\n${content}`;
  const summary = await generateText(prompt);
  const note = await prisma.note.create({ data: { userId: req.userId!, subject, content, summary } });
  res.json({ note });
});

notesRouter.get('/', async (req: AuthedRequest, res) => {
  const notes = await prisma.note.findMany({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' } });
  res.json({ notes });
});
