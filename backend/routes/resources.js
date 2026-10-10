const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// Detect resource type (yt / drive / link) from the URL, so contributors
// don't have to get it right themselves.
function detectType(link) {
  const l = (link || '').toLowerCase();
  if (l.includes('drive.google.com') || l.includes('docs.google.com')) return 'drive';
  if (l.includes('youtube.com') || l.includes('youtu.be')) return 'yt';
  return 'link';
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Confirms a teacher is assigned to a given course. Chairman is always allowed.
async function canManageCourse(user, courseId) {
  if (user.role === 'chairman') return true;
  if (user.role !== 'teacher') return false;
  const [rows] = await pool.query(
    'SELECT id FROM course_assignments WHERE course_id = ? AND teacher_id = ?',
    [courseId, user.id]
  );
  return rows.length > 0;
}

// GET /api/resources?course_id=5
// Students / anyone: only approved resources.
// Teacher/Chairman: pass &status=pending to see pending items too (teacher limited to their own courses).
router.get('/', async (req, res) => {
  try {
    const { course_id, status } = req.query;
    if (!course_id) return res.status(400).json({ error: 'course_id is required.' });

    let query = `
      SELECT r.*, u.name AS submitted_by_name,
        (SELECT AVG(rating) FROM ratings WHERE resource_id = r.id) AS avg_rating,
        (SELECT COUNT(*) FROM ratings WHERE resource_id = r.id) AS rating_count,
        (SELECT rating FROM ratings WHERE resource_id = r.id AND user_id = ?) AS my_rating,
        (SELECT COUNT(*) FROM comments WHERE resource_id = r.id) AS comment_count
      FROM resources r
      LEFT JOIN users u ON u.id = r.submitted_by
      WHERE r.course_id = ?`;
    const params = [req.user.id, course_id];

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      if (status !== 'approved') {
        const allowed = await canManageCourse(req.user, course_id);
        if (!allowed) return res.status(403).json({ error: 'Not permitted to view this.' });
      }
      query += ' AND r.status = ?';
      params.push(status);
    } else {
      query += ` AND r.status = 'approved'`;
    }

    query += ' ORDER BY r.created_at DESC';
    const [rows] = await pool.query(query, params);

    const formatted = rows.map(r => ({
      ...r,
      avg_rating: r.avg_rating ? Number(r.avg_rating).toFixed(1) : null,
      rating_count: Number(r.rating_count) || 0,
      comment_count: Number(r.comment_count) || 0
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load resources.' });
  }
});

// Teacher: pending submissions across all of their assigned courses, for a
// single "Approvals" inbox view.
router.get('/pending/mine', authorize('teacher'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, c.code AS course_code, c.title AS course_title, u.name AS submitted_by_name
       FROM resources r
       JOIN courses c ON c.id = r.course_id
       JOIN course_assignments ca ON ca.course_id = r.course_id AND ca.teacher_id = ?
       LEFT JOIN users u ON u.id = r.submitted_by
       WHERE r.status = 'pending'
       ORDER BY r.created_at ASC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load pending resources.' });
  }
});

// POST /api/resources
// Student  -> goes in as 'pending'
// Teacher  -> must be assigned to the course, goes in as 'approved' directly
// Chairman -> goes in as 'approved' directly
router.post('/', async (req, res) => {
  try {
    const { course_id, title, link } = req.body;

    if (!course_id) return res.status(400).json({ error: 'course_id is required.' });
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Please enter a descriptive title (at least 3 characters).' });
    }
    if (!isValidUrl(link)) {
      return res.status(400).json({ error: 'Please enter a valid link starting with https://' });
    }

    const [[course]] = await pool.query('SELECT id FROM courses WHERE id = ?', [course_id]);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const [[dup]] = await pool.query(
      `SELECT id FROM resources WHERE course_id = ? AND link = ? AND status != 'rejected'`,
      [course_id, link.trim()]
    );
    if (dup) return res.status(409).json({ error: 'This link has already been added to this course.' });

    const type = detectType(link);
    let status = 'pending';

    if (req.user.role === 'chairman') {
      status = 'approved';
    } else if (req.user.role === 'teacher') {
      const allowed = await canManageCourse(req.user, course_id);
      if (!allowed) {
        return res.status(403).json({ error: 'You can only add resources to courses assigned to you.' });
      }
      status = 'approved';
    }
    // students always land as 'pending'

    const reviewedFields = status === 'approved'
      ? [req.user.id, new Date()]
      : [null, null];

    const [result] = await pool.query(
      `INSERT INTO resources (course_id, title, link, type, status, submitted_by, reviewed_by, reviewed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [course_id, title.trim(), link.trim(), type, status, req.user.id, ...reviewedFields]
    );

    res.status(201).json({
      id: result.insertId,
      course_id, title: title.trim(), link: link.trim(), type, status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit resource.' });
  }
});

// PUT /api/resources/:id - edit (teacher of that course, or chairman)
router.put('/:id', async (req, res) => {
  try {
    const [[resource]] = await pool.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (!resource) return res.status(404).json({ error: 'Resource not found.' });

    const allowed = await canManageCourse(req.user, resource.course_id);
    if (!allowed) return res.status(403).json({ error: 'Not permitted to edit this resource.' });

    const { title, link } = req.body;
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Please enter a descriptive title (at least 3 characters).' });
    }
    if (!isValidUrl(link)) {
      return res.status(400).json({ error: 'Please enter a valid link starting with https://' });
    }

    const type = detectType(link);
    await pool.query('UPDATE resources SET title = ?, link = ?, type = ? WHERE id = ?', [
      title.trim(), link.trim(), type, req.params.id
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update resource.' });
  }
});

// DELETE /api/resources/:id - teacher of that course, or chairman
router.delete('/:id', async (req, res) => {
  try {
    const [[resource]] = await pool.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (!resource) return res.status(404).json({ error: 'Resource not found.' });

    const allowed = await canManageCourse(req.user, resource.course_id);
    if (!allowed) return res.status(403).json({ error: 'Not permitted to delete this resource.' });

    await pool.query('DELETE FROM resources WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete resource.' });
  }
});

// PUT /api/resources/:id/approve
router.put('/:id/approve', async (req, res) => {
  try {
    const [[resource]] = await pool.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (!resource) return res.status(404).json({ error: 'Resource not found.' });

    const allowed = await canManageCourse(req.user, resource.course_id);
    if (!allowed) return res.status(403).json({ error: 'Not permitted to review this resource.' });

    await pool.query(
      `UPDATE resources SET status = 'approved', reviewed_by = ?, reviewed_at = NOW() WHERE id = ?`,
      [req.user.id, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not approve resource.' });
  }
});

// PUT /api/resources/:id/reject
router.put('/:id/reject', async (req, res) => {
  try {
    const [[resource]] = await pool.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (!resource) return res.status(404).json({ error: 'Resource not found.' });

    const allowed = await canManageCourse(req.user, resource.course_id);
    if (!allowed) return res.status(403).json({ error: 'Not permitted to review this resource.' });

    await pool.query(
      `UPDATE resources SET status = 'rejected', reviewed_by = ?, reviewed_at = NOW() WHERE id = ?`,
      [req.user.id, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reject resource.' });
  }
});

module.exports = router;
