import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/branches - Public endpoint for Landing Page
router.get('/', async (_req: Request, res: Response) => {
  const branches = await prisma.branch.findMany({
    select: {
      id: true,
      name: true,
      location: true,
      phone: true
    },
    orderBy: { name: 'asc' }
  });
  res.json(branches);
});

export default router;
