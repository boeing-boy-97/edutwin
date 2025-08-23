import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { notesRouter } from './routes/notes.js';
import { quizRouter } from './routes/quiz.js';
import { planRouter } from './routes/plan.js';
import { chatRouter } from './routes/chat.js';

const app = express();
const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
app.use(cors({ origin: (origin, cb) => { if(!origin) return cb(null,true); if(allowed.length===0 || allowed.includes(origin)) return cb(null,true); return cb(new Error('Not allowed by CORS')); }, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req,res)=>res.json({ok:true}));
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/plan', planRouter);
app.use('/api/chat', chatRouter);

const port = Number(process.env.PORT || 8787);
app.listen(port, ()=>console.log(`[edutwin+] http://localhost:${port}`));
