export interface TravelPreference {
  departureCity: string;
  periodFrom: string; // YYYY-MM-DD format
  periodTo: string; // YYYY-MM-DD format
  budget: number;
}

export interface TravelPreferenceResponse {
  success: boolean;
  data?: TravelPreference & { id: string };
  errors?: string[];
} 