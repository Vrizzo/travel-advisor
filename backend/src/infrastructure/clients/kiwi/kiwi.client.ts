import axios from 'axios';

interface FlightSearchParams {
  flyFrom: string;
  flyTo: string;
  dateFrom: string;
  dateTo: string;
  adults: number;
  currency?: string;
}

interface Flight {
  flyFrom: string;
  flyTo: string;
  price: number;
  airlines: string[];
  deep_link: string;
  local_arrival: string;
  local_departure: string;
}

interface FlightSearchResponse {
  data: Flight[];
}

export class KiwiClient {
  private readonly baseUrl = 'https://tequila.kiwi.com';
  private readonly apiKey: string;

  constructor() {
    const apiKey = process.env.KIWI_API_KEY;
    if (!apiKey) {
      throw new Error('KIWI_API_KEY environment variable is not set');
    }
    this.apiKey = apiKey;
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/v2/search`, {
        headers: {
          'apikey': this.apiKey
        },
        params: {
          ...params,
          curr: params.currency || 'EUR'
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Kiwi API error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }
} 