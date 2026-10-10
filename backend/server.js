require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const resourceRoutes = require('./routes/resources');
const teacherRoutes = require('./routes/teachers');
const assignmentRoutes = require('./routes/assignments');
const commentRoutes = require('./routes/comments');
const ratingRoutes = require('./routes/ratings');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Add it to your .env file (or Render environment variables).');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// ---- API ----
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// ---- Frontend ----
// The same server also serves the website files, so the whole app lives at one
// URL (no CORS problems, and nothing else to host).
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Study Vault running on http://localhost:${PORT}`);
});
