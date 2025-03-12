export class Route {
  readonly id?: string;

  constructor(
    readonly departureAirport: string,
    readonly arrivalAirport: string,
    id?: string
  ) {
    if (!departureAirport) throw new Error('Departure airport is required');
    if (!arrivalAirport) throw new Error('Arrival airport is required');
    this.id = id;
    this.validate();
  }

  private validate(): void {
    if (!this.departureAirport || !this.arrivalAirport) {
      throw new Error('Departure and arrival airports are required');
    }

    if (this.departureAirport.length !== 3 || this.arrivalAirport.length !== 3) {
      throw new Error('Airport codes must be 3 characters long');
    }

    if (this.departureAirport === this.arrivalAirport) {
      throw new Error('Departure and arrival airports cannot be the same');
    }
  }
} 