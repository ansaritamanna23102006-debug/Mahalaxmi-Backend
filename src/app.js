const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const { getSwaggerSpecs } = require('./config/swagger');
const { configureCloudinary } = require('./config/cloudinary');
const errorMiddleware = require('./middleware/errorMiddleware');
const securityMiddleware = require('./middleware/securityMiddleware');
const apiRouter = require('./routes/apiRouter');

const app = express();

// Initialize Cloudinary Configuration
configureCloudinary();

// Apply Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mahalaxmi-frontend-nine.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(mongoSanitize());

// Custom XSS Protection Middleware
app.use(securityMiddleware.xssClean);

// Rate Limiting Middleware
app.use('/api', securityMiddleware.apiLimiter);

// Logger Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads directory (for temporary files)
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(getSwaggerSpecs()));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Mahalaxmi Mithaiwala backend is healthy and running',
    timestamp: new Date()
  });
});

// Root API Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Mahalaxmi Mithaiwala E-commerce Backend API. Refer to /api-docs for documentation.',
    healthCheckUrl: `${req.protocol}://${req.get('host')}/health`,
    docsUrl: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// API Routes Namespace
app.use('/api/v1', apiRouter);

// Fallback for Page Not Found (404)
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler Middleware
app.use(errorMiddleware);

module.exports = app;
