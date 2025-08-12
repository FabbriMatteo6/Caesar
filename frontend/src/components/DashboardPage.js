import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EventModal from './EventModal';

const DashboardPage = () => {
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchGameState = async () => {
    try {
      const response = await axios.get('/api/game/state', { headers: getAuthHeader() });
      setGameState(response.data);
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No active game found. Start a new game!');
      } else {
        setError('Failed to fetch game state. You may need to log in again.');
      }
      setGameState(null);
    }
  };

  const startNewGame = async () => {
    try {
      await axios.post('/api/game/new', {}, { headers: getAuthHeader() });
      // After starting a new game, fetch the new game state
      fetchGameState();
    } catch (err) {
      setError('Failed to start a new game.');
    }
  };

  const handleEndTurn = async () => {
    try {
      const response = await axios.post('/api/game/end_turn', {}, { headers: getAuthHeader() });
      setGameState(response.data); // Update the state with the new game state
      setError('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Failed to process the turn.');
      }
    }
  };

  const handleEventResolved = (newGameState) => {
    setGameState(newGameState);
  };

  const handleGiveSpeech = async () => {
    try {
      const response = await axios.post('/api/actions/give_speech', {}, { headers: getAuthHeader() });
      setGameState(response.data);
      setActionMessage(response.data.last_action_result.message);
      // Clear the message after a few seconds
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      if (err.response) {
        setActionMessage(err.response.data.message);
        setTimeout(() => setActionMessage(''), 4000);
      } else {
        setError('Failed to perform action.');
      }
    }
  };

  useEffect(() => {
    fetchGameState();
  }, []);

  if (error && !gameState) {
    return (
      <div>
        <h2>Dashboard</h2>
        <p style={{ color: 'red' }}>{error}</p>
        {error.includes('No active game') && (
          <button onClick={startNewGame}>Start New Game</button>
        )}
      </div>
    );
  }

  if (!gameState) {
    return <div>Loading dashboard...</div>;
  }

  const isEventActive = !!gameState.active_event_id;

  return (
    <div>
      {isEventActive && <EventModal event={gameState} onResolve={handleEventResolved} />}

      <h2>Dashboard - {gameState.region_name} (Turn: {gameState.turn_number})</h2>

      {error && !isEventActive && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h3>Core Statistics</h3>
        <p><strong>Public Approval:</strong> {Number(gameState.public_approval).toFixed(2)}%</p>
        <p><strong>Budget Balance:</strong> €{Number(gameState.budget_balance).toLocaleString()}</p>
        <p><strong>Political Capital:</strong> Ψ{gameState.political_capital}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleEndTurn} disabled={isEventActive}>
          {isEventActive ? 'Event in Progress...' : 'End Turn'}
        </button>
      </div>

      <div className="actions-nav" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
        <h3>Player Actions</h3>
        <Link to="/legislation" style={isEventActive ? { pointerEvents: 'none', color: 'grey' } : {}}>
          View & Enact Legislation
        </Link>
        <Link to="/budget" style={isEventActive ? { pointerEvents: 'none', color: 'grey' } : {}}>
          Manage Budget
        </Link>

        <h4>Public Engagement</h4>
        <button onClick={handleGiveSpeech} disabled={isEventActive}>
          Give Speech (Cost: 5 Ψ)
        </button>
      </div>
      {actionMessage && <p style={{ marginTop: '10px', color: 'blue' }}>{actionMessage}</p>}
    </div>
  );
};

export default DashboardPage;
