import { Flight } from '../../../domain/entities/flight';
import { FlightRepository } from '../../../domain/repositories/flight.repository';
import { FlightModel, FlightDocument } from './models/flight.model';
import mongoose from 'mongoose';

export class MongoFlightRepository implements FlightRepository {
  private documentToEntity(doc: FlightDocument): Flight {
    return new Flight(
      doc.departureAirport,
      doc.arrivalAirport,
      doc.departureTime,
      doc.arrivalTime,
      doc.price,
      doc.airline,
      doc.deepLink,
      doc.travelPreferenceId.toString(),
      doc._id.toString(),
      doc.lastUpdated
    );
  }

  async save(flight: Flight): Promise<Flight> {
    const created = await FlightModel.create({
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

    return this.documentToEntity(created);
  }

  async findAll(): Promise<Flight[]> {
    const flights = await FlightModel.find().sort({ price: 1 });
    return flights.map(flight => this.documentToEntity(flight));
  }

  async findById(id: string): Promise<Flight | null> {
    const flight = await FlightModel.findById(id);
    return flight ? this.documentToEntity(flight) : null;
  }

  async findByTravelPreferenceId(travelPreferenceId: string): Promise<Flight[]> {
    const flights = await FlightModel.find({ travelPreferenceId }).sort({ price: 1 });
    return flights.map(flight => this.documentToEntity(flight));
  }

  async findByRoute(departureAirport: string, arrivalAirport: string): Promise<Flight[]> {
    const flights = await FlightModel.find({ 
      departureAirport, 
      arrivalAirport 
    }).sort({ price: 1 });
    
    return flights.map(flight => this.documentToEntity(flight));
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

    return updated ? this.documentToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await FlightModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async deleteByTravelPreferenceId(travelPreferenceId: string): Promise<boolean> {
    const result = await FlightModel.deleteMany({ travelPreferenceId });
    return result.deletedCount > 0;
  }
} 