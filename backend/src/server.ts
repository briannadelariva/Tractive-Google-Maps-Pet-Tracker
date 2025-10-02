import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { config } from './config/index.js';
import { logError, logWarning } from './utils/errorLogger.js';

// Load environment variables
dotenv.config();

// Validate configuration and provide helpful warnings
function validateConfiguration(): void {
  const warnings: string[] = [];
  
  if (!config.tractive.email) {
    warnings.push('TRACTIVE_EMAIL not set - authentication will fail');
  }
  if (!config.tractive.password) {
    warnings.push('TRACTIVE_PASSWORD not set - authentication will fail');
  }
  if (!config.google.apiKey) {
    warnings.push('GOOGLE_MAPS_API_KEY not set - Google Maps features will be unavailable');
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Configuration Warnings:');
    warnings.forEach(warning => logWarning(warning, 'Config'));
    console.log('');
  }
}

validateConfiguration();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://maps.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://maps.googleapis.com"],
      frameSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
    },
  },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.max,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
import authRoutes from './routes/auth.js';
import trackerRoutes from './routes/trackers.js';

app.use('/api/auth', authRoutes);
app.use('/api/trackers', trackerRoutes);

// Serve static files from frontend build (production only)
if (config.nodeEnv === 'production') {
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDistPath));

  // For any non-API route, serve the React app (SPA fallback)
  app.get('*', (req, res, next) => {
    // Skip API routes - they should return 404 JSON if not found
    if (req.path.startsWith('/api/') || req.path === '/health') {
      return next();
    }
    
    // Serve index.html for all other routes (React Router will handle routing)
    res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
      if (err) {
        // If frontend build doesn't exist, show helpful message
        res.status(404).json({
          success: false,
          error: 'Frontend not built. Run "npm run build:frontend" to build the frontend.',
          timestamp: new Date().toISOString(),
        });
      }
    });
  });
}

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log error with clean formatting
  logError(err, 'Unhandled error', config.nodeEnv === 'development');
  
  res.status(err.status || 500).json({
    success: false,
    error: config.nodeEnv === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  });
});

const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;