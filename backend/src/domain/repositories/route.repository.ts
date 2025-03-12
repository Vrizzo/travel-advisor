import { Route } from '../entities/route';

export interface RouteRepository {
  save(route: Route): Promise<Route>;
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByDepartureAirport(departureAirport: string): Promise<Route[]>;
  update(id: string, route: Route): Promise<Route | null>;
  delete(id: string): Promise<void>;
} 