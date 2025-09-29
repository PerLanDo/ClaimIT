const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const MCPManager = require('./services/mcp-manager');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize MCP services
const mcpManager = new MCPManager();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/claims', require('./routes/claims'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/profile', require('./routes/profile'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const mcpHealth = await mcpManager.healthCheck();
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: mcpHealth.data
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      error: error.message
    });
  }
});

// MCP services status endpoint
app.get('/api/mcp/status', (req, res) => {
  const status = mcpManager.getServiceStatus();
  res.json({
    success: true,
    data: status,
    timestamp: new Date().toISOString()
  });
});

// MCP services health check endpoint
app.get('/api/mcp/health', async (req, res) => {
  try {
    const health = await mcpManager.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  console.log(`ClaimIT server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize MCP services
  try {
    await mcpManager.initialize();
    console.log('MCP services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize MCP services:', error);
  }
});

module.exports = app;
