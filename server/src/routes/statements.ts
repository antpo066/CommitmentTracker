import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Prisma } from '@prisma/client';

const router = Router();

// Public: list approved statements with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { personId, personSlug, status, statementType, from, to, page = '1', limit = '20' } = req.query;

    const where: Prisma.StatementWhereInput = { approved: true };
    if (personId) where.personId = personId as string;
    if (personSlug) where.person = { slug: personSlug as string };
    if (status) where.status = status as any;
    if (statementType) where.statementType = statementType as any;
    if (from || to) {
      where.sourceDate = {};
      if (from) where.sourceDate.gte = new Date(from as string);
      if (to) where.sourceDate.lte = new Date(to as string);
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [statements, total] = await Promise.all([
      prisma.statement.findMany({
        where,
        orderBy: { sourceDate: 'desc' },
        skip,
        take,
        include: {
          person: { select: { id: true, name: true, slug: true } },
          sourceDocument: { select: { id: true, title: true, sourceType: true } },
          evidence: { select: { id: true, evidenceType: true, excerpt: true, evidenceDate: true, sourceTitle: true } },
          _count: { select: { notes: true, disputes: true } },
        },
      }),
      prisma.statement.count({ where }),
    ]);

    res.json({ statements, total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
});

// Public: get single approved statement with full details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const statement = await prisma.statement.findUnique({
      where: { id: req.params.id },
      include: {
        person: { select: { id: true, name: true, slug: true, title: true } },
        sourceDocument: true,
        evidence: {
          orderBy: { evidenceDate: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { name: true } } },
        },
      },
    });

    if (!statement || !statement.approved) {
      res.status(404).json({ error: 'Statement not found' });
      return;
    }
    res.json(statement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statement' });
  }
});

// Admin: create statement (goes to review queue)
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      personId, sourceDocumentId, exactQuote, context, interpretation,
      statementType, sourceTitle, sourceUrl, sourceDate,
      impliedDeadline, measurableOutcome, confidenceScore,
      adminNotes, aiExtracted, aiConfidence,
    } = req.body;

    if (!personId || !exactQuote || !statementType || !sourceTitle || !sourceDate) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const statement = await prisma.statement.create({
      data: {
        personId,
        sourceDocumentId: sourceDocumentId || null,
        exactQuote,
        context: context || null,
        interpretation: interpretation || null,
        statementType,
        sourceTitle,
        sourceUrl: sourceUrl || null,
        sourceDate: new Date(sourceDate),
        impliedDeadline: impliedDeadline ? new Date(impliedDeadline) : null,
        measurableOutcome: measurableOutcome || null,
        confidenceScore: confidenceScore ? parseInt(confidenceScore) : 3,
        adminNotes: adminNotes || null,
        approved: false,
        aiExtracted: aiExtracted || false,
        aiConfidence: aiConfidence || null,
      },
      include: { person: { select: { name: true, slug: true } } },
    });

    res.status(201).json(statement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create statement' });
  }
});

// Admin: update statement
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data: any = {};
    const fields = [
      'exactQuote', 'context', 'interpretation', 'statementType',
      'sourceTitle', 'sourceUrl', 'adminNotes', 'measurableOutcome',
    ];
    for (const f of fields) {
      if (req.body[f] !== undefined) data[f] = req.body[f];
    }
    if (req.body.sourceDate) data.sourceDate = new Date(req.body.sourceDate);
    if (req.body.impliedDeadline !== undefined) data.impliedDeadline = req.body.impliedDeadline ? new Date(req.body.impliedDeadline) : null;
    if (req.body.confidenceScore !== undefined) data.confidenceScore = parseInt(req.body.confidenceScore);
    if (req.body.status !== undefined) data.status = req.body.status;

    const statement = await prisma.statement.update({
      where: { id: req.params.id },
      data,
      include: { person: { select: { name: true, slug: true } } },
    });
    res.json(statement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update statement' });
  }
});

// Admin: delete statement
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.statement.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete statement' });
  }
});

export default router;
