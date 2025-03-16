import '@jest/globals';
import { KiwiClient } from '../kiwi.client';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('KiwiClient', () => {
  let kiwiClient: KiwiClient;
  const testApiKey = 'test-api-key';

  beforeEach(() => {
    kiwiClient = new KiwiClient(testApiKey);
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
          fly_from: 'MXP',
          fly_to: 'LHR',
          adults: 1,
          curr: 'EUR'
        })
      })
    );
  });

  it('should throw error when no API key is available', () => {
    // Save original env var
    const originalApiKey = process.env.KIWI_API_KEY;
    // Remove env var
    delete process.env.KIWI_API_KEY;
    
    // Now attempting to create a client with no key should throw
    expect(() => new KiwiClient()).toThrow('KIWI_API_KEY environment variable is not set or API key not provided');
    
    // Restore env var
    process.env.KIWI_API_KEY = originalApiKey;
  });
  
  it('should use environment variable as fallback', () => {
    // Set environment variable
    process.env.KIWI_API_KEY = 'env-api-key';
    
    // Create client without explicit key
    const client = new KiwiClient();
    
    // Verify client is created successfully
    expect(client).toBeDefined();
    
    // Reset environment
    delete process.env.KIWI_API_KEY;
  });
}); 