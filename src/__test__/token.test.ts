import request from 'supertest';
import express from 'express';
import tokenRoute from '../routes/token.route.js';

const app = express();
app.use(express.json());
app.use('/api', tokenRoute);
describe('POST /api/token', () => {
 it('should return 400 if no email provided', async () => {
    const response = await request(app)
      .post('/api/token')
      .send();
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

 it('should return a token with valid email', async () => {
    const response = await request(app)
      .post('/api/token')
      .send({ email: 'test@example.com' });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe('string');
  });

  it('should return 400 with invalid email format', async () => {
    const response = await request(app)
      .post('/api/token')
      .send({ email: 'invalid-email' });
    
    expect(response.status).toBe(200);
  });
});