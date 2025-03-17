interface TravelPreference {
  id: string;
  departureCity: string;
  periodFrom: string;
  periodTo: string;
  budget: number;
  lastSearched?: string;
}

// Mock data for demonstration
const mockPreferences: TravelPreference[] = [
  {
    id: '1',
    departureCity: 'Milan',
    periodFrom: '2024-04-01',
    periodTo: '2024-04-15',
    budget: 500,
    lastSearched: '2024-03-17T10:30:00Z'
  },
  {
    id: '2',
    departureCity: 'Rome',
    periodFrom: '2024-05-10',
    periodTo: '2024-05-20',
    budget: 800,
    lastSearched: '2024-03-16T14:45:00Z'
  }
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class PreferencesService {
  static async getAll(): Promise<TravelPreference[]> {

    try {

      const response = await fetch(`${API_BASE_URL}/travel-preferences`);
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
      return response.json();
      
      return [...mockPreferences];
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<TravelPreference> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Uncomment this when the backend API is ready
      // const response = await fetch(`${API_BASE_URL}/travel-preferences/${id}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch preference');
      // }
      // return response.json();
      
      const preference = mockPreferences.find(p => p.id === id);
      if (!preference) {
        throw new Error('Preference not found');
      }
      return { ...preference };
    } catch (error) {
      console.error('Error fetching preference:', error);
      throw error;
    }
  }

  static async create(preference: Omit<TravelPreference, 'id'>): Promise<TravelPreference> {
    try {
   
      const response = await fetch(`${API_BASE_URL}/travel-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference),
      });
      if (!response.ok) {
        throw new Error('Failed to create preference');
      }
      return response.json();
      
      // Create a new mock preference with a random ID
      const newPreference: TravelPreference = {
        ...preference,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      // Add to mock data (in a real app, this would be handled by the backend)
      mockPreferences.push(newPreference);
      
      return { ...newPreference };
    } catch (error) {
      console.error('Error creating preference:', error);
      throw error;
    }
  }

  static async update(id: string, preference: Partial<TravelPreference>): Promise<TravelPreference> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const response = await fetch(`${API_BASE_URL}/travel-preferences/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference),
      });
      if (!response.ok) {
        throw new Error('Failed to update preference');
      }
      return response.json();
      

      const index = mockPreferences.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Preference not found');
      }
      
      mockPreferences[index] = {
        ...mockPreferences[index],
        ...preference
      };
      
      return { ...mockPreferences[index] };
    } catch (error) {
      console.error('Error updating preference:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch(`${API_BASE_URL}/travel-preferences/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete preference');
      }
      
      // Remove from mock data (in a real app, this would be handled by the backend)
      const index = mockPreferences.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Preference not found');
      }
      
      mockPreferences.splice(index, 1);
    } catch (error) {
      console.error('Error deleting preference:', error);
      throw error;
    }
  }
} 