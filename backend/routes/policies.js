const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Protect all routes in this file
router.use(authMiddleware);

// GET /api/policies
// Fetches all available policies from the database.
router.get('/', async (req, res) => {
  try {
    const policies = await db.query('SELECT * FROM policies ORDER BY category, name');
    res.status(200).json(policies.rows);
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
