import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Public route for customers to submit feedback
router.post('/', async (req: Request, res: Response) => {
  const { customerName, rating, comment, branchId } = req.body as { 
    customerName?: string; rating: number; comment: string; branchId: number 
  };

  if (!rating || !comment || !branchId) {
    res.status(400).json({ error: 'rating, comment and branchId are required.' });
    return;
  }

  const feedback = await prisma.customerFeedback.create({
    data: { customerName, rating: Number(rating), comment, branchId: Number(branchId) },
  });

  res.status(201).json(feedback);
});

// New Public route to view feedback (for Landing Page)
router.get('/public', async (_req: Request, res: Response) => {
  const feedbacks = await prisma.customerFeedback.findMany({
    include: { branch: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  res.json(feedbacks);
});

// Admin and Manager can view feedback
router.get('/', verifyToken, requireRole(['ADMIN', 'HEADQUARTER_MANAGER', 'BRANCH_MANAGER']), async (req: Request, res: Response) => {
  const isGlobal = req.user!.role === 'ADMIN' || req.user!.role === 'HEADQUARTER_MANAGER';
  const branchFilter = isGlobal ? {} : { branchId: req.user!.branchId! };

  const feedbacks = await prisma.customerFeedback.findMany({
    where: branchFilter,
    include: { branch: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json(feedbacks);
});

export default router;
