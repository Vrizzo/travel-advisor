interface Flight {
  id: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airline: string;
  deepLink: string;
}

interface TravelPreference {
  id: string;
  departureCity: string;
  periodFrom: string;
  periodTo: string;
  budget: number;
}

async function getPreference(id: string): Promise<TravelPreference> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  const response = await fetch(`${API_URL}/travel-preferences/${id}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch preference: ${response.status}`);
  }
  
  return response.json();
}

async function getFlights(preferenceId: string): Promise<Flight[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  const response = await fetch(`${API_URL}/flights?preferenceId=${preferenceId}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch flights: ${response.status}`);
  }
  
  return response.json();
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

function formatDuration(departureDate: string, arrivalDate: string) {
  try {
    const departure = new Date(departureDate);
    const arrival = new Date(arrivalDate);
    const duration = arrival.getTime() - departure.getTime();
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 'N/A';
  }
}

interface FlightsListProps {
  preferenceId: string;
}

export default async function FlightsList({ preferenceId }: FlightsListProps) {
  // Fetch preference and flights in parallel
  const [preference, flights] = await Promise.all([
    getPreference(preferenceId),
    getFlights(preferenceId)
  ]);
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8">Affordable Flights</h2>
      
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

      {flights.length > 0 ? (
        <div className="space-y-6">
          {flights.map((flight) => (
            <div key={flight.id} className="bg-neutral-900 rounded-lg overflow-hidden gradient-border p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center">
                    <span className="text-xl font-medium text-white">{flight.departureAirport}</span>
                    <svg className="mx-3 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xl font-medium text-white">{flight.arrivalAirport}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                  {formatDate(flight.departureTime)} - {formatDate(flight.arrivalTime)}
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="text-purple-400">{flight.airline}</span>
                    <span className="mx-2 text-gray-600">•</span>
                    <span className="text-gray-400">{formatDuration(flight.departureTime, flight.arrivalTime)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-white">€{flight.price}</div>
                  <a
                    href={flight.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-900 rounded-lg gradient-border">
          <div className="text-purple-400 text-4xl mb-4">✈️</div>
          <p className="text-gray-300 text-lg mb-6">
            No affordable flights found for your criteria. Try adjusting your search parameters.
          </p>
          <a
            href="/preferences"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 glow"
          >
            Back to Preferences
          </a>
        </div>
      )}
    </div>
  );
} 