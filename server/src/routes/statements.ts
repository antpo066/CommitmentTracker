import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Prisma } from '@prisma/client';

const router = Router();

// Public: list approved statements with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { personId, status, statementType, from, to, page = '1', limit = '20' } = req.query;

    const where: Prisma.StatementWhereInput = { approved: true };
    if (personId) where.personId = personId as string;
    if (status) where.status = status as any;
    if (statementType) where.statementType = statementType as any;
    if (from || to) {
      where.dateMade = {};
      if (from) where.dateMade.gte = new Date(from as string);
      if (to) where.dateMade.lte = new Date(to as string);
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [statements, total] = await Promise.all([
      prisma.statement.findMany({
        where,
        orderBy: { dateMade: 'desc' },
        skip,
        take,
        include: {
          person: { select: { id: true, name: true, slug: true } },
          notes: {
            where: { noteType: { in: ['CONTEXT', 'DISPUTE'] } },
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.statement.count({ where }),
    ]);

    res.json({ statements, total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
});

// Public: get single statement
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const statement = await prisma.statement.findUnique({
      where: { id: req.params.id },
      include: {
        person: { select: { id: true, name: true, slug: true } },
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

// Admin: create a statement (goes to review queue)
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      personId, exactQuote, source, sourceUrl, sourceType,
      dateMade, statementType, impliedDeadline, measurableOutcome,
      confidenceScore, evidenceNote,
    } = req.body;

    if (!personId || !exactQuote || !source || !sourceType || !dateMade || !statementType) {
      res.status(400).json({ error: 'Missing required fields: personId, exactQuote, source, sourceType, dateMade, statementType' });
      return;
    }

    const statement = await prisma.statement.create({
      data: {
        personId,
        exactQuote,
        source,
        sourceUrl,
        sourceType,
        dateMade: new Date(dateMade),
        statementType,
        impliedDeadline: impliedDeadline ? new Date(impliedDeadline) : null,
        measurableOutcome,
        confidenceScore: confidenceScore ? parseInt(confidenceScore) : 3,
        evidenceNote,
        approved: false,
      },
      include: { person: { select: { name: true, slug: true } } },
    });

    res.status(201).json(statement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create statement' });
  }
});

// Admin: update a statement
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      exactQuote, source, sourceUrl, sourceType,
      dateMade, statementType, impliedDeadline, measurableOutcome,
      confidenceScore, status, evidenceNote,
    } = req.body;

    const data: any = {};
    if (exactQuote !== undefined) data.exactQuote = exactQuote;
    if (source !== undefined) data.source = source;
    if (sourceUrl !== undefined) data.sourceUrl = sourceUrl;
    if (sourceType !== undefined) data.sourceType = sourceType;
    if (dateMade !== undefined) data.dateMade = new Date(dateMade);
    if (statementType !== undefined) data.statementType = statementType;
    if (impliedDeadline !== undefined) data.impliedDeadline = impliedDeadline ? new Date(impliedDeadline) : null;
    if (measurableOutcome !== undefined) data.measurableOutcome = measurableOutcome;
    if (confidenceScore !== undefined) data.confidenceScore = parseInt(confidenceScore);
    if (status !== undefined) data.status = status;
    if (evidenceNote !== undefined) data.evidenceNote = evidenceNote;

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

// Admin: delete a statement
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.statement.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete statement' });
  }
});

export default router;
