const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/comments?resource_id=5
// Returns a flat list (with user name + role); the frontend nests replies under their parent.
router.get('/', async (req, res) => {
  try {
    const { resource_id } = req.query;
    if (!resource_id) return res.status(400).json({ error: 'resource_id is required.' });

    const [rows] = await pool.query(
      `SELECT c.id, c.resource_id, c.parent_id, c.content, c.created_at,
              u.id AS user_id, u.name AS user_name, u.role AS user_role
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.resource_id = ?
       ORDER BY c.created_at ASC`,
      [resource_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load comments.' });
  }
});

// POST /api/comments  { resource_id, content, parent_id (optional) }
// Any logged-in role can post a question or a reply.
router.post('/', async (req, res) => {
  try {
    const { resource_id, content, parent_id } = req.body;

    if (!resource_id) return res.status(400).json({ error: 'resource_id is required.' });
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment cannot be empty.' });
    }
    if (content.trim().length > 2000) {
      return res.status(400).json({ error: 'Comment is too long (max 2000 characters).' });
    }

    const [[resource]] = await pool.query('SELECT id FROM resources WHERE id = ?', [resource_id]);
    if (!resource) return res.status(404).json({ error: 'Resource not found.' });

    if (parent_id) {
      const [[parent]] = await pool.query(
        'SELECT id FROM comments WHERE id = ? AND resource_id = ?', [parent_id, resource_id]
      );
      if (!parent) return res.status(404).json({ error: 'The comment you are replying to was not found.' });
    }

    const [result] = await pool.query(
      'INSERT INTO comments (resource_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)',
      [resource_id, req.user.id, parent_id || null, content.trim()]
    );

    res.status(201).json({
      id: result.insertId,
      resource_id, parent_id: parent_id || null,
      content: content.trim(),
      user_id: req.user.id, user_name: req.user.name, user_role: req.user.role,
      created_at: new Date()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not post comment.' });
  }
});

// DELETE /api/comments/:id - the author, or the Chairman, can remove a comment
router.delete('/:id', async (req, res) => {
  try {
    const [[comment]] = await pool.query('SELECT * FROM comments WHERE id = ?', [req.params.id]);
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });

    const allowed = req.user.role === 'chairman' || comment.user_id === req.user.id;
    if (!allowed) return res.status(403).json({ error: 'You can only delete your own comments.' });

    await pool.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete comment.' });
  }
});

module.exports = router;
