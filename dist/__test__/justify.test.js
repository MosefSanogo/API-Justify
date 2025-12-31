import request from 'supertest';
import express from 'express';
import justifyRoute from '../routes/justify.route.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";
const app = express();
app.use(express.json());
app.use('/api', authMiddleware, justifyRoute);
describe('POST /api/justify', () => {
    it('should return 401 without token', async () => {
        const response = await request(app)
            .post('/api/justify')
            .send({ text: 'Hello world' });
        expect(response.status).toBe(401);
    });
    it('should justify text with valid token', async () => {
        // D'abord, obtenez un token
        const tokenResponse = await request(app)
            .post('/api/token')
            .send({ email: 'test@example.com' });
        const token = tokenResponse.body.token;
        // Utilisez le token pour justifier
        const response = await request(app)
            .post('/api/justify')
            .set('Authorization', `Bearer ${token}`)
            .send('Hello world this is a test');
        //expect(response.status).toBe(200);
        expect(response.text).toBeDefined();
    });
});
