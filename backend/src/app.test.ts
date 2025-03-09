import request from 'supertest';
import app from './app';

describe('App', () => {
  describe('GET /ping', () => {
    it('should return pong message', async () => {
      const response = await request(app).get('/ping');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'pong' });
    });
  });
}); 