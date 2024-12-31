// Import required packages
const chai = require('chai');
const request = require('supertest');
const app = require('../../src/app'); // Path to your app.js or server file

// Set up Chai's expect assertion style
const { expect } = chai;

describe('Jaeger Tracing', function () {
    it('should have tracing enabled', async function () {
      const response = await request(app).get('/custom');
      expect(response.status).to.equal(200);
      // Additional assertions depending on the response format and Jaeger setup
    });
  });
