import axios from 'axios';

export interface FlightSearchParams {
  flyFrom: string;
  flyTo: string;
  dateFrom: string;
  dateTo: string;
  adults: number;
  currency: string;
}

export interface Flight {
  flyFrom: string;
  flyTo: string;
  local_departure: string;
  local_arrival: string;
  price: number;
  airlines: string[];
  deep_link: string;
}

export interface FlightSearchResponse {
  data: Flight[];
}

export class KiwiClient {
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.KIWI_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('KIWI_API_KEY environment variable is not set or API key not provided');
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    try {
      console.log('searchFlights from:', params.flyFrom, 'to:', params.flyTo, 'dateFrom:', params.dateFrom, 'dateTo:', params.dateTo, 'adults:', params.adults, 'currency:', params.currency);
      const response = await axios.get('https://api.tequila.kiwi.com/v2/search', {
        headers: {
          'apikey': this.apiKey
        },
        params: {
          fly_from: params.flyFrom,
          fly_to: params.flyTo,
          date_from: params.dateFrom,
          date_to: params.dateTo,
          adults: params.adults,
          curr: params.currency,
          partner: 'traveladvisor',
          limit: 10
        }
      });
      console.log('searchFlights from:', params.flyFrom, 'to:', params.flyTo, 'status:', response.status);
      return {
        data: response.data.data
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  }
} 