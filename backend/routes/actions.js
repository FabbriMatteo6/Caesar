const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Protect all routes in this file
router.use(authMiddleware);

// POST /api/actions/enact_policy
router.post('/enact_policy', async (req, res) => {
  const { playerId } = req.player;
  const { policyId } = req.body;

  if (!policyId) {
    return res.status(400).json({ message: 'Policy ID is required.' });
  }

  try {
    // Start a transaction
    await db.query('BEGIN');

    // 1. Get current game state and chosen policy simultaneously
    const gameStatePromise = db.query('SELECT * FROM game_sessions WHERE player_id = $1 AND is_active = TRUE FOR UPDATE', [playerId]);
    const policyPromise = db.query('SELECT * FROM policies WHERE policy_id = $1', [policyId]);

    const [gameStateResult, policyResult] = await Promise.all([gameStatePromise, policyPromise]);

    if (gameStateResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'No active game found.' });
    }
    if (policyResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Policy not found.' });
    }

    const gs = gameStateResult.rows[0];
    const policy = policyResult.rows[0];
    const effects = policy.effects || {};

    // 2. Check if player can afford the political capital cost
    const politicalCapitalCost = Math.abs(effects.political_capital || 0);
    if (gs.political_capital < politicalCapitalCost) {
      await db.query('ROLLBACK');
      return res.status(400).json({ message: 'Not enough Political Capital to enact this policy.' });
    }

    // 3. Apply policy effects
    const newApproval = parseFloat(gs.public_approval) + (effects.public_approval || 0);
    const newBudget = Number(gs.budget_balance) + (effects.budget_balance || 0);
    const newCapital = gs.political_capital - politicalCapitalCost;

    // 4. Update game state
    await db.query(
      `UPDATE game_sessions SET public_approval = $1, budget_balance = $2, political_capital = $3, updated_at = NOW() WHERE session_id = $4`,
      [newApproval.toFixed(2), newBudget, newCapital, gs.session_id]
    );

    // 5. Log the decision
    const decisionDescription = `Enacted policy: ${policy.name}.`;
    await db.query(
      `INSERT INTO decisions_log (session_id, turn_made, action_type, related_id, description) VALUES ($1, $2, $3, $4, $5)`,
      [gs.session_id, gs.turn_number, 'enact_policy', policy.policy_id, decisionDescription]
    );

    // Commit the transaction
    await db.query('COMMIT');

    // 6. Return the new game state
    const finalGameState = await db.query(
      `SELECT gs.*, r.name as region_name FROM game_sessions gs
       JOIN regions r ON gs.current_jurisdiction_id = r.region_id
       WHERE gs.session_id = $1`,
      [gs.session_id]
    );

    res.status(200).json(finalGameState.rows[0]);

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error enacting policy:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

// POST /api/actions/handle_event
router.post('/handle_event', async (req, res) => {
  const { playerId } = req.player;
  const { choiceId } = req.body;

  if (!choiceId) {
    return res.status(400).json({ message: 'Choice ID is required.' });
  }

  try {
    await db.query('BEGIN');

    // 1. Get the current game state, ensuring an event is active
    const gameStateResult = await db.query(
      `SELECT gs.*, e.name as event_name, e.choices FROM game_sessions gs
       JOIN events e ON gs.active_event_id = e.event_id
       WHERE gs.player_id = $1 AND gs.is_active = TRUE FOR UPDATE`,
      [playerId]
    );

    if (gameStateResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'No active event found for this player.' });
    }
    const gs = gameStateResult.rows[0];

    // 2. Find the chosen option and its effects
    const choice = gs.choices.find(c => c.choice_id === choiceId);
    if (!choice) {
      await db.query('ROLLBACK');
      return res.status(400).json({ message: 'Invalid choice for this event.' });
    }
    const effects = choice.effects || {};

    // 3. Apply the effects of the choice
    const newApproval = parseFloat(gs.public_approval) + (effects.public_approval || 0);
    const newBudget = Number(gs.budget_balance) + (effects.budget_balance || 0);
    const newCapital = gs.political_capital + (effects.political_capital || 0);

    // 4. Update the game state: apply effects and clear the active event
    await db.query(
      `UPDATE game_sessions
       SET public_approval = $1, budget_balance = $2, political_capital = $3, active_event_id = NULL, updated_at = NOW()
       WHERE session_id = $4`,
      [newApproval.toFixed(2), newBudget, newCapital, gs.session_id]
    );

    // 5. Log the decision
    const decisionDescription = `Responded to event '${gs.event_name}' with choice: '${choice.text}'.`;
    await db.query(
      `INSERT INTO decisions_log (session_id, turn_made, action_type, related_id, description) VALUES ($1, $2, $3, $4, $5)`,
      [gs.session_id, gs.turn_number, 'handle_event', gs.active_event_id, decisionDescription]
    );

    await db.query('COMMIT');

    // 6. Return the updated game state
    const finalGameState = await db.query(
      `SELECT gs.*, r.name as region_name FROM game_sessions gs
       JOIN regions r ON gs.current_jurisdiction_id = r.region_id
       WHERE gs.session_id = $1`,
      [gs.session_id]
    );

    res.status(200).json(finalGameState.rows[0]);

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error handling event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
