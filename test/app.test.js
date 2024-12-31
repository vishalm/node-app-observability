const request = require('supertest');
const app = require('../src/app');
const chai = require('chai');

// beforeAll(async () => {
//   await new Promise((resolve) => app.listen(port, resolve));
// });

// Set up Chai's expect assertion style
const { expect } = chai;

describe('App Endpoints', () => {
    it('should return Hello, World!', async () => {
      const response =  await request(app).get('/');
      expect(response.status).to.equal(200);
      expect(response.text).to.be.include('Hello, World!');
    });
    it('should return health check', async () => {
      const response =  await request(app).get('/health-check');
        expect(response.statusCode).to.equal(200);
        expect(response.body.status).to.be.include('UP');
      });
  });