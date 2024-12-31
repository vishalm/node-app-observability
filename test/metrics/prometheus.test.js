// Import required packages
const chai = require('chai');
const request = require('supertest');
const app = require('../../src/app'); // Path to your app.js or server file

// Set up Chai's expect assertion style
const { expect } = chai;

describe('Prometheus Metrics', () => {
    it('should return metrics from Prometheus', async function () {
        const response = await request(app).get('/metrics');
        expect(response.status).to.equal(200);
        expect(response.text).to.include('# HELP'); // This ensures the response is in Prometheus format
      });
});
