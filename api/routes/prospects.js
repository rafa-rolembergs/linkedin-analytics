// Placeholder route file for prospect-related endpoints.
// Add API routes for prospect lookup and enrichment here.

const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
