'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditPreferenceButtonProps {
  preference: {
    id: string;
    departureCity: string;
    periodFrom: string;
    periodTo: string;
    budget: number;
  };
}

export function EditPreferenceButton({ preference }: EditPreferenceButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(preference);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsEditing(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${API_URL}/travel-preferences/${preference.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update preference');
      }

      // Close modal and refresh the page
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating preference:', error);
      alert('Failed to update preference. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsEditing(true)}
        className="text-blue-400 hover:text-blue-300 transition-colors"
        title="Edit preference"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
          />
        </svg>
      </button>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-lg p-6 max-w-md w-full gradient-border">
            <h3 className="text-xl font-bold text-white mb-4">Edit Travel Preference</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="departureCity" className="block text-sm font-medium text-gray-300">
                  Departure City
                </label>
                <input
                  type="text"
                  id="departureCity"
                  value={formData.departureCity}
                  onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                  className="mt-1 block w-full rounded-md bg-neutral-800 border-transparent focus:border-purple-500 focus:bg-neutral-700 focus:ring-0 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="periodFrom" className="block text-sm font-medium text-gray-300">
                  Period From
                </label>
                <input
                  type="date"
                  id="periodFrom"
                  value={formData.periodFrom.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, periodFrom: e.target.value })}
                  className="mt-1 block w-full rounded-md bg-neutral-800 border-transparent focus:border-purple-500 focus:bg-neutral-700 focus:ring-0 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="periodTo" className="block text-sm font-medium text-gray-300">
                  Period To
                </label>
                <input
                  type="date"
                  id="periodTo"
                  value={formData.periodTo.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, periodTo: e.target.value })}
                  className="mt-1 block w-full rounded-md bg-neutral-800 border-transparent focus:border-purple-500 focus:bg-neutral-700 focus:ring-0 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300">
                  Budget (€)
                </label>
                <input
                  type="number"
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md bg-neutral-800 border-transparent focus:border-purple-500 focus:bg-neutral-700 focus:ring-0 text-white"
                  min="0"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-md text-gray-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 