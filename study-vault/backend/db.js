const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// NOTE: this file does not load .env itself. The entry points
// (server.js, seed.js, setup-db.js) load the right env file first.

// Cloud databases (e.g. Aiven) require an encrypted connection.
// Set DB_SSL=true and put the CA certificate (ca.pem) in the backend folder.
let ssl;
if (process.env.DB_SSL === 'true') {
  const caPath = path.join(__dirname, process.env.DB_CA_FILE || 'ca.pem');
  if (!fs.existsSync(caPath)) {
    throw new Error(`DB_SSL=true but certificate file not found: ${caPath}`);
  }
  ssl = { ca: fs.readFileSync(caPath) };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'study_vault',
  ssl,
  waitForConnections: true,
  connectionLimit: 5, // free cloud databases allow only a few connections
  queueLimit: 0
});

module.exports = pool;
