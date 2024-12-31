const { initializeTracing } = require('./config/tracing');  // Import tracing initialization
const express = require('express');
const actuator = require('express-actuator');
const routes = require('./routes'); // Import routes
const os = require('os'); // Import the os module
const actuatorConfig = require('./config/actuatorConfig');
const prometheusConfig = require('./config/prometheusConfig');
const { register, httpRequestCounter, responseTimeHistogram } = prometheusConfig;
const packageJson = require('../package.json'); // Import package.json


const app = express();
const port = process.env.PORT || 30001;

// Middleware to track request metrics
app.use((req, res, next) => {
  const end = responseTimeHistogram.startTimer();
  res.on('finish', () => {
    // Record metrics
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
    end({ method: req.method, route: req.route ? req.route.path : req.path, status: res.statusCode });
  });
  next();
});

// Apply actuator middleware
app.use(actuator(actuatorConfig));

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Register other routes
app.use('/', routes);

// Example custom span using OpenTelemetry
const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer(packageJson.name);
app.get('/custom', (req, res) => {
  const span = tracer.startSpan('custom-endpoint');
  setTimeout(() => {
    span.end();
    res.send('Custom operation complete');
  }, 500);
});

// Start the server after tracing initialization
initializeTracing()
  .then(() => {
    // Start the server once tracing is initialized
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Tracing APP Name ${packageJson.name}`);
      console.log(`Prometheus metrics available at http://localhost:${port}/metrics`);
    });
  })
  .catch((err) => {
    console.error('Error starting server', err);
  });

// Graceful shutdown handling
process.on('SIGTERM', () => {
  shutdownTracing().finally(() => {
    process.exit(0);
  });
});

module.exports = app;