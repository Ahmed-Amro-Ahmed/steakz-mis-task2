import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(verifyToken, requireRole(['ADMIN', 'HEADQUARTER_MANAGER', 'BRANCH_MANAGER']));

router.get('/summary', async (req: Request, res: Response) => {
  const isGlobal = req.user!.role === 'ADMIN' || req.user!.role === 'HEADQUARTER_MANAGER';
  const branchFilter = isGlobal ? {} : { branchId: req.user!.branchId! };
  const [sales, items, feedbackAgg] = await Promise.all([
    prisma.sale.aggregate({ where: branchFilter, _sum: { totalAmount: true }, _count: true }),
    prisma.inventoryItem.findMany({ where: branchFilter, include: { branch: true } }),
    prisma.customerFeedback.aggregate({ 
      where: branchFilter, 
      _avg: { rating: true }, 
      _count: true 
    }),
  ]);
  
  const lowStock = items.filter((item) => item.quantity <= item.reorderLevel);
  
  res.json({ 
    revenue: sales._sum.totalAmount ?? 0, 
    orders: sales._count, 
    inventoryItems: items.length, 
    lowStock,
    feedback: {
      averageRating: feedbackAgg._avg.rating ?? 0,
      totalCount: feedbackAgg._count
    }
  });
});

router.get('/sales', async (req: Request, res: Response) => {
  const { start, end } = req.query as { start?: string; end?: string };
  const isGlobal = req.user!.role === 'ADMIN' || req.user!.role === 'HEADQUARTER_MANAGER';
  const branchFilter = isGlobal ? {} : { branchId: req.user!.branchId! };
  
  const dateFilter: any = {};
  if (start) dateFilter.gte = new Date(start);
  if (end) dateFilter.lte = new Date(end);

  const sales = await prisma.sale.findMany({
    where: {
      ...branchFilter,
      ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
    },
    include: { branch: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  });

  // Simple daily breakdown
  const dailyBreakdown: Record<string, number> = {};
  sales.forEach((s) => {
    const date = s.createdAt.toISOString().split('T')[0];
    if (date) {
      dailyBreakdown[date] = (dailyBreakdown[date] || 0) + s.totalAmount;
    }
  });

  res.json({
    totalSales: sales.length,
    totalRevenue: sales.reduce((sum, s) => sum + s.totalAmount, 0),
    dailyBreakdown: Object.entries(dailyBreakdown).map(([date, revenue]) => ({ date, revenue })),
    sales,
  });
});

export default router;
