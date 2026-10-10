const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// List every course (any logged-in role can browse the catalog)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, code, title, year, semester FROM courses ORDER BY year, semester, code');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load courses.' });
  }
});

// Chairman only: add a new course to the catalog
router.post('/', authorize('chairman'), async (req, res) => {
  try {
    const { code, title, year, semester } = req.body;
    if (!code || !title || !year || !semester) {
      return res.status(400).json({ error: 'code, title, year and semester are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO courses (code, title, year, semester) VALUES (?, ?, ?, ?)',
      [code.trim(), title.trim(), year, semester]
    );
    res.status(201).json({ id: result.insertId, code, title, year, semester });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A course with this code already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not create course.' });
  }
});

module.exports = router;
