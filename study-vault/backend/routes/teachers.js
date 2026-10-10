const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes here require a logged-in Chairman
router.use(authenticate, authorize('chairman'));

// List all teachers, with their currently assigned courses
router.get('/', async (req, res) => {
  try {
    const [teachers] = await pool.query(
      `SELECT id, name, email, created_at FROM users WHERE role = 'teacher' ORDER BY name`
    );

    const [assignments] = await pool.query(
      `SELECT ca.teacher_id, c.id AS course_id, c.code, c.title
       FROM course_assignments ca
       JOIN courses c ON c.id = ca.course_id`
    );

    const withCourses = teachers.map(t => ({
      ...t,
      courses: assignments.filter(a => a.teacher_id === t.id)
        .map(a => ({ id: a.course_id, code: a.code, title: a.title }))
    }));

    res.json(withCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load teachers.' });
  }
});

// Create a new teacher account
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Teacher name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase(), passwordHash, 'teacher']
    );

    res.status(201).json({ id: result.insertId, name: name.trim(), email: email.toLowerCase() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create teacher account.' });
  }
});

// Remove a teacher account (their course assignments cascade-delete)
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ? AND role = "teacher"', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not remove teacher.' });
  }
});

module.exports = router;
