import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BudgetPage = () => {
  const [allocations, setAllocations] = useState({
    healthcare: 34,
    education: 33,
    infrastructure: 33,
  });
  const [total, setTotal] = useState(100);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchCurrentAllocations = async () => {
      try {
        const response = await axios.get('/api/game/state', { headers: getAuthHeader() });
        const currentAllocations = response.data.budget_allocations;
        // Check if the fetched allocations are not empty
        if (currentAllocations && Object.keys(currentAllocations).length > 0) {
          setAllocations(currentAllocations);
        }
      } catch (error) {
        setMessage('Could not fetch current budget data.');
      }
    };
    fetchCurrentAllocations();
  }, []);

  useEffect(() => {
    const newTotal = Object.values(allocations).reduce((sum, value) => sum + Number(value || 0), 0);
    setTotal(newTotal);
  }, [allocations]);

  const handleAllocationChange = (sector, value) => {
    setAllocations(prev => ({ ...prev, [sector]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Math.abs(total - 100) > 0.01) {
      setMessage('Total allocation must be exactly 100%.');
      return;
    }
    try {
      await axios.post('/api/actions/manage_budget', { allocations }, { headers: getAuthHeader() });
      setMessage('Budget updated successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Failed to update budget.');
      }
    }
  };

  const sectors = ['healthcare', 'education', 'infrastructure'];

  return (
    <div>
      <h2>Budget Management</h2>
      <p>Allocate your budget across different sectors. The total must be 100%.</p>
      <form onSubmit={handleSubmit}>
        {sectors.map(sector => (
          <div key={sector} style={{ marginBottom: '10px' }}>
            <label style={{ textTransform: 'capitalize', marginRight: '10px', width: '120px', display: 'inline-block' }}>
              {sector}:
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={allocations[sector] || ''}
              onChange={(e) => handleAllocationChange(sector, e.target.value)}
            /> %
          </div>
        ))}
        <hr />
        <p><strong>Total: {total.toFixed(0)}%</strong></p>
        {message && <p style={{ color: total === 100 ? 'blue' : 'red' }}>{message}</p>}
        <button type="submit" disabled={Math.abs(total - 100) > 0.01}>Submit Budget</button>
      </form>
    </div>
  );
};

export default BudgetPage;
