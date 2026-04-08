import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import personRoutes from './routes/persons';
import statementRoutes from './routes/statements';
import reviewRoutes from './routes/review';
import noteRoutes from './routes/notes';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/statements', statementRoutes);

// Admin routes
app.use('/api/admin/review', reviewRoutes);
app.use('/api/admin/notes', noteRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
