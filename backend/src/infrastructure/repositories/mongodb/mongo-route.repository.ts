import { Route } from '../../../domain/entities/route';
import { RouteRepository } from '../../../domain/repositories/route.repository';
import { RouteModel } from './models/route.model';

export class MongoRouteRepository implements RouteRepository {
  async findAll(): Promise<Route[]> {
    const routes = await RouteModel.find();
    return routes.map(route => new Route(
      route.departureAirport,
      route.arrivalAirport
    ));
  }

  async findById(id: string): Promise<Route | null> {
    const route = await RouteModel.findById(id);
    if (!route) return null;
    return new Route(
      route.departureAirport,
      route.arrivalAirport
    );
  }

  async findByDepartureAirport(departureAirport: string): Promise<Route[]> {
    const routes = await RouteModel.find({ departureAirport });
    return routes.map(route => new Route(
      route.departureAirport,
      route.arrivalAirport
    ));
  }

  async save(route: Route): Promise<Route> {
    const newRoute = new RouteModel({
      departureAirport: route.departureAirport,
      arrivalAirport: route.arrivalAirport
    });
    await newRoute.save();
    return new Route(
      newRoute.departureAirport,
      newRoute.arrivalAirport
    );
  }

  async update(id: string, route: Route): Promise<Route | null> {
    const updatedRoute = await RouteModel.findByIdAndUpdate(
      id,
      {
        departureAirport: route.departureAirport,
        arrivalAirport: route.arrivalAirport
      },
      { new: true }
    );
    if (!updatedRoute) return null;
    return new Route(
      updatedRoute.departureAirport,
      updatedRoute.arrivalAirport
    );
  }

  async delete(id: string): Promise<void> {
    await RouteModel.findByIdAndDelete(id);
  }
} 