import { DeletePreferenceButton } from './DeletePreferenceButton';
import { EditPreferenceButton } from './EditPreferenceButton';
import AffordableFlightsButton from './AffordableFlightsButton';

interface TravelPreference {
  id: string;
  departureCity: string;
  periodFrom: string;
  periodTo: string;
  budget: number;
  lastSearched?: string;
}

async function getPreferences(): Promise<TravelPreference[]> {
  // Server-side API call to the backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  try {
    const response = await fetch(`${API_URL}/travel-preferences`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch preferences: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return [];
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function PreferencesList() {
  const preferences = await getPreferences();
  
  if (preferences.length === 0) {
    return (
      <div className="text-center py-16 bg-neutral-900 rounded-lg gradient-border">
        <div className="text-purple-400 text-4xl mb-4">🔍</div>
        <p className="text-gray-300 text-lg mb-6">
          No saved preferences yet. Try searching for routes to save your preferences.
        </p>
        <a 
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 glow"
        >
          Create New Search
        </a>
      </div>
    );
  }
  
  return (
    <div className="bg-neutral-900 rounded-lg overflow-hidden gradient-border">
      <ul className="divide-y divide-neutral-800">
        {preferences.map((preference) => (
          <li key={preference.id} className="px-6 py-5 hover:bg-neutral-800/50 transition duration-150">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-lg font-medium text-purple-400 truncate">
                    {preference.departureCity}
                  </p>
                  <p className="text-sm text-gray-400 bg-neutral-800 px-3 py-1 rounded-full">
                    €{preference.budget}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-300">
                    {formatDate(preference.periodFrom)} - {formatDate(preference.periodTo)}
                  </p>
                  {preference.lastSearched && (
                    <p className="mt-1 text-xs text-gray-500">
                      Last searched: {formatDate(preference.lastSearched)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <AffordableFlightsButton preferenceId={preference.id} />
                <EditPreferenceButton preference={preference} />
                <DeletePreferenceButton id={preference.id} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 