import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: list all persons
router.get('/', async (_req: Request, res: Response) => {
  try {
    const persons = await prisma.person.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { statements: { where: { approved: true } } } },
      },
    });

    const result = persons.map((p) => ({
      ...p,
      totalStatements: p._count.statements,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch persons' });
  }
});

// Public: get person by slug with stats
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const person = await prisma.person.findUnique({
      where: { slug: req.params.slug },
      include: {
        statements: {
          where: { approved: true },
          select: { status: true },
        },
      },
    });

    if (!person) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    // Compute stats
    const stats = {
      kept: 0, delayed: 0, contradicted: 0, unresolved: 0,
      tooVague: 0, partiallyFulfilled: 0,
    };
    for (const s of person.statements) {
      if (s.status === 'KEPT') stats.kept++;
      else if (s.status === 'DELAYED') stats.delayed++;
      else if (s.status === 'CONTRADICTED') stats.contradicted++;
      else if (s.status === 'UNRESOLVED') stats.unresolved++;
      else if (s.status === 'TOO_VAGUE') stats.tooVague++;
      else if (s.status === 'PARTIALLY_FULFILLED') stats.partiallyFulfilled++;
    }

    const { statements: _, ...personData } = person;
    res.json({
      ...personData,
      totalStatements: person.statements.length,
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch person' });
  }
});

// Admin: create person
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, title, description, imageUrl, trackedSources } = req.body;
    if (!name) { res.status(400).json({ error: 'Name is required' }); return; }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const person = await prisma.person.create({
      data: {
        name, slug, title, description, imageUrl,
        trackedSources: trackedSources || [],
        coverageFrom: new Date(),
      },
    });
    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create person' });
  }
});

// Admin: update person
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, title, description, imageUrl, trackedSources } = req.body;
    const person = await prisma.person.update({
      where: { id: req.params.id },
      data: { name, title, description, imageUrl, trackedSources },
    });
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update person' });
  }
});

export default router;
