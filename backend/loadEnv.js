// Loads the env file named on the command line (or .env by default).
// If the file is missing, stop with a clear message instead of silently
// falling back to localhost defaults.
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

module.exports = function loadEnv(argPath) {
  const file = argPath ? path.resolve(argPath) : path.join(__dirname, '.env');

  if (!fs.existsSync(file)) {
    console.error(`Env file not found: ${file}`);
    console.error('Check the file name. On Windows, Notepad may have saved it as ".env.cloud.txt".');
    console.error('Run "dir .env*" in this folder to see the real file names.');
    process.exit(1);
  }

  dotenv.config({ path: file });

  // When a cloud file is given explicitly, it must contain the database host
  if (argPath && !process.env.DB_HOST) {
    console.error(`DB_HOST is missing in ${file}. Is the file empty, or did you forget to save it?`);
    process.exit(1);
  }

  console.log(`Using env file: ${file}`);
};
