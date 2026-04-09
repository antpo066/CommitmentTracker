import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: submit a dispute/correction
router.post('/', async (req: Request, res: Response) => {
  try {
    const { statementId, submitterName, submitterEmail, content, sourceUrl, disputeType } = req.body;

    if (!statementId || !submitterName || !content || !disputeType) {
      res.status(400).json({ error: 'statementId, submitterName, content, and disputeType are required' });
      return;
    }

    // Verify statement exists and is approved
    const statement = await prisma.statement.findFirst({
      where: { id: statementId, approved: true },
    });
    if (!statement) {
      res.status(404).json({ error: 'Statement not found' });
      return;
    }

    const dispute = await prisma.dispute.create({
      data: {
        statementId,
        submitterName,
        submitterEmail: submitterEmail || null,
        content,
        sourceUrl: sourceUrl || null,
        disputeType,
      },
    });

    res.status(201).json({ success: true, id: dispute.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit correction' });
  }
});

// Admin: list pending disputes
router.get('/pending', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const disputes = await prisma.dispute.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: {
        statement: {
          select: { id: true, exactQuote: true, person: { select: { name: true } } },
        },
      },
    });
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
});

// Admin: review a dispute
router.patch('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status, reviewNote } = req.body;
    if (!status) { res.status(400).json({ error: 'status is required' }); return; }

    const dispute = await prisma.dispute.update({
      where: { id: req.params.id },
      data: {
        status,
        reviewNote: reviewNote || null,
        reviewedById: req.userId,
        reviewedAt: new Date(),
      },
    });
    res.json(dispute);
  } catch (error) {
    res.status(500).json({ error: 'Failed to review dispute' });
  }
});

export default router;
