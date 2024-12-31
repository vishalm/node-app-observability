// Import required packages
const chai = require('chai');
const request = require('supertest');
const app = require('../../src/app'); // Path to your app.js or server file

// Set up Chai's expect assertion style
const { expect } = chai;

describe('Actuator Endpoints', function () {
    it('should return app info', async function () {
      const response = await request(app).get('/actuator/info');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('app');
    });
  
    it('should return health info', async function () {
      const response = await request(app).get('/actuator/health');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status').that.equals('UP');
    });
  
    it('should return metrics from Prometheus', async function () {
      const response = await request(app).get('/metrics');
      expect(response.status).to.equal(200);
      expect(response.text).to.include('# HELP'); // This ensures the response is in Prometheus format
    });
  });
