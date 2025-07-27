# Real-Time Sales Analytics Dashboard

A modern, real-time sales analytics dashboard built with Next.js, Express.js, MongoDB, and Socket.IO. This application provides real-time transaction monitoring with instant updates and comprehensive analytics.

## Features

- **Real-Time Updates**: Live transaction updates using Socket.IO
- **Interactive Dashboard**: Beautiful, responsive UI with Tailwind CSS
- **Transaction Management**: Add new transactions with customer details
- **Search Functionality**: Filter transactions by customer name
- **Analytics**: Real-time revenue tracking and transaction statistics
- **Modern Architecture**: Clean separation of concerns with maintainable code

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time updates

### Backend
- **Express.js** for API server
- **TypeScript** for type safety and better development experience
- **Domain-Driven Design (DDD)** architecture with clean layer separation
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **CORS** enabled for cross-origin requests
- **Dependency Injection** for better testability and maintainability

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Setup Instructions

### Option 1: Docker (Recommended)

#### Quick Start with Docker Compose
```bash
# Clone the repository
git clone <repository-url>
cd real-time


# for development with hot reloading
docker-compose -f docker-compose.dev.yml up -d
```

#### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- MongoDB: localhost:27017

#### Docker Commands
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Development mode with hot reloading
docker-compose -f docker-compose.dev.yml up -d
```

### Option 2: Local Development

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd real-time
```

#### 2. Backend Setup
```bash
cd back
npm install
```

Create a `.env` file in the `back` directory:
```env
MONGODB_URI=mongodb://localhost:27017/sales-analytics
PORT=5001
```

Start the backend server:
```bash
npm run dev
```

#### 3. Frontend Setup
```bash
cd ../front
npm install
```

Start the frontend development server:
```bash
npm run dev
```

#### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Project Structure

```
real-time/
├── front/                 # Next.js frontend (Atomic Design)
│   ├── src/
│   │   ├── components/   # Atomic Design components
│   │   │   ├── atoms/    # Basic building blocks
│   │   │   ├── molecules/# Simple combinations
│   │   │   ├── organisms/# Complex UI sections
│   │   │   └── templates/# Page layouts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── types/        # TypeScript interfaces
│   │   └── app/          # Next.js App Router
│   └── package.json
├── back/                  # Express.js backend (DDD Architecture)
│   ├── src/
│   │   ├── domain/       # Business logic and entities
│   │   │   ├── entities/ # Domain entities
│   │   │   ├── repositories/ # Repository interfaces
│   │   │   └── services/ # Domain services
│   │   ├── infrastructure/ # External concerns
│   │   │   ├── database/ # Database models and repositories
│   │   │   └── websocket/ # Socket.IO implementation
│   │   ├── application/  # Use cases and application logic
│   │   │   └── useCases/ # Application use cases
│   │   ├── presentation/ # HTTP layer
│   │   │   ├── controllers/ # Request handlers
│   │   │   ├── routes/   # Route definitions
│   │   │   ├── dto/      # Data Transfer Objects
│   │   │   └── middleware/ # Express middleware
│   │   ├── config/       # Configuration and DI container
│   │   ├── utils/        # Utility functions
│   │   └── app.ts        # Application entry point
│   ├── dist/             # Compiled TypeScript
│   └── package.json
└── README.md
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions (with optional customer name filter)
- `POST /api/transactions` - Create a new transaction

### Analytics
- `GET /api/analytics` - Get current analytics (total revenue)

## Real-Time Events

### Socket.IO Events
- `newTransaction` - Emitted when a new transaction is created
- `analyticsUpdate` - Emitted when analytics are updated

## Technical Approach & Key Decisions

### Architecture Decisions
1. **Domain-Driven Design (DDD)**: Clean architecture with clear layer separation (Domain, Infrastructure, Application, Presentation)
2. **Atomic Design**: Frontend components organized by complexity (Atoms, Molecules, Organisms, Templates)
3. **Separation of Concerns**: Clear separation between frontend and backend with well-defined APIs
4. **Real-Time Communication**: Socket.IO for instant updates without polling
5. **Type Safety**: TypeScript throughout the stack for better development experience
6. **Modern UI**: Tailwind CSS for rapid, consistent styling
7. **Dependency Injection**: Container pattern for better testability and maintainability

### Key Design Patterns
1. **Domain-Driven Design**: Clean architecture with bounded contexts and domain entities
2. **Repository Pattern**: Abstract data access layer for better testability
3. **Use Case Pattern**: Application logic organized in use cases
4. **Component-Based Architecture**: Reusable React components with clear responsibilities
5. **Event-Driven Updates**: Real-time updates through Socket.IO events
6. **RESTful API Design**: Clean, predictable API endpoints
7. **Error Handling**: Comprehensive error handling on both frontend and backend
8. **Dependency Injection**: Container pattern for loose coupling

### Performance Considerations
1. **Efficient Queries**: MongoDB aggregation for analytics calculations
2. **Real-Time Updates**: Socket.IO for instant UI updates
3. **Responsive Design**: Mobile-first approach with Tailwind CSS
4. **Optimistic Updates**: Immediate UI feedback for better UX

## Assumptions & Limitations

### Assumptions
- MongoDB is running locally or accessible via connection string
- Users have basic understanding of Node.js and React
- Development environment supports modern JavaScript features

### Limitations
- No authentication/authorization implemented
- No data persistence beyond MongoDB
- Limited to single currency analytics (though multi-currency support is prepared)
- No pagination for large transaction lists
- No data export functionality

## Future Enhancements

1. **Authentication**: User login and role-based access
2. **Advanced Analytics**: Charts, graphs, and trend analysis
3. **Data Export**: CSV/PDF export functionality
4. **Pagination**: Handle large datasets efficiently
5. **Multi-Currency Analytics**: Proper currency conversion and analysis
6. **Real-Time Charts**: Live updating charts and graphs
7. **Notification System**: Email/SMS alerts for high-value transactions

## Points for Review Focus

1. **Code Quality**: Clean, readable, and maintainable code structure
2. **Real-Time Implementation**: Efficient Socket.IO usage and event handling
3. **Error Handling**: Comprehensive error handling and user feedback
4. **UI/UX**: Modern, responsive design with good user experience
5. **API Design**: RESTful endpoints with proper HTTP status codes
6. **Database Design**: Efficient MongoDB schema and queries
7. **Performance**: Fast loading times and smooth real-time updates

## Development Commands

### Docker (Recommended)
```bash
# Production
docker-compose up -d

# Development with hot reloading
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down
```

### Local Development

#### Backend
```bash
cd back
npm run dev    # Start development server with ts-node
npm run build  # Build TypeScript to JavaScript
npm start      # Start production server
```

#### Frontend
```bash
cd front
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
```

## Troubleshooting

1. **MongoDB Connection Issues**: Ensure MongoDB is running and connection string is correct
2. **Socket.IO Connection**: Check that backend is running on port 5001
3. **CORS Errors**: Verify CORS configuration in backend server
4. **Port Conflicts**: Ensure ports 3000 and 5001 are available

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 