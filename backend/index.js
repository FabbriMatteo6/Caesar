const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Import routers
const authRouter = require('./routes/auth');
const gameRouter = require('./routes/game');
const policiesRouter = require('./routes/policies');
const actionsRouter = require('./routes/actions');

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/game', gameRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/actions', actionsRouter);

// Basic route for checking if the server is up
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Il Palazzo API!' });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
