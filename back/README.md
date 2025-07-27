# Backend Architecture

## 🏗️ Architecture Overview

The backend follows **Domain-Driven Design (DDD)** principles with a clean layered architecture, providing separation of concerns and maintainability.

## 📁 Directory Structure

```
src/
├── app.ts                 # Application entry point
├── domain/               # Domain Layer (Business Logic)
│   ├── entities/         # Domain entities
│   │   ├── Transaction.ts
│   │   ├── Analytics.ts
│   │   └── index.ts
│   ├── repositories/     # Repository interfaces
│   │   └── ITransactionRepository.ts
│   └── services/         # Domain services
│       ├── TransactionService.ts
│       ├── CurrencyConversionService.ts
│       ├── ISocketManager.ts
│       └── __tests__/
├── application/          # Application Layer (Use Cases)
│   └── useCases/
│       ├── CreateTransactionUseCase.ts
│       ├── GetTransactionsUseCase.ts
│       ├── GetAnalyticsUseCase.ts
│       └── __tests__/
├── infrastructure/       # Infrastructure Layer (External Concerns)
│   ├── database/         # Database implementations
│   │   ├── models/
│   │   │   └── TransactionModel.ts
│   │   └── repositories/
│   │       └── TransactionRepository.ts
│   └── websocket/        # WebSocket implementation
│       └── SocketManager.ts
├── presentation/         # Presentation Layer (API Controllers)
│   ├── controllers/
│   │   ├── TransactionController.ts
│   │   └── __tests__/
│   ├── routes/
│   │   └── transactionRoutes.ts
│   └── middleware/
│       └── errorHandler.ts
├── config/              # Configuration
│   ├── database.ts
│   └── container.ts
└── __tests__/           # Test setup
    └── setup.ts
```

## 🏛️ Domain-Driven Design Layers

### Domain Layer
**Core business logic and rules**

#### Entities
- **Transaction**: Core business entity with validation
- **Analytics**: Aggregated business metrics
- **CreateTransactionData**: Data transfer object for creation

#### Repository Interfaces
- **ITransactionRepository**: Abstract data access contract
- Defines methods for CRUD operations
- Supports analytics aggregation
- Currency-based statistics

#### Domain Services
- **TransactionService**: Core business operations
- **CurrencyConversionService**: Currency conversion logic
- **ISocketManager**: Real-time communication contract

### Application Layer
**Use cases and application services**

#### Use Cases
- **CreateTransactionUseCase**: Transaction creation workflow
- **GetTransactionsUseCase**: Transaction retrieval workflow
- **GetAnalyticsUseCase**: Analytics calculation workflow

#### Features
- Orchestrates domain services
- Handles application-specific logic
- Manages transaction boundaries
- Error handling and validation

### Infrastructure Layer
**External concerns and implementations**

#### Database
- **TransactionModel**: Mongoose schema definition
- **TransactionRepository**: MongoDB implementation
- Connection management and error handling

#### WebSocket
- **SocketManager**: Socket.IO implementation
- Real-time event broadcasting
- Room management for scalability

### Presentation Layer
**API controllers and routes**

#### Controllers
- **TransactionController**: HTTP request handling
- Request/response transformation
- Error handling and validation

#### Routes
- RESTful API endpoints
- Middleware integration
- CORS configuration

## 🔧 Dependency Injection

### Container Pattern
- **Container**: Service locator for dependencies
- **setupDependencies**: Dependency registration
- **Loose coupling**: Interfaces over implementations

### Service Registration
```typescript
// Infrastructure
container.register('transactionRepository', transactionRepository);
container.register('socketManager', socketManager);

// Domain Services
container.register('currencyConversionService', currencyConversionService);
container.register('transactionService', transactionService);

// Application
container.register('createTransactionUseCase', createTransactionUseCase);
container.register('getTransactionsUseCase', getTransactionsUseCase);
container.register('getAnalyticsUseCase', getAnalyticsUseCase);

// Presentation
container.register('transactionController', transactionController);
```

## 💰 Currency Conversion System

### CurrencyConversionService
- **Pre-configured exchange rates**: USD, EUR, GBP, CAD, AUD, JPY, CHF, CNY, INR, BRL
- **convertToBaseCurrency**: Converts amounts to USD for aggregation
- **getExchangeRate**: Retrieves exchange rates between currencies
- **updateExchangeRates**: Dynamic rate updates

### Analytics Aggregation
- **Performance optimization**: MongoDB aggregation pipelines
- **Currency grouping**: Aggregate by currency first
- **Manual conversion**: Convert aggregated amounts to base currency
- **getAnalyticsByCurrency**: Database-level currency statistics

## 🔄 Real-Time Communication

### Socket.IO Architecture
- **Event-driven**: Real-time updates for transactions and analytics
- **Room management**: Dashboard-specific rooms
- **Scalability**: Prepared for multi-server deployment
- **Error handling**: Connection management and reconnection

### Events
- **newTransaction**: Broadcast new transaction to all clients
- **analyticsUpdate**: Broadcast updated analytics
- **join-dashboard**: Client joins dashboard room
- **leave-dashboard**: Client leaves dashboard room

## 🗄️ Database Design

### MongoDB Schema
```typescript
interface Transaction {
  _id: ObjectId;
  customerName: string;
  amount: number;
  currency: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes
- **customerName**: For search functionality
- **date**: For time-based queries
- **currency**: For currency aggregation
- **createdAt**: For sorting and pagination

### Aggregation Pipelines
- **Currency statistics**: Group by currency with sums
- **Customer analytics**: Unique customer counting
- **Performance metrics**: Transaction counting and averages

## 🧪 Testing Architecture

### Test Structure
- **Unit tests**: Domain services and use cases
- **Integration tests**: API endpoints with mocked dependencies
- **Repository tests**: Database operations
- **Service tests**: Business logic validation

### Test Coverage
- **Domain Layer**: >90% coverage
- **Application Layer**: >85% coverage
- **Infrastructure Layer**: >80% coverage
- **Presentation Layer**: >85% coverage

### Mocking Strategy
- **Repository mocks**: In-memory implementations
- **Socket mocks**: Event emitter simulations
- **Service mocks**: Stubbed business logic
- **Database mocks**: Test database connections

## 🔒 Error Handling

### Error Types
- **ValidationError**: Input validation failures
- **NotFoundError**: Resource not found
- **DatabaseError**: Database operation failures
- **ServiceError**: Business logic errors

### Error Middleware
- **Global error handler**: Centralized error processing
- **HTTP status mapping**: Appropriate status codes
- **Error logging**: Structured error information
- **Client-friendly messages**: Sanitized error responses

## 🚀 Performance Optimizations

### Database Optimizations
- **Aggregation pipelines**: Server-side data processing
- **Indexed queries**: Optimized search performance
- **Connection pooling**: Efficient database connections
- **Query optimization**: Minimal data transfer

### Caching Strategy
- **Analytics caching**: Pre-computed metrics
- **Connection reuse**: WebSocket connection pooling
- **Memory optimization**: Efficient data structures

### Scalability Features
- **Stateless design**: Horizontal scaling ready
- **Message queuing**: Prepared for Redis integration
- **Load balancing**: Multi-instance support
- **Database sharding**: Large dataset handling 