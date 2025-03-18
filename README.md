# Travel Advisor

A modern web application that helps users find and manage travel preferences and search for compatible flight routes.

## Features

- **Search for Travel Routes**: Create new travel preferences by specifying departure city, travel dates, and budget.
- **Manage Travel Preferences**: 
  - View all saved travel preferences
  - Edit existing preferences through an intuitive modal interface
  - Delete preferences you no longer need
  - Search for routes based on saved preferences
- **Route Discovery**: 
  - View available routes matching your preferences
  - See detailed flight information including prices, durations, and airlines
  - Book flights (demo functionality)
- **Modern UI**: 
  - Dark theme with beautiful gradients
  - Responsive design that works on all devices
  - Loading states and smooth transitions
  - User-friendly error handling

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Server and Client Components for optimal performance

### Backend
- Node.js with Express
- TypeScript
- Clean Architecture principles
- Integration with external flight APIs

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/travel-advisor.git
cd travel-advisor
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Backend (.env)
PORT=3000
```

4. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

5. Open your browser and navigate to:
- Frontend: http://localhost:80
- Backend API: http://localhost:3000/api

## API Endpoints

### Travel Preferences
- `GET /api/travel-preferences` - Get all travel preferences
- `GET /api/travel-preferences/:id` - Get a specific travel preference
- `POST /api/travel-preferences` - Create a new travel preference
- `PUT /api/travel-preferences/:id` - Update an existing travel preference
- `DELETE /api/travel-preferences/:id` - Delete a travel preference

### Routes
- `GET /api/routes?preferenceId=:id` - Get compatible routes for a preference

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 