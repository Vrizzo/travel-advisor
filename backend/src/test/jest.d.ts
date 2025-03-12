import type { TravelPreferenceRepository as _TravelPreferenceRepository } from '../domain/repositories/travel-preference.repository';
import type { RouteRepository as _RouteRepository } from '../domain/repositories/route.repository';
import type { FlightRepository as _FlightRepository } from '../domain/repositories/flight.repository';

declare global {
  namespace jest {
    // Extend Jest's mock types to support our repository interfaces
    interface Mock<_T = any, _Y extends any[] = any[]> {
      mockResolvedValue<V>(value: V): this;
      mockResolvedValueOnce<V>(value: V): this;
    }

    // Utility type for mocking repositories
    type Mocked<T> = {
      [P in keyof T]: jest.Mock<any, any>;
    } & T;

    interface Matchers<R, T> {
      toEqual(expected: any): R;
      toBe(expected: any): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toBeNull(): R;
      toThrow(message?: string | RegExp): R;
      rejects: Matchers<Promise<R>, T>;
    }
  }
}

export {}; 