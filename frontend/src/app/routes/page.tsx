import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import RoutesList from './components/RoutesList';
import { notFound } from 'next/navigation';

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    preferenceId?: string;
  };
}

export default function RoutesPage({ searchParams }: PageProps) {
  const { preferenceId } = searchParams;

  // If no preference ID is provided, show a 404 page
  if (!preferenceId) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold text-white mb-2">Available Routes</h1>
      <p className="text-gray-400 mb-8">
        Showing compatible routes based on your preferences.
      </p>
      
      <Suspense fallback={<LoadingSpinner message="Searching for routes..." />}>
        <RoutesList preferenceId={preferenceId} />
      </Suspense>
    </main>
  );
} 