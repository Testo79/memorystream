import express from 'express';
import { db } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET /api/stories/:storyId - Get full story content
router.get('/:storyId', (req, res) => {
    const { storyId } = req.params;

    // Use prepared statement to prevent SQL injection
    const query = `
    SELECT id, title, content, createdAt, placeId
    FROM stories
    WHERE id = ?
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
router.post('/', (req, res) => {
    const { placeId, title, content } = req.body;

    // Validation
    if (!placeId || typeof placeId !== 'string' || placeId.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Place ID is required'
        });
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Story title is required'
        });
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Story content is required'
        });
    }

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
        const query = 'INSERT INTO stories (id, placeId, title, content, createdAt) VALUES (?, ?, ?, ?, ?)';

        db.run(query, [storyId, placeId, title.trim(), content.trim(), createdAt], function(err) {
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
                title: title.trim(),
                content: content.trim(),
                createdAt
            });
        });
    });
});

export default router;
