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

  async findByDepartureAirport(departureAirport: string): Promise<Route[]> {
    const routes = await RouteModel.find({ departureAirport });
    return routes.map(route => this.documentToEntity(route));
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

    return updatedRoute ? this.documentToEntity(updatedRoute) : null;
  }

  async delete(id: string): Promise<void> {
    await RouteModel.deleteOne({ _id: id });
  }
} 