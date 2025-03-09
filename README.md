# Travel Advisor

A modern travel advisory application that helps users plan their trips.

## Backend

The backend is built with Node.js, Express, and TypeScript, following clean architecture principles.

### Prerequisites

- Node.js (v18.x)
- npm

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### API Endpoints

- `GET /ping` - Health check endpoint

### Testing

The project uses Jest and Supertest for testing. Run the tests with:

```bash
npm test
```

### CI/CD

The project uses GitHub Actions for continuous integration. On every push and pull request to the main branch, it:
- Installs dependencies
- Runs tests
- Checks linting
- Builds the project

## License

ISC 