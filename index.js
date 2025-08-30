// index.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Missing DATABASE_URL env var.');
  process.exit(1);
}

// Use External Connection String and enable SSL in code
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function testDbConnection() {
  await pool.query('SELECT NOW()');
  console.log('✅ Successfully connected to the database!');
}

// Retry helper for Render cold starts
function connectWithRetry(retries = 5) {
  testDbConnection()
    .catch((err) => {
      console.log(`❌ DB not ready yet. Retries left: ${retries}`);
      if (retries > 0) {
        setTimeout(() => connectWithRetry(retries - 1), 5000);
      } else {
        console.error('❌ Failed to connect after multiple retries:', err);
      }
    });
}

app.get('/', (_req, res) => {
  res.send('Torn Buddy API V3 is running!');
});

// On-demand DB health route
app.get('/db-ping', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() as now');
    res.json({ ok: true, now: rows[0].now });
  } catch (err) {
    console.error('DB ping failed:', err);
    res.status(500).json({ ok: false, error: err.code || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  connectWithRetry();
});
