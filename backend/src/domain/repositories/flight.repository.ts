import { Flight } from '../entities/flight';

export interface FlightRepository {
  save(flight: Flight): Promise<Flight>;
  findAll(): Promise<Flight[]>;
  findById(id: string): Promise<Flight | null>;
  findByTravelPreferenceId(travelPreferenceId: string): Promise<Flight[]>;
  findByRoute(departureAirport: string, arrivalAirport: string): Promise<Flight[]>;
  update(id: string, flight: Flight): Promise<Flight | null>;
  delete(id: string): Promise<boolean>;
  deleteByTravelPreferenceId(travelPreferenceId: string): Promise<boolean>;
} 