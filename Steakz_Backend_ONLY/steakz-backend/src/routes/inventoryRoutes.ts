import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin and Manager can do everything. Staff can only VIEW (GET).
router.use(verifyToken);

router.get('/', requireRole(['ADMIN', 'HEADQUARTER_MANAGER', 'BRANCH_MANAGER', 'CHEF', 'CASHIER', 'WAITER']), async (req: Request, res: Response) => {
  // If ADMIN/HQ, show all. If others, show branch specific.
  const isGlobal = req.user!.role === 'ADMIN' || req.user!.role === 'HEADQUARTER_MANAGER';
  const branchFilter = isGlobal ? {} : { branchId: req.user!.branchId! };
  
  const items = await prisma.inventoryItem.findMany({
    where: branchFilter,
    include: { supplier: true, branch: { select: { name: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(items);
});

// Manual update of quantity (Simpler MIS approach)
router.patch('/:id/quantity', requireRole(['ADMIN', 'BRANCH_MANAGER', 'CHEF']), async (req: Request, res: Response) => {
  const rawId = req.params['id'];
  const id = Number.parseInt(Array.isArray(rawId) ? rawId[0]! : rawId || '0', 10);
  const { quantity } = req.body as { quantity: number };
  
  if (quantity === undefined) {
    res.status(400).json({ error: 'quantity is required.' });
    return;
  }

  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!item) {
    res.status(404).json({ error: 'Item not found.' });
    return;
  }

  // Security check: Branch staff can only update their own branch
  const isGlobal = req.user!.role === 'ADMIN' || req.user!.role === 'HEADQUARTER_MANAGER';
  if (!isGlobal && item.branchId !== req.user!.branchId) {
    res.status(403).json({ error: 'You can only update inventory for your own branch.' });
    return;
  }

  const updated = await prisma.inventoryItem.update({
    where: { id },
    data: { quantity: Number(quantity) },
  });
  
  res.json(updated);
});

router.post('/', requireRole(['ADMIN', 'BRANCH_MANAGER']), async (req: Request, res: Response) => {
  const isGlobal = req.user!.role === 'ADMIN' || req.user!.role === 'HEADQUARTER_MANAGER';
  const branchId = isGlobal ? req.body.branchId : req.user!.branchId;
  const { name, category, unit, quantity, reorderLevel, costPerUnit, supplierId } = req.body as {
    name: string; category: string; unit: string; quantity: number; reorderLevel: number; costPerUnit: number; supplierId?: number;
  };

  if (!branchId || !name || !category || !unit) {
    res.status(400).json({ error: 'branchId, name, category and unit are required.' });
    return;
  }

  const item = await prisma.inventoryItem.create({
    data: { 
      name, 
      category, 
      unit, 
      quantity: Number(quantity) || 0, 
      reorderLevel: Number(reorderLevel) || 0, 
      costPerUnit: Number(costPerUnit) || 0, 
      branchId: Number(branchId),
      supplierId: supplierId ? Number(supplierId) : undefined
    },
  });
  res.status(201).json(item);
});

export default router;
