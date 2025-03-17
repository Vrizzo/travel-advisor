'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PreferencesService } from '@/lib/services/preferences.service';

export default function Home() {
  const router = useRouter();
  const [departureCity, setDepartureCity] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!departureCity || !dateFrom || !dateTo || !budget) {
      setError('Please fill in all fields');
      return;
    }

    if (new Date(dateFrom) > new Date(dateTo)) {
      setError('From date must be before to date');
      return;
    }

    if (Number(budget) <= 0) {
      setError('Budget must be greater than zero');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Save the preference
      const newPreference = await PreferencesService.create({
        departureCity,
        periodFrom: dateFrom,
        periodTo: dateTo,
        budget: Number(budget)
      });

      // Redirect to routes page with the new preference ID
      router.push('/preferences');
    } catch (err) {
      console.error('Error saving preference:', err);
      setError('Failed to save preference. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-6">
              <span className="block">Find Your Perfect</span>
              <span className="block gradient-text">Travel Route</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover the best travel routes within your budget. Set your preferences and let us find the perfect destinations for you.
            </p>

            {/* Search Form */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="bg-neutral-900 gradient-border p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-md text-red-200 text-sm">
                    {error}
                  </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="departure" className="block text-sm font-medium text-gray-300">
                      Departure City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="departure"
                        id="departure"
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                        className="shadow-sm bg-neutral-800 border-neutral-700 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border rounded-md p-2 text-white"
                        placeholder="e.g., Milan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-300">
                        From Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="dateFrom"
                          id="dateFrom"
                          value={dateFrom}
                          onChange={(e) => {
                            setDateFrom(e.target.value);
                            // Calculate date 2 days after selected date
                            const fromDate = new Date(e.target.value);
                            const toDate = new Date(fromDate);
                            toDate.setDate(fromDate.getDate() + 2);
                            // Format the date to YYYY-MM-DD for the input
                            setDateTo(toDate.toISOString().split('T')[0]);
                          }}
                          className="shadow-sm bg-neutral-800 border-neutral-700 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border rounded-md p-2 text-white [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="dateTo" className="block text-sm font-medium text-gray-300">
                        To Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="dateTo"
                          id="dateTo"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="shadow-sm bg-neutral-800 border-neutral-700 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border rounded-md p-2 text-white [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-300">
                      Budget (€)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="budget"
                        id="budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="shadow-sm bg-neutral-800 border-neutral-700 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border rounded-md p-2 text-white"
                        placeholder="e.g., 500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : 'Create your travel preferences'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold gradient-text">Why Choose Travel Advisor</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Our intelligent algorithm finds the best routes based on your preferences and budget.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-neutral-900 p-6 rounded-lg gradient-border">
              <div className="text-purple-400 text-2xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-white">Smart Route Finding</h3>
              <p className="mt-2 text-gray-400">
                Our algorithm finds the best routes based on your preferences and budget.
              </p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-lg gradient-border">
              <div className="text-purple-400 text-2xl mb-4">💰</div>
              <h3 className="text-lg font-medium text-white">Budget Friendly</h3>
              <p className="mt-2 text-gray-400">
                Set your budget and we'll find routes that match your spending limit.
              </p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-lg gradient-border">
              <div className="text-purple-400 text-2xl mb-4">🗓️</div>
              <h3 className="text-lg font-medium text-white">Flexible Dates</h3>
              <p className="mt-2 text-gray-400">
                Choose your preferred travel dates and find the best options available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to start your journey?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Create your travel preferences now and discover amazing destinations within your budget.
          </p>
          <button 
            onClick={() => document.getElementById('departure')?.focus()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
