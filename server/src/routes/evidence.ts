import { Router, Response } from 'express';
import { prisma } from '../index';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Add evidence to a statement
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      statementId, sourceDocumentId, excerpt, evidenceDate,
      evidenceType, sourceUrl, sourceTitle, notes, statusChange,
    } = req.body;

    if (!statementId || !excerpt || !evidenceDate || !evidenceType) {
      res.status(400).json({ error: 'statementId, excerpt, evidenceDate, and evidenceType are required' });
      return;
    }

    const evidence = await prisma.evidence.create({
      data: {
        statementId,
        sourceDocumentId: sourceDocumentId || null,
        addedById: req.userId!,
        excerpt,
        evidenceDate: new Date(evidenceDate),
        evidenceType,
        sourceUrl: sourceUrl || null,
        sourceTitle: sourceTitle || null,
        notes: notes || null,
        statusChange: statusChange || null,
      },
    });

    // If statusChange is provided, update the statement status
    if (statusChange) {
      await prisma.statement.update({
        where: { id: statementId },
        data: { status: statusChange },
      });
    }

    res.status(201).json(evidence);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add evidence' });
  }
});

// Get evidence for a statement
router.get('/statement/:statementId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const evidence = await prisma.evidence.findMany({
      where: { statementId: req.params.statementId },
      orderBy: { evidenceDate: 'desc' },
      include: { addedBy: { select: { name: true } } },
    });
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch evidence' });
  }
});

// Delete evidence
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.evidence.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete evidence' });
  }
});

export default router;
