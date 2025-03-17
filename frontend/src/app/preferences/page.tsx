import { Suspense } from 'react';
import PreferencesList from './components/PreferencesList';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';

export default function PreferencesPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold text-white mb-2">Your Travel Preferences</h1>
      <p className="text-gray-400 mb-8">
        Manage your saved travel preferences and search for compatible routes.
      </p>
      
      <Suspense fallback={<LoadingSpinner message="Loading your preferences..." />}>
        <PreferencesList />
      </Suspense>
    </main>
  );
} 