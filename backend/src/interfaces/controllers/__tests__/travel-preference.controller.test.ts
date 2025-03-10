import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { TravelPreference } from '../../../domain/entities/travel-preference';
import { TravelPreferenceUseCase } from '../../../application/use-cases/travel-preference.use-case';
import { TravelPreferenceController } from '../travel-preference.controller';
import { TravelPreferenceRepository } from '../../../domain/repositories/travel-preference.repository';

// Mock Express Request and Response
const mockRequest = (body = {}, params = {}) => ({
  body,
  params
}) as Request;

const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis()
  } as unknown as Response;
  return res;
};

// Mock Repository
class MockTravelPreferenceRepository implements TravelPreferenceRepository {
  private preferences: TravelPreference[] = [];

  async save(preference: TravelPreference): Promise<TravelPreference> {
    this.preferences.push(preference);
    return preference;
  }

  async findAll(): Promise<TravelPreference[]> {
    return this.preferences;
  }

  async findById(id: string): Promise<TravelPreference | null> {
    return this.preferences.find(p => p.id === id) || null;
  }

  async update(id: string, preference: TravelPreference): Promise<TravelPreference | null> {
    const index = this.preferences.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.preferences[index] = preference;
    return preference;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.preferences.length;
    this.preferences = this.preferences.filter(p => p.id !== id);
    return this.preferences.length < initialLength;
  }
}

// Mock Use Case
class MockTravelPreferenceUseCase extends TravelPreferenceUseCase {
  private preferences: TravelPreference[] = [];

  constructor() {
    super(new MockTravelPreferenceRepository());
  }

  async createTravelPreference(
    departureCity: string,
    periodFrom: string,
    periodTo: string,
    budget: number
  ): Promise<TravelPreference> {
    const preference = new TravelPreference(
      departureCity,
      periodFrom,
      periodTo,
      budget,
      'mock-id'
    );
    this.preferences.push(preference);
    return preference;
  }

  async getAllTravelPreferences(): Promise<TravelPreference[]> {
    return this.preferences;
  }

  async getTravelPreferenceById(id: string): Promise<TravelPreference | null> {
    return this.preferences.find(p => p.id === id) || null;
  }

  async updateTravelPreference(
    id: string,
    departureCity: string,
    periodFrom: string,
    periodTo: string,
    budget: number
  ): Promise<TravelPreference | null> {
    const index = this.preferences.findIndex(p => p.id === id);
    if (index === -1) return null;

    const preference = new TravelPreference(
      departureCity,
      periodFrom,
      periodTo,
      budget,
      id
    );
    this.preferences[index] = preference;
    return preference;
  }

  async deleteTravelPreference(id: string): Promise<boolean> {
    const initialLength = this.preferences.length;
    this.preferences = this.preferences.filter(p => p.id !== id);
    return this.preferences.length < initialLength;
  }
}

describe('TravelPreferenceController', () => {
  let controller: TravelPreferenceController;
  let useCase: TravelPreferenceUseCase;

  const validPreference = {
    departureCity: 'New York',
    periodFrom: '2024-05-01',
    periodTo: '2024-05-10',
    budget: 5000
  };

  beforeEach(() => {
    useCase = new MockTravelPreferenceUseCase();
    controller = new TravelPreferenceController(useCase);
  });

  describe('create', () => {
    it('should create a new travel preference', async () => {
      const req = mockRequest(validPreference);
      const res = mockResponse();

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          departureCity: validPreference.departureCity,
          id: 'mock-id'
        })
      });
    });

    it('should return 400 for invalid input', async () => {
      const req = mockRequest({ ...validPreference, budget: -100 });
      const res = mockResponse();

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.any(String)
      });
    });
  });

  describe('getAll', () => {
    it('should return all travel preferences', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await useCase.createTravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      await controller.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            departureCity: validPreference.departureCity
          })
        ])
      });
    });
  });

  describe('getById', () => {
    it('should return a travel preference by id', async () => {
      const preference = await useCase.createTravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      const req = mockRequest({}, { id: preference.id });
      const res = mockResponse();

      await controller.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          departureCity: validPreference.departureCity
        })
      });
    });

    it('should return 404 for non-existent id', async () => {
      const req = mockRequest({}, { id: 'non-existent' });
      const res = mockResponse();

      await controller.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Travel preference not found'
      });
    });
  });

  describe('update', () => {
    it('should update an existing travel preference', async () => {
      const preference = await useCase.createTravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      const updateData = {
        ...validPreference,
        departureCity: 'Los Angeles'
      };

      const req = mockRequest(updateData, { id: preference.id });
      const res = mockResponse();

      await controller.update(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          departureCity: 'Los Angeles'
        })
      });
    });

    it('should return 404 for non-existent id', async () => {
      const req = mockRequest(validPreference, { id: 'non-existent' });
      const res = mockResponse();

      await controller.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Travel preference not found'
      });
    });
  });

  describe('delete', () => {
    it('should delete an existing travel preference', async () => {
      const preference = await useCase.createTravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      const req = mockRequest({}, { id: preference.id });
      const res = mockResponse();

      await controller.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 for non-existent id', async () => {
      const req = mockRequest({}, { id: 'non-existent' });
      const res = mockResponse();

      await controller.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Travel preference not found'
      });
    });
  });
}); 