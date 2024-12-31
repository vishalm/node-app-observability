// src/config/tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const packageJson = require('../../package.json'); // Import package.json
 

// Enable debugging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Configure Jaeger exporter
const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces', // Jaeger's HTTP endpoint
  serviceName: packageJson.name, // Replace with your service name
});

// Set up the NodeSDK with resource attributes and instrumentations
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: packageJson.name, // Service name
  }),
  traceExporter: jaegerExporter,
  instrumentations: [
    new HttpInstrumentation(), // For tracing HTTP requests
    new ExpressInstrumentation(), // For tracing Express.js routes
  ],
});

// Initialize OpenTelemetry tracing
const initializeTracing = async () => {
  try {
    await sdk.start(); // Wait for SDK to start
    console.log('OpenTelemetry tracing initialized');
  } catch (error) {
    console.error('Error initializing OpenTelemetry', error);
    throw error; // Re-throw to handle it in the main app
  }
};

// Graceful shutdown
const shutdownTracing = async () => {
  try {
    await sdk.shutdown(); // Wait for SDK to shut down
    console.log('OpenTelemetry tracing terminated');
  } catch (error) {
    console.error('Error terminating OpenTelemetry', error);
  }
};
// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry tracing terminated'))
    .catch((error) => console.error('Error terminating OpenTelemetry', error))
    .finally(() => process.exit(0));
});

module.exports = { initializeTracing, shutdownTracing };
