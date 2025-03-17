import { MongoFlightRepository } from './repositories/mongodb/mongo-flight.repository';
import { FlightRepository } from '../domain/repositories/flight.repository';

export const container = {
  flightRepository: new MongoFlightRepository() as FlightRepository
}; 