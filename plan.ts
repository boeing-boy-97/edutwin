import { Router } from 'express';
import { z } from 'zod';
import { generateText } from '../services/ai.js';
import { prisma } from '../services/db.js';
import { requireAuth, AuthedRequest } from '../services/auth.js';

export const planRouter = Router();
planRouter.use(requireAuth);

const Schema = z.object({ examDate: z.string(), topics: z.array(z.string().min(1)).min(1), hoursPerDay: z.number().min(0.5).max(12).default(2) });

planRouter.post('/build', async (req: AuthedRequest, res) => {
  const p = Schema.safeParse(req.body);
  if(!p.success) return res.status(400).json({ error: p.error.flatten() });
  const { examDate, topics, hoursPerDay } = p.data;
  const prompt = `Create a day-by-day revision plan from today until ${examDate} for these topics: ${topics.join(', ')}. Assume ${hoursPerDay} hours per day. Balance learning and spaced repetition. Return JSON array of days with date, tasks, and focus.`;
  const json = await generateText(prompt);
  const plan = await prisma.plan.create({ data: { userId: req.userId!, examDate: new Date(examDate), topics: topics.join(','), hoursPerDay, json } });
  res.json({ plan });
});

planRouter.get('/', async (req: AuthedRequest, res) => {
  const plans = await prisma.plan.findMany({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' } });
  res.json({ plans });
});
