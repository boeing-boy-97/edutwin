import { Router } from 'express';
import { z } from 'zod';
import { generateText } from '../services/ai.js';
import { prisma } from '../services/db.js';
import { requireAuth, AuthedRequest } from '../services/auth.js';

export const chatRouter = Router();
chatRouter.use(requireAuth);

const Schema = z.object({ question: z.string().min(3), mode: z.enum(['simple','detailed','example']).default('simple') });

chatRouter.post('/', async (req: AuthedRequest, res) => {
  const p = Schema.safeParse(req.body);
  if(!p.success) return res.status(400).json({ error: p.error.flatten() });
  const { question, mode } = p.data;
  const style = mode==='simple' ? 'Explain to a 12-year-old with steps.' : mode==='example' ? 'Explain using a worked example then key takeaways.' : 'Explain rigorously but clearly.';
  const prompt = `${style}\nQuestion: ${question}`;
  const answer = await generateText(prompt);
  const saved = await prisma.chatMessage.create({ data: { userId: req.userId!, mode, question, answer } });
  res.json({ message: saved });
});

chatRouter.get('/', async (req: AuthedRequest, res) => {
  const messages = await prisma.chatMessage.findMany({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' } });
  res.json({ messages });
});
