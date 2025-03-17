'use client';

import { useState } from 'react';

export function BookNowButton() {
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async () => {
    try {
      setIsBooking(true);
      
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Booking successful! This is a demo feature.');
    } catch (error) {
      console.error('Error during booking:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <button
      onClick={handleBooking}
      disabled={isBooking}
      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isBooking ? 'Processing...' : 'Book Now'}
    </button>
  );
} 