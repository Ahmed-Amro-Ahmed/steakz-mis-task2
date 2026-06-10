import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(verifyToken, requireRole(['BRANCH_MANAGER']));

router.get('/dashboard', async (req: Request, res: Response) => {
  const branchId = req.user!.branchId!;
  const [items, staff, salesAgg, movements] = await Promise.all([
    prisma.inventoryItem.findMany({ where: { branchId } }),
    prisma.user.count({ where: { branchId, role: { in: ['CHEF', 'CASHIER', 'WAITER'] } } }),
    prisma.sale.aggregate({ where: { branchId }, _sum: { totalAmount: true }, _count: true }),
    prisma.stockMovement.count({ where: { item: { branchId } } }),
  ]);
  const lowStock = items.filter((i) => i.quantity <= i.reorderLevel).length;
  res.json({ totalItems: items.length, lowStock, staff, orders: salesAgg._count, revenue: salesAgg._sum.totalAmount ?? 0, stockMovements: movements });
});

router.post('/staff', async (req: Request, res: Response) => {
  const branchId = req.user!.branchId!;
  const { name, email, password, role } = req.body as { name: string; email: string; password: string; role?: string };
  if (!name || !email || !password) {
    res.status(400).json({ error: 'name, email and password are required.' });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const staff = await prisma.user.create({ data: { name, email, password: hashedPassword, role: (role as any) || 'WAITER', branchId } });
    res.status(201).json({ message: 'Staff account created.', staffId: staff.id });
  } catch {
    res.status(409).json({ error: 'Email already in use.' });
  }
});

router.get('/staff', async (req: Request, res: Response) => {
  const staff = await prisma.user.findMany({
    where: { branchId: req.user!.branchId!, role: { in: ['CHEF', 'CASHIER', 'WAITER'] } },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(staff);
});

router.get('/sales', async (req: Request, res: Response) => {
  const sales = await prisma.sale.findMany({
    where: { branchId: req.user!.branchId! },
    include: { createdBy: { select: { name: true } }, items: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(sales);
});

router.patch('/staff/:id/terminate', async (req: Request, res: Response) => {
  const rawId = req.params['id'];
  const id = Number.parseInt(Array.isArray(rawId) ? rawId[0]! : rawId || '0', 10);
  const staff = await prisma.user.findFirst({ 
    where: { id, branchId: req.user!.branchId!, role: { in: ['CHEF', 'CASHIER', 'WAITER'] } } 
  });
  if (!staff) {
    res.status(404).json({ error: 'Staff member not found in your branch.' });
    return;
  }
  await prisma.user.update({ where: { id }, data: { isActive: false } });
  res.json({ message: 'Staff account terminated.' });
});

router.patch('/staff/:id/activate', async (req: Request, res: Response) => {
  const rawId = req.params['id'];
  const id = Number.parseInt(Array.isArray(rawId) ? rawId[0]! : rawId || '0', 10);
  const staff = await prisma.user.findFirst({ 
    where: { id, branchId: req.user!.branchId!, role: { in: ['CHEF', 'CASHIER', 'WAITER'] } } 
  });
  if (!staff) {
    res.status(404).json({ error: 'Staff member not found in your branch.' });
    return;
  }
  await prisma.user.update({ where: { id }, data: { isActive: true } });
  res.json({ message: 'Staff account activated.' });
});

router.get('/suppliers', async (_req: Request, res: Response) => {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: 'asc' },
  });
  res.json(suppliers);
});

router.post('/suppliers', async (req: Request, res: Response) => {
  const { name, contact, email, phone } = req.body as { name: string; contact?: string; email?: string; phone?: string };
  if (!name) {
    res.status(400).json({ error: 'Supplier name is required.' });
    return;
  }
  const supplier = await prisma.supplier.create({
    data: { name, contact, email, phone },
  });
  res.status(201).json(supplier);
});

export default router;
