# Real-Time Sales Analytics Dashboard

A comprehensive real-time sales analytics dashboard built with Next.js, Express.js, MongoDB, and Socket.IO.

## 🚀 Quick Start

### Environment Variables

The application uses these environment variables. **Note: For local development, these are optional as the application uses sensible defaults.**

#### Backend Environment Variables
```bash
# Server Configuration
PORT=5001                    # Server port (default: 5001)
NODE_ENV=development         # Environment (development/production)

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sales-analytics  # MongoDB connection string

```

#### Frontend Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001  # Backend API URL (default: http://localhost:5001)
```

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd real-time

# Or manually with Docker Compose
docker-compose up -d
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- MongoDB: localhost:27017

### Local Development

```bash
# Backend
cd back
npm install
npm run dev

# Frontend (in another terminal)
cd front
npm install
npm run dev
```

## 🧪 Testing

### Backend Tests

```bash
cd back

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Frontend Tests

```bash
cd front

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Coverage

The project includes comprehensive test coverage for:

**Backend:**
- Domain Services (TransactionService)
- Application Use Cases (CreateTransactionUseCase, GetTransactionsUseCase, GetAnalyticsUseCase)
- Presentation Controllers (TransactionController)
- Infrastructure Repositories (TransactionRepository)

**Frontend:**
- React Components (Button, Input, Card, etc.)
- Custom Hooks (useSocket, useDebounce)
- Context Providers (TransactionContext, AnalyticsContext)
- API Client (api.ts)
- Utility Functions (format.ts)

## 🏗️ Architecture

### Frontend (Atomic Design)
- **Atoms**: Basic UI components (Button, Input, Card, Select, LoadingSpinner)
- **Molecules**: Composite components (SearchBar, AnalyticsCard, TransactionForm)
- **Organisms**: Complex components (AnalyticsCards, TransactionsTable, DashboardHeader)
- **Templates**: Page layouts (DashboardTemplate, AddTransactionTemplate)
- **Pages**: Route components with business logic

### Backend (Domain-Driven Design)
- **Domain Layer**: Entities, repositories interfaces, domain services
- **Application Layer**: Use cases, application services
- **Infrastructure Layer**: Database models, repositories implementations, external services
- **Presentation Layer**: Controllers, routes, middleware

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Real-time**: Socket.IO Client
- **Testing**: Jest, React Testing Library

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Architecture**: Domain-Driven Design (DDD)
- **Testing**: Jest, Supertest

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB

## 📡 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction

### Analytics
- `GET /api/analytics` - Get analytics data

## 🔄 Real-Time Events

### Frontend → Backend
- `join-dashboard` - Join dashboard room for real-time updates
- `leave-dashboard` - Leave dashboard room

### Backend → Frontend
- `newTransaction` - New transaction created
- `analyticsUpdate` - Analytics data updated

## 🐳 Docker Commands

```bash
# Production
docker-compose up -d

# Development (with hot reload)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Rebuild images
docker-compose build --no-cache
```

## 🔍 Multi-Server WebSocket Management

For production scaling, the application supports multiple backend servers with shared WebSocket state:

### Architecture
- **Redis**: Message broker for Socket.IO scaling
- **Nginx**: Load balancer for API and WebSocket traffic
- **Multiple Backend Instances**: Horizontal scaling

## 📊 Features

- **Real-time Dashboard**: Live updates of transactions and analytics
- **Transaction Management**: Add new transactions with validation
- **Search Functionality**: Filter transactions by customer name
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations
- **Debounced Search**: Performance-optimized search with 100ms debounce

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Domain services, use cases, controllers
- **Integration Tests**: API endpoints with mocked dependencies
- **Repository Tests**: Database operations with test database

### Frontend Testing
- **Component Tests**: UI components with React Testing Library
- **Hook Tests**: Custom hooks with renderHook
- **Context Tests**: State management with mocked providers
- **API Tests**: API client with mocked fetch

### Test Coverage Goals
- **Backend**: >80% coverage for domain and application layers
- **Frontend**: >70% coverage for components and hooks
- **Critical Paths**: 100% coverage for transaction creation and real-time updates

## 🚨 Troubleshooting

### Port Conflicts
If ports are already in use:
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5001
lsof -i :27017

# Kill processes if needed
kill -9 <PID>
```

### Docker Issues
```bash
# Clean up Docker resources
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Test Issues
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose
```

## Limitations
- No pagination for large transaction lists
- No offline support

## 🎯 Review Focus Points

1. **Architecture Decisions**: DDD implementation and Atomic Design
2. **Real-time Implementation**: Socket.IO with proper error handling
3. **State Management**: React Context with proper separation of concerns
4. **Error Handling**: Comprehensive error boundaries and user feedback
5. **Testing Strategy**: Unit and integration test coverage
6. **Performance**: Debounced search and optimized re-renders
7. **Scalability**: Multi-server WebSocket support
8. **Code Quality**: TypeScript usage and clean code principles
