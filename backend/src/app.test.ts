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

  describe('POST /api/travel-preferences', () => {
    it('should save travel preferences', async () => {
      const travelPreference = {
        departureCity: 'MILAN',
        periodFrom: '2025-05-25',
        periodTo: '2025-05-30',
        budget: 300
      };

      const response = await request(app)
        .post('/api/travel-preferences')
        .send(travelPreference);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        data: {
          id: expect.any(String),
          ...travelPreference
        }
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/travel-preferences')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        errors: [
          'departureCity is required',
          'periodFrom is required',
          'periodTo is required',
          'budget is required'
        ]
      });
    });

    it('should validate date format', async () => {
      const response = await request(app)
        .post('/api/travel-preferences')
        .send({
          departureCity: 'MILAN',
          periodFrom: 'invalid-date',
          periodTo: 'invalid-date',
          budget: 300
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        errors: [
          'periodFrom must be a valid date in YYYY-MM-DD format',
          'periodTo must be a valid date in YYYY-MM-DD format'
        ]
      });
    });

    it('should validate budget is a positive number', async () => {
      const response = await request(app)
        .post('/api/travel-preferences')
        .send({
          departureCity: 'MILAN',
          periodFrom: '2025-05-25',
          periodTo: '2025-05-30',
          budget: -100
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        errors: ['budget must be a positive number']
      });
    });
  });
}); 