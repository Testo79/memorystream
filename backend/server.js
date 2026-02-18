import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import helmet from 'helmet';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import placesRouter from './routes/places.js';
import storiesRouter from './routes/stories.js';
import authRouter from './routes/auth.js';

// Load environment variables
dotenv.config();

// Ensure a JWT secret exists.
if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ JWT_SECRET must be set in production.');
        process.exit(1);
    } else {
        // Dev-only: generate an ephemeral secret at startup.
        process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
        console.warn('⚠️  No JWT_SECRET set. Generated a temporary secret for development.');
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting: 60 requests per minute per IP
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // limit each IP to 60 requests per windowMs
    message: {
        error: 'Too many requests',
        message: 'You have exceeded the 60 requests in 1 minute limit. Please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/places', placesRouter);
app.use('/api/stories', storiesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'MemoryStream API is running' });
});

// Serve frontend build in production (single-service deploy)
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '..', 'frontend', 'dist');
    app.use(express.static(distPath));

    // SPA fallback (do not catch /api/*)
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

// Initialize database and start server
initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n🚀 MemoryStream Backend running on http://localhost:${PORT}`);
            console.log(`📍 API endpoints:`);
            console.log(`   - POST /api/auth/register`);
            console.log(`   - POST /api/auth/login`);
            console.log(`   - GET  /api/auth/me`);
            console.log(`   - GET /api/places?minLat=&minLng=&maxLat=&maxLng=`);
            console.log(`   - GET /api/places/:placeId/stories`);
            console.log(`   - GET /api/stories/:storyId`);
            console.log(`   - GET /health\n`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to initialize database:', err);
        process.exit(1);
    });
