import '@jest/globals';
import { KiwiClient } from '../kiwi.client';
import axios from 'axios';

// Mock environment variables
process.env.KIWI_API_KEY = 'test-api-key';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('KiwiClient', () => {
  let kiwiClient: KiwiClient;

  beforeEach(() => {
    kiwiClient = new KiwiClient();
    jest.clearAllMocks();
  });

  it('should search flights from Milan to London', async () => {
    const mockResponse = {
      data: {
        data: [
          {
            flyFrom: 'MXP',
            flyTo: 'LHR',
            price: 100,
            airlines: ['AZ'],
            deep_link: 'https://www.kiwi.com/deep?from=MXP&to=LHR',
            local_arrival: '2024-03-20T10:00:00.000Z',
            local_departure: '2024-03-20T08:00:00.000Z'
          }
        ]
      }
    };

    // Mock axios response
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const searchParams = {
      flyFrom: 'MXP',
      flyTo: 'LHR',
      dateFrom: new Date().toISOString().split('T')[0],
      dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      adults: 1,
      currency: 'EUR'
    };

    const result = await kiwiClient.searchFlights(searchParams);

    expect(result).toBeDefined();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].flyFrom).toBe('MXP');
    expect(result.data[0].flyTo).toBe('LHR');
    expect(result.data[0].price).toBe(100);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('tequila.kiwi.com'),
      expect.objectContaining({
        headers: {
          'apikey': 'test-api-key'
        },
        params: expect.objectContaining({
          flyFrom: 'MXP',
          flyTo: 'LHR',
          adults: 1,
          curr: 'EUR'
        })
      })
    );
  });

  it('should throw error when API key is not set', () => {
    // Temporarily remove the API key
    const originalApiKey = process.env.KIWI_API_KEY;
    delete process.env.KIWI_API_KEY;

    // Attempt to create client should throw error
    expect(() => new KiwiClient()).toThrow('KIWI_API_KEY environment variable is not set');

    // Restore the API key
    process.env.KIWI_API_KEY = originalApiKey;
  });
}); 