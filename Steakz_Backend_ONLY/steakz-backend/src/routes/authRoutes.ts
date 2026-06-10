import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev-secret';
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] ?? '7d';

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required.' });
    return;
  }
  const user = await prisma.user.findUnique({ where: { email }, include: { branch: true } });
  
  // Temporary Diagnostic Logs
  console.log(`[Login Attempt] Email: ${email}`);
  console.log(`[Login Audit] User found: ${!!user}`);
  if (user) {
    console.log(`[Login Audit] User active: ${user.isActive}`);
    console.log(`[Login Audit] Role: ${user.role}`);
  }

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials or account is inactive.' });
    return;
  }
  if (!user.isActive) {
    res.status(401).json({ error: 'Invalid credentials or account is inactive.' });
    return;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(`[Login Audit] Password match: ${isMatch}`);

  if (!isMatch) {
    res.status(401).json({ error: 'Invalid credentials or account is inactive.' });
    return;
  }
  console.log(`[Login] Success: ${email} (${user.role})`);
  const token = jwt.sign(
    { id: user.id, role: user.role, branchId: user.branchId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, branchId: user.branchId, branch: user.branch?.name ?? null },
  });
});

router.get('/me', verifyToken, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true, branchId: true, isActive: true, branch: { select: { name: true } } },
  });
  res.json(user);
});

export default router;
