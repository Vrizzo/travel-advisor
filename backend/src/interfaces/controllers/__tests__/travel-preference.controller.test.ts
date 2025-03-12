import '@jest/globals';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { TravelPreferenceController } from '../travel-preference.controller';
import { TravelPreference } from '../../../domain/entities/travel-preference';
import { TravelPreferenceRepository } from '../../../domain/repositories/travel-preference.repository';
import { TravelPreferenceUseCase } from '../../../application/use-cases/travel-preference.use-case';

// Mock request and response objects
const mockRequest = () => {
  const req: any = {};
  req.params = {};
  req.body = {};
  return req;
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

// Valid travel preference data
const validTravelPreference = {
  departureCity: 'MXP',
  periodFrom: new Date('2023-05-01'),
  periodTo: new Date('2023-05-15'),
  budget: 1000
};

// Mock repository implementation
class MockTravelPreferenceRepository implements TravelPreferenceRepository {
  private preferences: TravelPreference[] = [];

  async findAll(): Promise<TravelPreference[]> {
    return this.preferences;
  }

  async findById(id: string): Promise<TravelPreference | null> {
    return this.preferences.find(p => p.id === id) || null;
  }

  async save(preference: TravelPreference): Promise<TravelPreference> {
    const id = 'test-id';
    const newPreference = new TravelPreference(
      preference.departureCity,
      preference.periodFrom,
      preference.periodTo,
      preference.budget,
      id
    );
    this.preferences.push(newPreference);
    return newPreference;
  }

  async update(id: string, preference: TravelPreference): Promise<TravelPreference | null> {
    const index = this.preferences.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    const updatedPreference = new TravelPreference(
      preference.departureCity,
      preference.periodFrom,
      preference.periodTo,
      preference.budget,
      id
    );
    this.preferences[index] = updatedPreference;
    return updatedPreference;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.preferences.length;
    this.preferences = this.preferences.filter(p => p.id !== id);
    return this.preferences.length !== initialLength;
  }

  async findNextToSearch(): Promise<TravelPreference | null> {
    // Return the first preference sorted by lastSearchedAt (null first)
    return this.preferences
      .sort((a, b) => {
        if (!a.lastSearchedAt) return -1;
        if (!b.lastSearchedAt) return 1;
        return a.lastSearchedAt.getTime() - b.lastSearchedAt.getTime();
      })[0] || null;
  }

  async updateLastSearched(id: string, lastSearchedAt: Date): Promise<TravelPreference | null> {
    const preference = await this.findById(id);
    if (!preference) return null;
    
    const updatedPreference = new TravelPreference(
      preference.departureCity,
      preference.periodFrom,
      preference.periodTo,
      preference.budget,
      id,
      lastSearchedAt
    );
    
    const index = this.preferences.findIndex(p => p.id === id);
    this.preferences[index] = updatedPreference;
    return updatedPreference;
  }
}

// Subclass of TravelPreferenceUseCase for testing
class TestTravelPreferenceUseCase extends TravelPreferenceUseCase {
  constructor() {
    super(new MockTravelPreferenceRepository());
  }
}

describe('TravelPreferenceController', () => {
  let controller: TravelPreferenceController;
  let useCase: TestTravelPreferenceUseCase;
  let req: any;
  let res: any;

  beforeEach(() => {
    useCase = new TestTravelPreferenceUseCase();
    controller = new TravelPreferenceController(useCase);
    req = mockRequest();
    res = mockResponse();
  });

  it('should create a travel preference', async () => {
    const { departureCity, periodFrom, periodTo, budget } = validTravelPreference;
    req.body = { departureCity, periodFrom, periodTo, budget };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const sentData = res.json.mock.calls[0][0];
    expect(sentData).toHaveProperty('departureCity', departureCity);
    expect(sentData).toHaveProperty('id', 'test-id');
  });

  it('should return 400 if travel preference data is invalid', async () => {
    req.body = { departureCity: '', periodFrom: null, periodTo: null, budget: -100 };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toHaveProperty('error');
  });

  it('should get all travel preferences', async () => {
    // Create a preference first
    const { departureCity, periodFrom, periodTo, budget } = validTravelPreference;
    await useCase.create(departureCity, periodFrom, periodTo, budget);

    await controller.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const sentData = res.json.mock.calls[0][0];
    expect(Array.isArray(sentData)).toBe(true);
    expect(sentData).toHaveLength(1);
    expect(sentData[0]).toHaveProperty('departureCity', departureCity);
  });

  it('should get a travel preference by id', async () => {
    // Create a preference first
    const { departureCity, periodFrom, periodTo, budget } = validTravelPreference;
    const preference = await useCase.create(departureCity, periodFrom, periodTo, budget);

    req.params.id = preference.id;

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const sentData = res.json.mock.calls[0][0];
    expect(sentData).toHaveProperty('departureCity', departureCity);
    expect(sentData).toHaveProperty('id', preference.id);
  });

  it('should return 404 if travel preference is not found', async () => {
    req.params.id = 'non-existent-id';

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toHaveProperty('error');
  });

  it('should update a travel preference', async () => {
    // Create a preference first
    const { departureCity, periodFrom, periodTo, budget } = validTravelPreference;
    const preference = await useCase.create(departureCity, periodFrom, periodTo, budget);

    req.params.id = preference.id;
    req.body = {
      departureCity: 'FCO',
      periodFrom: new Date('2023-06-01'),
      periodTo: new Date('2023-06-15'),
      budget: 1500
    };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const sentData = res.json.mock.calls[0][0];
    expect(sentData).toHaveProperty('departureCity', 'FCO');
    expect(sentData).toHaveProperty('budget', 1500);
  });

  it('should return 404 if travel preference to update is not found', async () => {
    req.params.id = 'non-existent-id';
    req.body = { ...validTravelPreference };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toHaveProperty('error');
  });

  it('should delete a travel preference', async () => {
    // Create a preference first
    const { departureCity, periodFrom, periodTo, budget } = validTravelPreference;
    const preference = await useCase.create(departureCity, periodFrom, periodTo, budget);

    req.params.id = preference.id;

    await controller.delete(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it('should return 404 if travel preference to delete is not found', async () => {
    req.params.id = 'non-existent-id';

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toHaveProperty('error');
  });
}); 