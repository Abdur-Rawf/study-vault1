// Run once after creating the tables.
//   Local:  npm run seed
//   Cloud:  node seed.js .env.cloud
require('./loadEnv')(process.argv[2]);
const bcrypt = require('bcryptjs');
const pool = require('./db');
const syllabus = require('./seedData');

async function seed() {
  console.log('Seeding Study Vault database...');

  // 1. Default Chairman account (only if one doesn't already exist)
  const chairmanEmail = (process.env.CHAIRMAN_EMAIL || 'chairman@mbstu.ac.bd').toLowerCase();
  const [[existingChairman]] = await pool.query(
    'SELECT id FROM users WHERE email = ?', [chairmanEmail]
  );

  if (!existingChairman) {
    const hash = await bcrypt.hash(process.env.CHAIRMAN_PASSWORD || 'changeme123', 10);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'chairman')`,
      [process.env.CHAIRMAN_NAME || 'Chairman', chairmanEmail, hash]
    );
    console.log(`Created chairman account: ${chairmanEmail}`);
  } else {
    console.log('Chairman account already exists, skipping.');
  }

  // 2. Courses + their existing resources (imported as pre-approved)
  let courseCount = 0;
  let resourceCount = 0;

  for (const year of Object.keys(syllabus)) {
    for (const sem of Object.keys(syllabus[year].semesters)) {
      const courses = syllabus[year].semesters[sem].courses;

      for (const course of courses) {
        const [[existing]] = await pool.query('SELECT id FROM courses WHERE code = ?', [course.code]);
        let courseId;

        if (existing) {
          courseId = existing.id;
        } else {
          const [result] = await pool.query(
            'INSERT INTO courses (code, title, year, semester) VALUES (?, ?, ?, ?)',
            [course.code, course.title, year, sem]
          );
          courseId = result.insertId;
          courseCount++;
        }

        for (const r of course.resources) {
          const [[dup]] = await pool.query(
            'SELECT id FROM resources WHERE course_id = ? AND link = ?',
            [courseId, r.link]
          );
          if (dup) continue;

          await pool.query(
            `INSERT INTO resources (course_id, title, link, type, status, submitted_by, reviewed_by, reviewed_at)
             VALUES (?, ?, ?, ?, 'approved', NULL, NULL, NOW())`,
            [courseId, r.title, r.link, r.type]
          );
          resourceCount++;
        }
      }
    }
  }

  console.log(`Seeded ${courseCount} new courses and ${resourceCount} new resources.`);
  console.log('Done.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
