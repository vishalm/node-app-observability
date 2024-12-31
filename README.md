# **Node.js App with Tracing, Prometheus, Healthcheck Actuator, and Jaeger**

## **Overview**

This project demonstrates the integration of **OpenTelemetry**, **Jaeger** for distributed tracing, **Prometheus** for metrics collection, and **Spring Boot-style Actuator endpoints** for monitoring and health checks in a Node.js application. We use **Mocha** and **Supertest** to run tests that ensure tracing, metrics, and health endpoints are working as expected.

### **Key Features**
- Distributed Tracing with Jaeger.
- Metrics collection using Prometheus.
- Health and Actuator endpoints for monitoring.
- Automated tests to validate tracing and endpoint functionality.

---

## **Technologies Used**

- **Node.js** - Backend runtime.
- **OpenTelemetry** - For observability and distributed tracing.
- **Jaeger** - For distributed tracing and visualizing trace data.
- **Prometheus** - For collecting application metrics.
- **Mocha** - Test framework for validation.
- **Supertest** - For HTTP request testing.

---

## **Getting Started**

### **Prerequisites**

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or later)
- **Docker** (for Jaeger and Prometheus setup)
- **npm** (for package management)

### **1. Clone the Repository**

```bash
git clone https://github.com/vishalm/node-app-observability.git
cd node-app-observability
```

### **2. Install Dependencies**

Install the necessary dependencies for the application and testing.

```bash
npm install
```

### **3. Set Up Jaeger and Prometheus with Docker**

Run Jaeger and Prometheus using Docker for distributed tracing and metrics collection:

```bash
docker-compose -f docker-compose-jaeger.yml up
```

This command will spin up the following services:
- **Jaeger**: Available at `http://localhost:16686`
- **Prometheus**: Available at `http://localhost:9090`

You can check the Jaeger UI to see the traces and the Prometheus UI to view application metrics.

---

## **Configuration**

### **1. Jaeger Tracing Setup**

Your application is configured to export trace data to Jaeger. The **JaegerExporter** is configured in `src/config/tracing.js`:

```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Jaeger exporter configuration
const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces', // Jaeger's HTTP endpoint
  serviceName: 'nodejs-app', // Service name
});

// OpenTelemetry SDK configuration
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'nodejs-app',
  }),
  traceExporter: jaegerExporter,
});

sdk.start()
  .then(() => console.log('OpenTelemetry tracing initialized'))
  .catch((error) => console.error('Error initializing OpenTelemetry', error));
```

### **2. Prometheus Metrics**

Prometheus collects application metrics. You can configure Prometheus scraping in the `prometheus.yml` file or any custom configuration you use for scraping metrics from your app.

---

## **Running the Application**

Start the application with:

```bash
npm start
```

Your application will now be running, and you can access the following endpoints:

### **Healthcheck Actuator Endpoints**
- **/actuator/health** - Health status of the application.
- **/actuator/metrics** - Exposes Prometheus metrics.
- **/actuator/tracing** - Tracing status (check if traces are sent to Jaeger).

### **Prometheus Metrics**
The Prometheus endpoint will expose metrics in the format required for Prometheus scraping. The default endpoint exposed by Prometheus is `/actuator/metrics`.

---

## **Testing**

This project uses **Mocha** and **Supertest** to test the application. Below are the details for running tests.

### **1. Run Tests**

You can run the tests for tracing, actuator, and metrics with:

```bash
npm test
```

This will run all the tests to ensure that:
- The `/actuator/trace` endpoint is working.
- Tracing data is being sent to Jaeger.
- Prometheus metrics are being exposed correctly.

### **2. Test Results**

Here’s what the tests will validate:
- **Tracing**: Validates if Jaeger tracing is properly set up and running.
- **Actuator Endpoints**: Validates the `/actuator/health`, `/actuator/metrics`, and `/actuator/tracing` endpoints.
- **Prometheus Metrics**: Verifies that Prometheus is scraping application metrics.

---

## **Folder Structure**

```
/nodejs-app
│
├── /src
│   ├── /config
│   │   └── tracing.js         # OpenTelemetry tracing setup
│   ├── /controllers
│   ├── /routes
│   └── app.js                 # Main application file
│
├── /test
│   ├── app.test.js            # Mocha test file for tracing and endpoints
│   └── prometheus.test.js     # Test for Prometheus metrics
│
├── docker-compose.yml         # Docker configuration for Jaeger and Prometheus
├── package.json               # Project dependencies and scripts
├── README.md                  # This README file
└── .gitignore                 # Git ignore configuration
```

---

## **Docker Setup**

Use **Docker Compose** to quickly set up Jaeger and Prometheus.

### **1. Docker Compose File**

`docker-compose-jaeger.yml` sets up both Jaeger and Prometheus in containers.

```yaml
version: '3'
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    container_name: jaeger
    ports:
      - "5775:5775"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686" # Jaeger UI
      - "14250:14250"
      - "14268:14268"
      - "14200:14200"
    environment:
      - COLLECTOR_ZIPKIN_HTTP_PORT=9411
    networks:
      - observability

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"  # Prometheus UI
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - observability

networks:
  observability:
    driver: bridge
```

### **2. Jaeger UI**

After running the Docker containers, you can view traces at:

```
http://localhost:16686
```

### **3. Prometheus UI**

View the metrics at:

```
http://localhost:9090
```

---

## **Contributing**

Feel free to fork the repository and create a pull request for improvements or fixes. Ensure tests are added for any new features or changes.

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
