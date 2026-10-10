// Creates all tables from schema.sql on the database named in your env file.
//
// Local:  node setup-db.js
// Cloud:  node setup-db.js .env.cloud
//
// Unlike `mysql ... < schema.sql`, this works with cloud databases (SSL) and
// skips CREATE DATABASE / USE, because a cloud database already exists.
const fs = require('fs');
const path = require('path');

// Load the env file BEFORE db.js is required
require('dotenv').config({
  path: process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '.env')
});

const pool = require('./db');

async function run() {
  const raw = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  const withoutComments = raw
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');

  const statements = withoutComments
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .filter(s => !/^CREATE DATABASE/i.test(s) && !/^USE\s/i.test(s));

  console.log(`Connecting to ${process.env.DB_HOST || 'localhost'} / ${process.env.DB_NAME || 'study_vault'} ...`);

  for (const statement of statements) {
    const label = statement.replace(/\s+/g, ' ').slice(0, 60);
    try {
      await pool.query(statement);
      console.log(`  done: ${label}`);
    } catch (err) {
      // Re-running the script: indexes that already exist are fine
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log(`  already exists: ${label}`);
        continue;
      }
      throw err;
    }
  }

  console.log('Database tables are ready.');
  process.exit(0);
}

run().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
