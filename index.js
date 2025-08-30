// Import the Express framework
const express = require('express');
// Import the 'pg' library for PostgreSQL
const { Pool } = require('pg');

// Create an instance of the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create a new pool of connections to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // CORRECTED: This ssl object is required for Render databases
  ssl: {
    rejectUnauthorized: false
  }
});

// A quick function to test the database connection
async function testDbConnection() {
  try {
    // Use the pool to send a query
    await pool.query('SELECT NOW()'); 
    console.log('✅ Successfully connected to the database!');
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
  }
}

// Create a simple "route" for the main page ('/')
app.get('/', (req, res) => {
  res.send('Torn Buddy API V3 is running!');
});

// Start the server and listen for visitors
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  testDbConnection(); // Test the database connection when the server starts
});