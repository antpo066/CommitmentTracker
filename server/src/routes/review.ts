import { Router, Response } from 'express';
import { prisma } from '../index';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get review queue (unapproved statements)
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const statements = await prisma.statement.findMany({
      where: { approved: false },
      orderBy: { createdAt: 'desc' },
      include: {
        person: { select: { id: true, name: true, slug: true } },
        sourceDocument: { select: { id: true, title: true, sourceType: true } },
      },
    });
    res.json(statements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review queue' });
  }
});

// Get all statements (admin view)
router.get('/all', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '50' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [statements, total] = await Promise.all([
      prisma.statement.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          person: { select: { id: true, name: true, slug: true } },
          sourceDocument: { select: { id: true, title: true } },
          reviewedBy: { select: { name: true } },
        },
      }),
      prisma.statement.count(),
    ]);

    res.json({ statements, total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
});

// Approve a statement
router.post('/:id/approve', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status, adminNotes } = req.body;
    const statement = await prisma.statement.update({
      where: { id: req.params.id },
      data: {
        approved: true,
        status: status || undefined,
        adminNotes: adminNotes || undefined,
        reviewedById: req.userId,
        reviewedAt: new Date(),
      },
    });
    res.json(statement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve statement' });
  }
});

// Reject (delete) a statement
router.post('/:id/reject', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.statement.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject statement' });
  }
});

// Update status with evidence
router.patch('/:id/status', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status, adminNotes } = req.body;
    if (!status) { res.status(400).json({ error: 'Status is required' }); return; }

    const statement = await prisma.statement.update({
      where: { id: req.params.id },
      data: {
        status,
        adminNotes: adminNotes || undefined,
        reviewedById: req.userId,
        reviewedAt: new Date(),
      },
    });
    res.json(statement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
