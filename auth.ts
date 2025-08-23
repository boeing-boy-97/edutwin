import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export interface AuthedRequest extends Request { userId?: string }
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction){
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if(!token) return res.status(401).json({error:'Missing token'});
  try{ const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev') as any; req.userId = decoded.sub; next(); }
  catch{ return res.status(401).json({error:'Invalid token'}); }
}
