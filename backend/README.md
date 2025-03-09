# Travel Advisor Backend

[![CI](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

Backend service for the Travel Advisor application, built with Node.js, Express, and MongoDB following a hexagonal architecture pattern.

## Prerequisites

- Node.js (v18.x or v20.x)
- MongoDB
- npm

## Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/travel-advisor.git
cd travel-advisor/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/travel-advisor
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically

## Testing

The project uses Jest for testing and follows a comprehensive testing strategy:

### Unit Tests
- Domain Layer: Entity validation and business rules
- Application Layer: Use case logic and repository interactions
- Interface Layer: Controller request/response handling

## Continuous Integration

The project uses GitHub Actions for continuous integration:

- Runs on Node.js v18.x and v20.x
- Automatically runs on push to main and pull requests
- Performs the following checks:
  - Dependency installation
  - Linting
  - Test execution

## API Endpoints

### Travel Preferences

- `POST /api/travel-preferences` - Create a new travel preference
- `GET /api/travel-preferences` - Get all travel preferences
- `GET /api/travel-preferences/:id` - Get a specific travel preference
- `PUT /api/travel-preferences/:id` - Update a travel preference
- `DELETE /api/travel-preferences/:id` - Delete a travel preference

## Project Structure

```
src/
├── domain/              # Domain layer
│   ├── entities/        # Business entities
│   └── repositories/    # Repository interfaces
├── application/         # Application layer
│   └── use-cases/      # Business logic
├── infrastructure/      # Infrastructure layer
│   └── repositories/    # Repository implementations
└── interfaces/         # Interface layer
    ├── controllers/    # HTTP controllers
    └── routes/         # Express routes
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## License

ISC 