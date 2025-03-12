export class TravelPreference {
  id?: string;
  departureCity: string;
  periodFrom: Date;
  periodTo: Date;
  budget: number;
  lastSearchedAt?: Date;

  constructor(
    departureCity: string,
    periodFrom: Date,
    periodTo: Date,
    budget: number,
    id?: string,
    lastSearchedAt?: Date
  ) {
    this.departureCity = departureCity;
    this.periodFrom = periodFrom;
    this.periodTo = periodTo;
    this.budget = budget;
    this.id = id;
    this.lastSearchedAt = lastSearchedAt;
    this.validate();
  }

  private validate(): void {
    if (!this.departureCity) {
      throw new Error('Departure city is required');
    }

    if (!this.periodFrom) {
      throw new Error('Period from date is required');
    }

    if (!this.periodTo) {
      throw new Error('Period to date is required');
    }

    if (this.periodFrom > this.periodTo) {
      throw new Error('Period from date must be before period to date');
    }

    if (!this.budget || this.budget <= 0) {
      throw new Error('Budget must be greater than zero');
    }
  }
} 