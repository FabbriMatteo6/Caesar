const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// All routes in this file are protected by the auth middleware
router.use(authMiddleware);

// POST /api/game/new
// Creates a new game session for the authenticated player.
router.post('/new', async (req, res) => {
  const { playerId } = req.player;

  try {
    // Check for an existing active game for this player
    const existingGame = await db.query(
      'SELECT * FROM game_sessions WHERE player_id = $1 AND is_active = TRUE',
      [playerId]
    );

    if (existingGame.rows.length > 0) {
      return res.status(409).json({ message: 'An active game already exists for this player.' });
    }

    // Define starting values for a new game
    const startingCareerLevel = 'Sindaco';
    const startingApproval = 50.0;
    const startingBudget = 1000000;
    const startingCapital = 100;
    // For simplicity, let's assign them to a random region from the seeded ones (IDs 1-5)
    const randomRegionId = Math.floor(Math.random() * 5) + 1;

    const newGame = await db.query(
      `INSERT INTO game_sessions (player_id, career_level, current_jurisdiction_id, public_approval, budget_balance, political_capital)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [playerId, startingCareerLevel, randomRegionId, startingApproval, startingBudget, startingCapital]
    );

    res.status(201).json({ message: 'New game started!', game: newGame.rows[0] });
  } catch (error) {
    console.error('Error starting new game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/game/state
// Fetches the current active game state for the authenticated player.
router.get('/state', async (req, res) => {
  const { playerId } = req.player;

  try {
    const gameState = await db.query(
      `SELECT gs.*, r.name as region_name, e.name as event_name, e.description as event_description, e.choices as event_choices
       FROM game_sessions gs
       JOIN regions r ON gs.current_jurisdiction_id = r.region_id
       LEFT JOIN events e ON gs.active_event_id = e.event_id
       WHERE gs.player_id = $1 AND gs.is_active = TRUE`,
      [playerId]
    );

    if (gameState.rows.length === 0) {
      return res.status(404).json({ message: 'No active game found for this player.' });
    }

    res.status(200).json(gameState.rows[0]);
  } catch (error) {
    console.error('Error fetching game state:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/game/end_turn
// Processes the end of a turn, updates game state, and returns the new state.
router.post('/end_turn', async (req, res) => {
  const { playerId } = req.player;
  const EVENT_CHANCE = 0.25; // 25% chance of an event each turn

  try {
    await db.query('BEGIN');
    // 1. Get the current game state
    const gameStateResult = await db.query(
      'SELECT * FROM game_sessions WHERE player_id = $1 AND is_active = TRUE FOR UPDATE',
      [playerId]
    );

    if (gameStateResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'No active game found.' });
    }
    const gs = gameStateResult.rows[0];

    // Check if an event is already active
    if (gs.active_event_id) {
      await db.query('ROLLBACK');
      return res.status(400).json({ message: 'Cannot end turn while an event is active. Please resolve the event first.' });
    }

    // 2. Simple game logic for turn progression
    const newTurnNumber = gs.turn_number + 1;
    const baseExpenses = 50000;
    const newBudget = Number(gs.budget_balance) - baseExpenses;
    const approvalDrift = (50 - gs.public_approval) * 0.1;
    const newApproval = parseFloat(gs.public_approval) + approvalDrift;

    // 3. Event Trigger Logic
    let activeEventId = null;
    if (Math.random() < EVENT_CHANCE) {
      const randomEvent = await db.query("SELECT event_id FROM events WHERE type = 'random' ORDER BY RANDOM() LIMIT 1");
      if (randomEvent.rows.length > 0) {
        activeEventId = randomEvent.rows[0].event_id;
      }
    }

    // 4. Update the game state in the database
    const updatedGs = await db.query(
      `UPDATE game_sessions
       SET turn_number = $1, budget_balance = $2, public_approval = $3, active_event_id = $4, updated_at = NOW()
       WHERE session_id = $5 RETURNING *`,
      [newTurnNumber, newBudget, newApproval.toFixed(2), activeEventId, gs.session_id]
    );

    await db.query('COMMIT');

    // 5. Fetch and return the final, joined game state
    const finalGameState = await db.query(
      `SELECT gs.*, r.name as region_name, e.name as event_name, e.description as event_description, e.choices as event_choices
       FROM game_sessions gs
       JOIN regions r ON gs.current_jurisdiction_id = r.region_id
       LEFT JOIN events e ON gs.active_event_id = e.event_id
       WHERE gs.session_id = $1`,
      [gs.session_id]
    );

    res.status(200).json(finalGameState.rows[0]);
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error processing end of turn:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
