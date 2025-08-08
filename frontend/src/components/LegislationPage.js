import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LegislationPage = () => {
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get('/api/policies', { headers: getAuthHeader() });
        setPolicies(response.data);
      } catch (err) {
        setError('Failed to fetch policies.');
      }
    };
    fetchPolicies();
  }, []);

  const handleEnactPolicy = async (policyId) => {
    try {
      setMessage('');
      const response = await axios.post('/api/actions/enact_policy', { policyId }, { headers: getAuthHeader() });
      setMessage(`Successfully enacted policy! Your stats have been updated.`);
      // Optional: Navigate back to dashboard after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Failed to enact policy.');
      }
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Legislation</h2>
      <p>Propose, support, or veto laws on various topics.</p>
      {message && <p style={{ color: 'blue' }}>{message}</p>}
      <div className="policy-list">
        {policies.map(policy => (
          <div key={policy.policy_id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>{policy.name}</h3>
            <p>{policy.description}</p>
            <p><strong>Category:</strong> {policy.category}</p>
            <p><strong>Effects:</strong></p>
            <ul>
              <li>Public Approval: {policy.effects.public_approval || 0}%</li>
              <li>Budget: €{Number(policy.effects.budget_balance || 0).toLocaleString()}</li>
              <li>Political Capital Cost: Ψ{Math.abs(policy.effects.political_capital || 0)}</li>
            </ul>
            <button onClick={() => handleEnactPolicy(policy.policy_id)}>Enact Policy</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegislationPage;
