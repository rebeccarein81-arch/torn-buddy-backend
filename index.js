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
  ssl: {
    rejectUnauthorized: false
  }
});

// NEW: A function to connect to the database with multiple retries
const connectWithRetry = async (retries = 5) => {
  try {
    // Use the pool to send a query
    await pool.query('SELECT NOW()'); 
    console.log('✅ Successfully connected to the database!');
  } catch (err) {
    console.log(`❌ Connection attempt failed. Retries left: ${retries}`);
    // If we have retries left, wait 5 seconds and try again
    if (retries > 0) {
      setTimeout(() => connectWithRetry(retries - 1), 5000);
    } else {
      console.error('❌ Failed to connect to the database after multiple retries:', err);
    }
  }
};


// Create a simple "route" for the main page ('/')
app.get('/', (req, res) => {
  res.send('Torn Buddy API is running!');
});

// Start the server and listen for visitors
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  // Call our new connection function
  connectWithRetry(); 
});