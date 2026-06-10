import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(verifyToken, requireRole(['ADMIN', 'HEADQUARTER_MANAGER']));

router.post('/branches', requireRole(['ADMIN']), async (req: Request, res: Response) => {
  const { branchName, location, phone, managerName, managerEmail, managerPassword } = req.body as {
    branchName: string; location: string; phone?: string; managerName: string; managerEmail: string; managerPassword: string;
  };
  if (!branchName || !location || !managerName || !managerEmail || !managerPassword) {
    res.status(400).json({ error: 'branchName, location, managerName, managerEmail and managerPassword are required.' });
    return;
  }
  const hashedPassword = await bcrypt.hash(managerPassword, 10);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const branch = await tx.branch.create({ data: { name: branchName, location, phone } });
      const manager = await tx.user.create({ data: { name: managerName, email: managerEmail, password: hashedPassword, role: 'BRANCH_MANAGER', branchId: branch.id } });
      return { branch, manager };
    });
    res.status(201).json({ message: 'Branch and manager account created.', branchId: result.branch.id, managerId: result.manager.id });
  } catch {
    res.status(409).json({ error: 'Manager email already in use.' });
  }
});

router.get('/branches', async (_req: Request, res: Response) => {
  const branches = await prisma.branch.findMany({
    include: { _count: { select: { users: true, inventory: true, sales: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(branches);
});

router.get('/users', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, branchId: true, branch: { select: { name: true } }, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

router.patch('/users/:id/terminate', async (req: Request, res: Response) => {
  const rawId = req.params['id'];
  const id = Number.parseInt(Array.isArray(rawId) ? rawId[0]! : rawId || '0', 10);
  await prisma.user.update({ where: { id }, data: { isActive: false } });
  res.json({ message: 'Account terminated.' });
});

router.patch('/users/:id/activate', async (req: Request, res: Response) => {
  const rawId = req.params['id'];
  const id = Number.parseInt(Array.isArray(rawId) ? rawId[0]! : rawId || '0', 10);
  await prisma.user.update({ where: { id }, data: { isActive: true } });
  res.json({ message: 'Account activated.' });
});

router.get('/overview', async (_req: Request, res: Response) => {
  const [branches, users, inventory, sales] = await Promise.all([
    prisma.branch.count(), 
    prisma.user.count(),
    prisma.inventoryItem.count(),
    prisma.sale.aggregate({ _sum: { totalAmount: true }, _count: true }),
    prisma.inventoryItem.findMany(),
  ]);
  
  // We need to fetch the items to check low stock locally or do another count
  const allItems = await prisma.inventoryItem.findMany();
  const lowStockCount = allItems.filter((item) => item.quantity <= item.reorderLevel).length;
  
  res.json({ 
    branches, 
    users, 
    inventory, 
    lowStock: lowStockCount, 
    orders: sales._count, 
    revenue: sales._sum.totalAmount ?? 0 
  });
});

export default router;
