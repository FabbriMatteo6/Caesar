// This module sets up and exports a connection pool for PostgreSQL.
const { Pool } = require('pg');

// The connection pool is a standard way to manage and reuse database connections,
// which is more efficient than opening and closing a client for every query.
const pool = new Pool({
  // IMPORTANT: These are placeholder credentials for local development.
  // In a production environment, these should be replaced with environment variables
  // or a secret management system for security.
  user: 'palazzo_user',
  host: 'db', // Using 'db' as the hostname, common for Docker Compose setups.
  database: 'il_palazzo',
  password: 'supersecretpassword',
  port: 5432,
});

// The exported query function will be a proxy to the pool's query method.
// This allows other parts of the application to run queries without needing
// to manage the connection client themselves.
module.exports = {
  query: (text, params) => pool.query(text, params),
};
