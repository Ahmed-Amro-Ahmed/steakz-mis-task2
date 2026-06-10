import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/logger.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { seedDatabase } from './lib/seed.js';

const app = express();
const port = process.env['PORT'] || 3001;

const manualAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://steakz-mis-task2.vercel.app',
  process.env['FRONTEND_URL'],
].filter(Boolean) as string[];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  const isAllowed =
    !origin ||
    manualAllowedOrigins.includes(origin) ||
    origin.endsWith('.vercel.app');

  if (origin && isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/feedback', feedbackRoutes);

app.listen(port, async () => {
  await seedDatabase();
  console.log(`Steakz MIS backend running on http://localhost:${port}`);
});
