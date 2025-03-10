import { Route } from '../../../domain/entities/route';
import { RouteRepository } from '../../../domain/repositories/route.repository';
import { RouteModel, RouteDocument } from './models/route.model';

export class MongoRouteRepository implements RouteRepository {
  private documentToEntity(doc: RouteDocument): Route {
    return new Route(
      doc.departureAirport,
      doc.arrivalAirport,
      doc._id.toString()
    );
  }

  async save(route: Route): Promise<Route> {
    const created = await RouteModel.create({
      departureAirport: route.departureAirport,
      arrivalAirport: route.arrivalAirport
    });

    return this.documentToEntity(created);
  }

  async findAll(): Promise<Route[]> {
    const routes = await RouteModel.find().sort({ createdAt: -1 });
    return routes.map(route => this.documentToEntity(route));
  }

  async findById(id: string): Promise<Route | null> {
    const route = await RouteModel.findById(id);
    return route ? this.documentToEntity(route) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await RouteModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
} 