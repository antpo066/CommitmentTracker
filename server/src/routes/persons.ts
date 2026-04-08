import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: list all tracked persons
router.get('/', async (_req: Request, res: Response) => {
  try {
    const persons = await prisma.person.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { statements: { where: { approved: true } } } },
      },
    });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch persons' });
  }
});

// Public: get person by slug with their approved statements
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const person = await prisma.person.findUnique({
      where: { slug: req.params.slug },
      include: {
        statements: {
          where: { approved: true },
          orderBy: { dateMade: 'desc' },
          include: {
            notes: {
              where: { noteType: { in: ['CONTEXT', 'DISPUTE'] } },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!person) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch person' });
  }
});

// Admin: create a new person
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, title, description, imageUrl } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const person = await prisma.person.create({
      data: { name, slug, title, description, imageUrl },
    });
    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create person' });
  }
});

// Admin: update a person
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, title, description, imageUrl } = req.body;
    const person = await prisma.person.update({
      where: { id: req.params.id },
      data: { name, title, description, imageUrl },
    });
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update person' });
  }
});

export default router;
