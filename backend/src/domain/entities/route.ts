export class Route {
  constructor(
    public readonly departureAirport: string,
    public readonly arrivalAirport: string,
    public readonly id?: string
  ) {
    this.validate();
  }

  private validate(): void {
    const errors: string[] = [];

    if (!this.departureAirport) {
      errors.push('Departure airport is required');
    }

    if (!this.arrivalAirport) {
      errors.push('Arrival airport is required');
    }

    if (this.departureAirport === this.arrivalAirport) {
      errors.push('Departure and arrival airports must be different');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
} 