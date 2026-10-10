const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/ratings?resource_id=5
// Returns { average, count, myRating } for a single resource.
router.get('/', async (req, res) => {
  try {
    const { resource_id } = req.query;
    if (!resource_id) return res.status(400).json({ error: 'resource_id is required.' });

    const [[stats]] = await pool.query(
      'SELECT AVG(rating) AS average, COUNT(*) AS count FROM ratings WHERE resource_id = ?',
      [resource_id]
    );

    let myRating = null;
    if (req.user.role === 'student') {
      const [[mine]] = await pool.query(
        'SELECT rating FROM ratings WHERE resource_id = ? AND user_id = ?',
        [resource_id, req.user.id]
      );
      myRating = mine ? mine.rating : null;
    }

    res.json({
      average: stats.average ? Number(stats.average).toFixed(1) : null,
      count: stats.count,
      myRating
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load rating.' });
  }
});

// POST /api/ratings  { resource_id, rating }  - students only
// Submitting again updates their existing rating rather than creating a duplicate.
router.post('/', authorize('student'), async (req, res) => {
  try {
    const { resource_id, rating } = req.body;
    const value = Number(rating);

    if (!resource_id) return res.status(400).json({ error: 'resource_id is required.' });
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return res.status(400).json({ error: 'Rating must be a whole number from 1 to 5.' });
    }

    const [[resource]] = await pool.query('SELECT id FROM resources WHERE id = ?', [resource_id]);
    if (!resource) return res.status(404).json({ error: 'Resource not found.' });

    await pool.query(
      `INSERT INTO ratings (resource_id, user_id, rating) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [resource_id, req.user.id, value]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit rating.' });
  }
});

module.exports = router;
