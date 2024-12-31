const client = require('prom-client');

// Create a registry
const register = new client.Registry();

// Default system metrics
client.collectDefaultMetrics({
  register,
  prefix: 'my_app_', // Add a prefix to metrics
});

// Custom metrics
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'], // Add labels for method, route, and status
});
register.registerMetric(httpRequestCounter);

const responseTimeHistogram = new client.Histogram({
  name: 'http_response_time_seconds',
  help: 'HTTP response time in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5], // Response time buckets
});
register.registerMetric(responseTimeHistogram);

module.exports = {
  register,
  httpRequestCounter,
  responseTimeHistogram,
};
