import { Router, Response } from 'express';
import { prisma } from '../index';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// List source documents for a person
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { personId } = req.query;
    const where = personId ? { personId: personId as string } : {};

    const sources = await prisma.sourceDocument.findMany({
      where,
      orderBy: { sourceDate: 'desc' },
      include: {
        person: { select: { name: true, slug: true } },
        _count: { select: { statements: true } },
      },
    });
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
});

// Get single source document
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const source = await prisma.sourceDocument.findUnique({
      where: { id: req.params.id },
      include: {
        person: { select: { name: true, slug: true } },
        statements: {
          include: { person: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!source) { res.status(404).json({ error: 'Source not found' }); return; }
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch source' });
  }
});

// Ingest a new source document
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { personId, title, url, sourceType, sourceDate, rawText, excerpt } = req.body;

    if (!personId || !title || !sourceType || !sourceDate || !rawText) {
      res.status(400).json({ error: 'personId, title, sourceType, sourceDate, and rawText are required' });
      return;
    }

    const source = await prisma.sourceDocument.create({
      data: {
        personId,
        title,
        url: url || null,
        sourceType,
        sourceDate: new Date(sourceDate),
        rawText,
        excerpt: excerpt || null,
      },
      include: { person: { select: { name: true, slug: true } } },
    });

    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create source document' });
  }
});

// Mark source as ingested (extraction has been run)
router.patch('/:id/ingested', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const source = await prisma.sourceDocument.update({
      where: { id: req.params.id },
      data: { ingested: true },
    });
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update source' });
  }
});

// Delete source document
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.sourceDocument.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete source' });
  }
});

export default router;
