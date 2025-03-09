export class TravelPreference {
  constructor(
    public readonly departureCity: string,
    public readonly periodFrom: string,
    public readonly periodTo: string,
    public readonly budget: number,
    public readonly id?: string
  ) {
    this.validate();
  }

  private validate(): void {
    const errors: string[] = [];

    if (!this.departureCity) {
      errors.push('Departure city is required');
    }

    if (!this.isValidDate(this.periodFrom)) {
      errors.push('Period from must be a valid date in YYYY-MM-DD format');
    }

    if (!this.isValidDate(this.periodTo)) {
      errors.push('Period to must be a valid date in YYYY-MM-DD format');
    }

    if (this.budget <= 0) {
      errors.push('Budget must be a positive number');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  private isValidDate(date: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }
} 