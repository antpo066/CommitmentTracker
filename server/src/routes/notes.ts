import { Router, Response } from 'express';
import { prisma } from '../index';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Add a note to a statement
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { statementId, content, noteType } = req.body;
    if (!statementId || !content) {
      res.status(400).json({ error: 'statementId and content are required' });
      return;
    }

    const note = await prisma.note.create({
      data: {
        statementId,
        authorId: req.userId!,
        content,
        noteType: noteType || 'CONTEXT',
      },
      include: { author: { select: { name: true } } },
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Delete a note
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.note.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
