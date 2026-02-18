import jwt from 'jsonwebtoken';
import { db } from '../database.js';

function getTokenFromRequest(req) {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string') return null;
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

export const requireAuth = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token missing'
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      error: 'Server misconfigured',
      message: 'JWT_SECRET is not set'
    });
  }

  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }

  const userId = payload?.sub;
  if (!userId || typeof userId !== 'string') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token payload'
    });
  }

  // Load user from DB (ensures user still exists)
  db.get('SELECT id, email, firstName, lastName FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to validate user'
      });
    }

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  });
};

