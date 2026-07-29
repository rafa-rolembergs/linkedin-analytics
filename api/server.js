// Placeholder entry point for the API server.
// This file will host the backend services for the extension and dashboard.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Notopo Prospect Intelligence API is running.' });
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
