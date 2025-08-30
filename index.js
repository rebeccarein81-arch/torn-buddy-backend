// Import the Express framework
const express = require('express');

// Create an instance of the Express app
const app = express();

// Define the port the server will run on.
// Render provides this via an environment variable, so we use `process.env.PORT`.
const PORT = process.env.PORT || 3000;

// Create a simple "route" for the main page ('/')
app.get('/', (req, res) => {
  res.send('Torn Buddy API V2 is running!');
});

// Start the server and listen for visitors
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});