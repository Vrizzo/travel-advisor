import { TravelPreference } from '../../domain/entities/travel-preference';
import { Route } from '../../domain/entities/route';
import { Flight } from '../../domain/entities/flight';
import { FlightRepository } from '../../domain/repositories/flight.repository';
import { KiwiClient } from '../../infrastructure/clients/kiwi/kiwi.client';
import { formatDate } from '../../utils/date-utils';

export class SearchFlightsUseCase {

  constructor(
    private readonly flightRepository: FlightRepository,
    private readonly kiwiClient: KiwiClient) {}

  async searchAndSaveFlights(preference: TravelPreference, compatibleRoutes: Route[]): Promise<Flight[]> {
    // Delete existing flights for this preference to avoid duplicates
    await this.flightRepository.deleteByTravelPreferenceId(preference.id!);
    
    if (!this.kiwiClient) {
      throw new Error('KiwiClient not initialized');
    }
    
    const savedFlights: Flight[] = [];
    
    // Format dates for the API
    const dateFrom = formatDate(preference.periodFrom);
    const dateTo = formatDate(preference.periodTo);
    
    // For each route, search for flights
    for (const route of compatibleRoutes) {
      try {
        console.log(`🛫 Searching flights from ${route.departureAirport} to ${route.arrivalAirport} (${dateFrom} - ${dateTo})`);
        
        const searchParams = {
          flyFrom: route.departureAirport,
          flyTo: route.arrivalAirport,
          dateFrom,
          dateTo,
          adults: 1,
          currency: 'EUR'
        };
        
        const flightResults = await this.kiwiClient.searchFlights(searchParams);
        console.log(`✅ Found ${flightResults.data.length} flights from ${route.departureAirport} to ${route.arrivalAirport}`);
        
        // Filter flights by budget and save them
        const affordableFlights = flightResults.data.filter(flight => flight.price <= preference.budget);
        console.log(`💰 ${affordableFlights.length} flights are within budget (${preference.budget} EUR)`);
        
        // Save each affordable flight
        for (const flightData of affordableFlights) {
          try {
            // Create a Flight entity
            const flight = new Flight(
              flightData.flyFrom,
              flightData.flyTo,
              new Date(flightData.local_departure),
              new Date(flightData.local_arrival),
              flightData.price,
              flightData.airlines[0] || 'Unknown',
              flightData.deep_link,
              preference.id!
            );
            
            // Save the flight to the database
            const savedFlight = await this.flightRepository.save(flight);
            savedFlights.push(savedFlight);
          } catch (error) {
            console.error(`Error saving flight: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      } catch (error) {
        console.error(`Error searching flights for route ${route.departureAirport} to ${route.arrivalAirport}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    console.log(`✅ Saved ${savedFlights.length} affordable flights for travel preference ${preference.id}`);
    return savedFlights;
  }
} 