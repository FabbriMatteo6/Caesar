import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import LegislationPage from './components/LegislationPage';
import BudgetPage from './components/BudgetPage';
import './App.css';

function App() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {token ? (
            <li><button onClick={handleLogout}>Logout</button></li>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/legislation" element={<LegislationPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

const HomePage = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return <DashboardPage />;
  }

  return (
    <div>
      <h1>Welcome to Il Palazzo</h1>
      <p>The Italian Political Simulator</p>
      <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to begin.</p>
    </div>
  );
};

export default App;
