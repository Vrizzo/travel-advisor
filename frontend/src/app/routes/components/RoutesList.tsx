import { BookNowButton } from './BookNowButton';

interface TravelPreference {
  id: string;
  departureCity: string;
  periodFrom: string;
  periodTo: string;
  budget: number;
  lastSearched?: string;
}

interface Route {
  id: string;
  departureAirport: string;
  arrivalAirport: string;
  price: number;
  airline: string;
  departureDate: string;
  arrivalDate: string;
  duration: number;
}

async function getPreference(id: string): Promise<TravelPreference> {
  // Server-side API call to the backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  const response = await fetch(`${API_URL}/travel-preferences/${id}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch preference: ${response.status}`);
  }
  
  return response.json();
}

async function getRoutes(preferenceId: string): Promise<Route[]> {
  // Server-side API call to the backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  const response = await fetch(`${API_URL}/routes?preferenceId=${preferenceId}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch routes: ${response.status}`);
  }
  
  return response.json();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

interface RoutesListProps {
  preferenceId: string;
}

export default async function RoutesList({ preferenceId }: RoutesListProps) {
  // Fetch preference and routes in parallel
  const [preference, routes] = await Promise.all([
    getPreference(preferenceId),
    getRoutes(preferenceId)
  ]);
  
  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <div className="bg-neutral-800 px-4 py-2 rounded-md">
          <span className="text-gray-400 text-sm">From:</span>
          <span className="ml-2 text-white">{preference.departureCity}</span>
        </div>
        <div className="bg-neutral-800 px-4 py-2 rounded-md">
          <span className="text-gray-400 text-sm">Dates:</span>
          <span className="ml-2 text-white">{formatDate(preference.periodFrom)} - {formatDate(preference.periodTo)}</span>
        </div>
        <div className="bg-neutral-800 px-4 py-2 rounded-md">
          <span className="text-gray-400 text-sm">Budget:</span>
          <span className="ml-2 text-white">€{preference.budget}</span>
        </div>
      </div>

      {routes.length > 0 ? (
        <div className="space-y-6">
          {routes.map((route) => (
            <div key={route.id} className="bg-neutral-900 rounded-lg overflow-hidden gradient-border p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center">
                    <span className="text-xl font-medium text-white">{route.departureAirport}</span>
                    <svg className="mx-3 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xl font-medium text-white">{route.arrivalAirport}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    {formatDate(route.departureDate)} • {formatTime(route.departureDate)} - {formatTime(route.arrivalDate)}
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="text-purple-400">{route.airline}</span>
                    <span className="mx-2 text-gray-600">•</span>
                    <span className="text-gray-400">{formatDuration(route.duration)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-white">€{route.price}</div>
                  <BookNowButton />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-900 rounded-lg gradient-border">
          <div className="text-purple-400 text-4xl mb-4">🔍</div>
          <p className="text-gray-300 text-lg mb-6">
            No routes found matching your criteria. Try adjusting your search parameters.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 glow"
          >
            New Search
          </a>
        </div>
      )}
    </div>
  );
} 