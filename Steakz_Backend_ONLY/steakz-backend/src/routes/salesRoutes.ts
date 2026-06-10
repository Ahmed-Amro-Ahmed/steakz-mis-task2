import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/sales
 * Allows CUSTOMER, CASHIER, WAITER, and BRANCH_MANAGER to create orders.
 */
router.post('/', verifyToken, requireRole(['CASHIER', 'WAITER', 'BRANCH_MANAGER', 'CUSTOMER']), async (req: Request, res: Response) => {
  console.log("POST SALES REACHED:", req.user);
  try {
    // If CUSTOMER, use branchId from body. If Staff, use their assigned branchId.
    const branchId = req.user!.role === 'CUSTOMER' ? Number(req.body.branchId) : req.user!.branchId;
    
    if (!branchId) {
      res.status(400).json({ error: 'branchId is required.' });
      return;
    }

    const { items } = req.body as { items: Array<{ menuItem: string; quantity: number; unitPrice: number; itemId?: number }> };
    if (!items || items.length === 0) {
      res.status(400).json({ error: 'At least one sale item is required.' });
      return;
    }

    const saleItems = items.map((i) => ({
      menuItem: i.menuItem,
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice),
      lineTotal: Number(i.quantity) * Number(i.unitPrice),
      itemId: i.itemId ? Number(i.itemId) : undefined,
    }));

    const totalAmount = saleItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const orderNumber = `STK-${Date.now()}`;

    const sale = await prisma.sale.create({
      data: { 
        orderNumber, 
        branchId: Number(branchId), 
        createdById: req.user!.id, 
        totalAmount, 
        status: 'PENDING', 
        items: { create: saleItems } 
      },
      include: { items: true },
    });

    res.status(201).json(sale);
  } catch (err) {
    console.error('[Error] POST /api/sales failed:', err);
    res.status(500).json({ error: 'Failed to create sale record.' });
  }
});

/**
 * PATCH /api/sales/:id/status
 * Allows Staff to update order lifecycle.
 */
router.patch('/:id/status', verifyToken, requireRole(['CHEF', 'BRANCH_MANAGER', 'ADMIN', 'CASHIER', 'WAITER', 'HEADQUARTER_MANAGER']), async (req: Request, res: Response) => {
  const rawId = req.params['id'];
  const id = Number.parseInt(Array.isArray(rawId) ? rawId[0]! : rawId || '0', 10);
  const { status } = req.body as { status: string };
  const user = req.user!;
  
  const sale = await prisma.sale.findUnique({ where: { id } });
  if (!sale) {
    res.status(404).json({ error: 'Order not found.' });
    return;
  }

  // Security: Branch staff can only update their own branch orders
  const isGlobalManager = user.role === 'ADMIN' || user.role === 'HEADQUARTER_MANAGER';
  if (!isGlobalManager && Number(sale.branchId) !== Number(user.branchId)) {
    res.status(403).json({ error: 'You can only update orders for your own branch.' });
    return;
  }

  // Business Logic: Only service staff can complete orders
  if (status === 'COMPLETED' && user.role === 'CHEF') {
    res.status(403).json({ error: 'Chefs cannot complete orders.' });
    return;
  }

  // Business Logic: Orders must be READY before completion by service staff
  if (status === 'COMPLETED' && (user.role === 'CASHIER' || user.role === 'WAITER') && sale.status !== 'READY') {
    res.status(400).json({ error: 'Orders must be READY before completion.' });
    return;
  }

  const updated = await prisma.sale.update({
    where: { id },
    data: { status: status as any },
  });
  res.json(updated);
});

/**
 * GET /api/sales/mine
 * Allows CUSTOMER to see their own orders.
 * Allows Staff to see branch/all orders.
 */
router.get('/mine', verifyToken, requireRole(['CHEF', 'BRANCH_MANAGER', 'ADMIN', 'CASHIER', 'WAITER', 'HEADQUARTER_MANAGER', 'CUSTOMER']), async (req: Request, res: Response) => {
  const user = req.user!;
  let filter: any = {};

  if (user.role === 'CUSTOMER') {
    // Customers only see orders they created
    filter = { createdById: user.id };
  } else if (user.role === 'ADMIN' || user.role === 'HEADQUARTER_MANAGER') {
    // Global views
    filter = {};
  } else {
    // Branch staff only see their branch
    filter = { branchId: user.branchId! };
  }

  const sales = await prisma.sale.findMany({
    where: filter,
    include: { createdBy: { select: { name: true } }, items: true, branch: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(sales);
});

export default router;
