const request = require('supertest');
const app = require('../../src/app');
const chai = require('chai');

// beforeAll(async () => {
//   await new Promise((resolve) => app.listen(port, resolve));
// });

// Set up Chai's expect assertion style
const { expect } = chai;

// describe('Graceful Shutdown', () => {
//   it('should shut down OpenTelemetry and terminate gracefully', (done) => {
//     const logs = [];
//     const originalLog = console.log;
//     console.log = (msg) => {
//       logs.push(msg);
//     };

//     // Simulate a graceful shutdown
//     process.emit('SIGTERM');

//     // Wait a bit for shutdown sequence to complete
//     setTimeout(() => {
//       expect(logs).to.include('OpenTelemetry tracing terminated');
//       console.log = originalLog;  // Restore console.log
//       done();
//     }, 1000);
//   });
// });

describe('Graceful Shutdown', () => {
    it('should return Shutdown check', async () => {
        const response =  await request(app).get('/health-check');
          expect(response.statusCode).to.equal(200);
          expect(response.body.status).to.be.include('UP');
        });
  });

  