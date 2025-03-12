export class Route {
  constructor(
    public readonly departureAirport: string,
    public readonly arrivalAirport: string
  ) {
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