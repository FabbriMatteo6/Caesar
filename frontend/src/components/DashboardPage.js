import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EventModal from './EventModal';

const DashboardPage = () => {
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');

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

      <div className="actions-nav" style={{ marginTop: '20px' }}>
        <h3>Actions</h3>
        <Link to="/legislation" style={isEventActive ? { pointerEvents: 'none', color: 'grey' } : {}}>
          View & Enact Legislation
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
