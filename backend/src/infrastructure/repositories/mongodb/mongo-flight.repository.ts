import { Flight } from '../../../domain/entities/flight';
import { FlightRepository } from '../../../domain/repositories/flight.repository';
import { FlightModel, FlightDocument } from './models/flight.model';

export class MongoFlightRepository implements FlightRepository {
  async findById(id: string): Promise<Flight | null> {
    const flight = await FlightModel.findById(id);
    if (!flight) {
      return null;
    }
    return this.mapToEntity(flight);
  }

  async findByTravelPreferenceId(preferenceId: string): Promise<Flight[]> {
    const flights = await FlightModel.find({ travelPreferenceId: preferenceId });
    return flights.map(flight => this.mapToEntity(flight));
  }

  async save(flight: Flight): Promise<Flight> {
    const flightDocument = new FlightModel({
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      airline: flight.airline,
      deepLink: flight.deepLink,
      travelPreferenceId: flight.travelPreferenceId,
      lastUpdated: flight.lastUpdated
    });

    const savedFlight = await flightDocument.save();
    return this.mapToEntity(savedFlight);
  }

  async saveMany(flights: Flight[]): Promise<Flight[]> {
    if (flights.length === 0) {
      return [];
    }

    const flightDocuments = flights.map(flight => new FlightModel({
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      airline: flight.airline,
      deepLink: flight.deepLink,
      travelPreferenceId: flight.travelPreferenceId,
      lastUpdated: flight.lastUpdated
    }));

    const savedFlights = await FlightModel.insertMany(flightDocuments);
    return savedFlights.map(flight => this.mapToEntity(flight));
  }

  private mapToEntity(flight: FlightDocument): Flight {
    return new Flight(
      flight.departureAirport,
      flight.arrivalAirport,
      flight.departureTime,
      flight.arrivalTime,
      flight.price,
      flight.airline,
      flight.deepLink,
      typeof flight.travelPreferenceId === 'string' ? flight.travelPreferenceId : flight.travelPreferenceId.toString(),
      flight._id.toString(),
      flight.lastUpdated
    );
  }

  async findAll(): Promise<Flight[]> {
    const flights = await FlightModel.find().sort({ price: 1 });
    return flights.map(flight => this.mapToEntity(flight));
  }

  async findByRoute(departureAirport: string, arrivalAirport: string): Promise<Flight[]> {
    const flights = await FlightModel.find({ 
      departureAirport, 
      arrivalAirport 
    }).sort({ price: 1 });
    
    return flights.map(flight => this.mapToEntity(flight));
  }

  async update(id: string, flight: Flight): Promise<Flight | null> {
    const updated = await FlightModel.findByIdAndUpdate(
      id,
      {
        departureAirport: flight.departureAirport,
        arrivalAirport: flight.arrivalAirport,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        price: flight.price,
        airline: flight.airline,
        deepLink: flight.deepLink,
        travelPreferenceId: flight.travelPreferenceId,
        lastUpdated: new Date()
      },
      { new: true }
    );

    return updated ? this.mapToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await FlightModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async deleteByTravelPreferenceId(travelPreferenceId: string): Promise<boolean> {
    const result = await FlightModel.deleteMany({ travelPreferenceId });
    return result.deletedCount > 0;
  }

  async findByRouteId(routeId: string): Promise<Flight[]> {
    const flights = await FlightModel.find({ routeId });
    return flights.map(flight => this.mapToEntity(flight));
  }
} 