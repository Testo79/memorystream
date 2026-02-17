import express from 'express';
import { db } from '../database.js';
import { validateBoundingBox } from '../middleware/validation.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET /api/places - Get places within bounding box with story count
router.get('/', validateBoundingBox, (req, res) => {
    const { minLat, minLng, maxLat, maxLng } = req.bbox;

    // Use prepared statement to prevent SQL injection
    const query = `
    SELECT 
      p.id,
      p.name,
      p.lat,
      p.lng,
      COUNT(s.id) as storyCount
    FROM places p
    LEFT JOIN stories s ON p.id = s.placeId
    WHERE p.lat BETWEEN ? AND ? AND p.lng BETWEEN ? AND ?
    GROUP BY p.id
  `;

    db.all(query, [minLat, maxLat, minLng, maxLng], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to fetch places'
            });
        }

        res.json(rows);
    });
});

// GET /api/places/:placeId/stories - Get all stories for a specific place
router.get('/:placeId/stories', (req, res) => {
    const { placeId } = req.params;

    // Use prepared statement to prevent SQL injection
    const query = `
    SELECT id, title, createdAt
    FROM stories
    WHERE placeId = ?
    ORDER BY createdAt DESC
  `;

    db.all(query, [placeId], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to fetch stories for place'
            });
        }

        res.json(rows);
    });
});

// POST /api/places - Create a new place
router.post('/', (req, res) => {
    const { name, lat, lng } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Place name is required'
        });
    }

    if (typeof lat !== 'number' || lat < -90 || lat > 90) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Valid latitude (-90 to 90) is required'
        });
    }

    if (typeof lng !== 'number' || lng < -180 || lng > 180) {
        return res.status(400).json({
            error: 'Validation error',
            message: 'Valid longitude (-180 to 180) is required'
        });
    }

    const placeId = uuidv4();
    const query = 'INSERT INTO places (id, name, lat, lng) VALUES (?, ?, ?, ?)';

    db.run(query, [placeId, name.trim(), lat, lng], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to create place'
            });
        }

        res.status(201).json({
            id: placeId,
            name: name.trim(),
            lat,
            lng,
            storyCount: 0
        });
    });
});

export default router;
