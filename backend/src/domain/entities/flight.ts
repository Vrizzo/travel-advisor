export class Flight {
  readonly id?: string;
  readonly lastUpdated: Date;

  constructor(
    readonly departureAirport: string,
    readonly arrivalAirport: string,
    readonly departureTime: Date,
    readonly arrivalTime: Date,
    readonly price: number,
    readonly airline: string,
    readonly deepLink: string,
    readonly travelPreferenceId: string,
    id?: string,
    lastUpdated?: Date
  ) {
    if (!departureAirport) throw new Error('Departure airport is required');
    if (!arrivalAirport) throw new Error('Arrival airport is required');
    if (!departureTime) throw new Error('Departure time is required');
    if (!arrivalTime) throw new Error('Arrival time is required');
    if (price <= 0) throw new Error('Price must be greater than zero');
    if (!airline) throw new Error('Airline is required');
    if (!deepLink) throw new Error('Deep link is required');
    if (!travelPreferenceId) throw new Error('Travel preference ID is required');

    this.id = id;
    this.lastUpdated = lastUpdated || new Date();
  }
} 