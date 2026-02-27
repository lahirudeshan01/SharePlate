const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./middleware/errorHandler');
const swaggerSpec = require('./config/swagger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Security middleware
// Helmet is applied globally but its contentSecurityPolicy is disabled for the
// Swagger UI path so that the bundled assets (CSS/JS) load correctly.
app.use((req, res, next) => {
  if (req.path.startsWith('/api-docs')) {
    // Relax CSP only for Swagger UI routes
    return helmet({
      contentSecurityPolicy: false,
    })(req, res, next);
  }
  return helmet()(req, res, next);
});
app.use(cors());
app.use(mongoSanitize());

// ─── Swagger UI ────────────────────────────────────────────────────────────────
const swaggerUiOptions = {
  customSiteTitle: 'SharePlate API Docs',
  customCss: '.swagger-ui .topbar { background-color: #e86c37; }',
  swaggerOptions: {
    persistAuthorization: true, // keeps the JWT token on page refresh
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Expose the raw OpenAPI JSON spec (useful for code generators / Postman imports)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
// ──────────────────────────────────────────────────────────────────────────────

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'SharePlate API is running',
    timestamp: new Date().toISOString()
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
