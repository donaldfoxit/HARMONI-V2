import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Disable CSP for local development to avoid TLS issues
const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(helmet({
  contentSecurityPolicy: isDevelopment ? false : {
    directives: {
      defaultSrc: ["'self'", 'http:', 'https:'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      connectSrc: ["'self'", 'https:', 'http:', 'https://mvcavbkzhclnwmrrffpw.supabase.co'],
      mediaSrc: ["'self'", 'https:', 'http:']
    }
  }
}));

app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client/build (React production build)
app.use(express.static(join(__dirname, '../client/build')));

// API routes
app.use('/api', apiRoutes);

// Serve React app for all non-API routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
