const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// Chairman: view every course -> teacher assignment
router.get('/', authorize('chairman'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ca.id, c.id AS course_id, c.code, c.title, u.id AS teacher_id, u.name AS teacher_name
       FROM course_assignments ca
       JOIN courses c ON c.id = ca.course_id
       JOIN users u ON u.id = ca.teacher_id
       ORDER BY c.year, c.semester, c.code`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load assignments.' });
  }
});

// Teacher: view only their own assigned courses
router.get('/mine', authorize('teacher'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id AS course_id, c.code, c.title, c.year, c.semester
       FROM course_assignments ca
       JOIN courses c ON c.id = ca.course_id
       WHERE ca.teacher_id = ?
       ORDER BY c.year, c.semester, c.code`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load your assigned courses.' });
  }
});

// Chairman: assign a teacher to a course
router.post('/', authorize('chairman'), async (req, res) => {
  try {
    const { course_id, teacher_id } = req.body;
    if (!course_id || !teacher_id) {
      return res.status(400).json({ error: 'course_id and teacher_id are required.' });
    }

    const [[course]] = await pool.query('SELECT id FROM courses WHERE id = ?', [course_id]);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const [[teacher]] = await pool.query(`SELECT id FROM users WHERE id = ? AND role = 'teacher'`, [teacher_id]);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found.' });

    await pool.query(
      'INSERT IGNORE INTO course_assignments (course_id, teacher_id) VALUES (?, ?)',
      [course_id, teacher_id]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not assign course.' });
  }
});

// Chairman: remove an assignment
router.delete('/:id', authorize('chairman'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM course_assignments WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Assignment not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not remove assignment.' });
  }
});

module.exports = router;
