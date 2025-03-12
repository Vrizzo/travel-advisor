import { TravelPreference } from '../../domain/entities/travel-preference';
import { Route } from '../../domain/entities/route';
import { TravelPreferenceRepository } from '../../domain/repositories/travel-preference.repository';
import { RouteRepository } from '../../domain/repositories/route.repository';

export class FindCompatibleRoutesUseCase {
  constructor(
    private readonly travelPreferenceRepository: TravelPreferenceRepository,
    private readonly routeRepository: RouteRepository
  ) {}

  async execute(preferenceId: string): Promise<{ preference: TravelPreference; compatibleRoutes: Route[] }> {
    // Get travel preference
    const preference = await this.travelPreferenceRepository.findById(preferenceId);
    if (!preference) {
      throw new Error(`Travel preference with id ${preferenceId} not found`);
    }

    // Find all routes from departure city
    const compatibleRoutes = await this.routeRepository.findByDepartureAirport(preference.departureCity);

    // Update lastSearchedAt
    await this.travelPreferenceRepository.updateLastSearched(preferenceId, new Date());

    // Log compatible routes
    console.log('Found compatible routes for travel preference:', {
      preferenceId,
      departureCity: preference.departureCity,
      routes: compatibleRoutes.map(route => ({
        destination: route.arrivalAirport
      }))
    });

    return {
      preference,
      compatibleRoutes
    };
  }

  async findNextPreferenceToSearch(): Promise<TravelPreference | null> {
    return this.travelPreferenceRepository.findNextToSearch();
  }

  async executeNextSearch(): Promise<{ preference: TravelPreference; compatibleRoutes: Route[] } | null> {
    const nextPreference = await this.findNextPreferenceToSearch();
    if (!nextPreference) {
      console.log('No travel preferences found to search');
      return null;
    }

    return this.execute(nextPreference.id!);
  }
} 