import express from 'express';
import { db } from '../database.js';
import { requireAuth } from '../middleware/auth.js';
import { validateCreateStoryBody } from '../middleware/validation.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET /api/stories/:storyId - Get full story content
router.get('/:storyId', (req, res) => {
    const { storyId } = req.params;

    // Use prepared statement to prevent SQL injection
    const query = `
    SELECT 
      s.id,
      s.title,
      s.content,
      s.createdAt,
      s.placeId,
      s.userId,
      u.email as authorEmail,
      u.firstName as authorFirstName,
      u.lastName as authorLastName
    FROM stories s
    LEFT JOIN users u ON u.id = s.userId
    WHERE s.id = ?
  `;

    db.get(query, [storyId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to fetch story'
            });
        }

        if (!row) {
            return res.status(404).json({
                error: 'Story not found',
                message: `No story found with id: ${storyId}`
            });
        }

        res.json(row);
    });
});

// POST /api/stories - Create a new story for a place
router.post('/', requireAuth, validateCreateStoryBody, (req, res) => {
    const { placeId, title, content } = req.body;

    // Check if place exists
    db.get('SELECT id FROM places WHERE id = ?', [placeId], (err, place) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to verify place'
            });
        }

        if (!place) {
            return res.status(404).json({
                error: 'Place not found',
                message: `No place found with id: ${placeId}`
            });
        }

        // Create story
        const storyId = uuidv4();
        const createdAt = new Date().toISOString();
        const query = 'INSERT INTO stories (id, placeId, userId, title, content, createdAt) VALUES (?, ?, ?, ?, ?, ?)';

        db.run(query, [storyId, placeId, req.user.id, title, content, createdAt], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    error: 'Internal server error',
                    message: 'Failed to create story'
                });
            }

            res.status(201).json({
                id: storyId,
                placeId,
                userId: req.user.id,
                title,
                content,
                createdAt,
                authorEmail: req.user.email,
                authorFirstName: req.user.firstName || null,
                authorLastName: req.user.lastName || null
            });
        });
    });
});

// DELETE /api/stories/:storyId - Delete a story (only author)
router.delete('/:storyId', requireAuth, (req, res) => {
    const { storyId } = req.params;

    if (!storyId || typeof storyId !== 'string') {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Story ID is required'
        });
    }

    const query = 'DELETE FROM stories WHERE id = ? AND userId = ?';

    db.run(query, [storyId, req.user.id], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to delete story'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Story not found',
                message: 'No story found for this user with the given id'
            });
        }

        return res.status(204).send();
    });
});

export default router;
