const jwt = require('jsonwebtoken');

// This secret should be the same one used in the auth router.
// It should be stored in an environment variable in a real application.
const JWT_SECRET = 'averysecretkeythatshouldbeinanenvfile';

const authMiddleware = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded payload (which contains the player ID) to the request object
    req.player = { playerId: decoded.playerId };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
