import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  // Pragmatic email validation (avoid overly strict RFC rules)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidPassword = (password) => {
  if (typeof password !== 'string') return false;
  const p = password.trim();
  return p.length >= 8 && p.length <= 72;
};

const isValidName = (name) => {
  if (typeof name !== 'string') return false;
  const n = name.trim();
  return n.length >= 1 && n.length <= 80;
};

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error('JWT_SECRET is not set');
    err.code = 'JWT_SECRET_MISSING';
    throw err;
  }

  return jwt.sign(
    { email: user.email },
    secret,
    {
      subject: user.id,
      expiresIn: '7d'
    }
  );
};

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body || {};

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Email invalide'
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Mot de passe invalide (min 8 caractères)'
    });
  }

  if (!isValidName(firstName) || !isValidName(lastName)) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Prénom et nom sont obligatoires (1 à 80 caractères)'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();

  db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail], async (err, existing) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to check existing user'
      });
    }

    if (existing) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Un compte existe déjà avec cet email'
      });
    }

    try {
      const passwordHash = await bcrypt.hash(password.trim(), 12);
      const id = uuidv4();
      const createdAt = new Date().toISOString();

      db.run(
        'INSERT INTO users (id, email, passwordHash, createdAt, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)',
        [id, normalizedEmail, passwordHash, createdAt, normalizedFirstName, normalizedLastName],
        function (insertErr) {
          if (insertErr) {
            console.error('Database error:', insertErr);
            return res.status(500).json({
              error: 'Internal server error',
              message: 'Failed to create user'
            });
          }

          let token;
          try {
            token = signToken({ id, email: normalizedEmail });
          } catch (tokenErr) {
            console.error(tokenErr);
            return res.status(500).json({
              error: 'Server misconfigured',
              message: 'JWT_SECRET is not set'
            });
          }

          res.status(201).json({ token });
        }
      );
    } catch (hashErr) {
      console.error(hashErr);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create user'
      });
    }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!isValidEmail(email) || typeof password !== 'string') {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Email ou mot de passe invalide'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  db.get('SELECT id, email, passwordHash FROM users WHERE email = ?', [normalizedEmail], async (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to login'
      });
    }

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Identifiants invalides'
      });
    }

    let ok = false;
    try {
      ok = await bcrypt.compare(password, user.passwordHash);
    } catch {
      ok = false;
    }

    if (!ok) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Identifiants invalides'
      });
    }

    let token;
    try {
      token = signToken({ id: user.id, email: user.email });
    } catch (tokenErr) {
      console.error(tokenErr);
      return res.status(500).json({
        error: 'Server misconfigured',
        message: 'JWT_SECRET is not set'
      });
    }

    res.json({ token });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing token' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfigured', message: 'JWT_SECRET is not set' });
  }

  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }

  const userId = payload?.sub;
  if (!userId || typeof userId !== 'string') {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token payload' });
  }

  db.get('SELECT id, email, firstName, lastName FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error', message: 'Failed to fetch user' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
    }
    res.json(user);
  });
});

export default router;

