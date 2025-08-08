const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Adjust the path to the db module

const router = express.Router();

// IMPORTANT: In a real application, this secret should be stored in an environment variable.
const JWT_SECRET = 'averysecretkeythatshouldbeinanenvfile';
const SALT_ROUNDS = 10;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Check if user already exists
    const userCheck = await db.query('SELECT * FROM players WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Store new user
    const newUser = await db.query(
      'INSERT INTO players (username, password_hash) VALUES ($1, $2) RETURNING player_id, username',
      [username, passwordHash]
    );

    res.status(201).json({
      message: 'User registered successfully.',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Fetch user from DB
    const userResult = await db.query('SELECT * FROM players WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign({ playerId: user.player_id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful.',
      token: token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
