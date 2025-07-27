# Frontend Architecture

## 🏗️ Architecture Overview

The frontend follows **Atomic Design** principles and uses **React Context** for state management, providing a scalable and maintainable structure.

## 📁 Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Dashboard page
│   └── add-transaction/   # Add transaction page
├── components/            # Atomic Design components
│   ├── atoms/            # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Select.tsx
│   │   └── LoadingSpinner.tsx
│   ├── molecules/        # Composite components
│   │   ├── SearchBar.tsx
│   │   ├── AnalyticsCard.tsx
│   │   └── TransactionForm.tsx
│   ├── organisms/        # Complex components
│   │   ├── AnalyticsCards.tsx
│   │   ├── TransactionsTable.tsx
│   │   └── DashboardHeader.tsx
│   └── templates/        # Page layouts
│       ├── DashboardTemplate.tsx
│       └── AddTransactionTemplate.tsx
├── context/              # React Context providers
│   ├── TransactionContext.tsx
│   └── AnalyticsContext.tsx
├── hooks/                # Custom React hooks
│   ├── useSocket.ts
│   ├── useDebounce.ts
│   ├── useTransactions.ts
│   └── useAnalytics.ts
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── format.ts        # Formatting utilities
└── types/               # TypeScript type definitions
    ├── transaction.ts
    ├── analytics.ts
    └── transactionContext.ts
```

## 🧩 Atomic Design Implementation

### Atoms
- **Button**: Reusable button component with variants
- **Input**: Form input with validation states
- **Card**: Container component for content
- **Select**: Dropdown selection component
- **LoadingSpinner**: Loading indicator

### Molecules
- **SearchBar**: Search input with debounced functionality
- **AnalyticsCard**: Individual analytics metric display
- **TransactionForm**: Form for creating transactions

### Organisms
- **AnalyticsCards**: Collection of analytics metrics
- **TransactionsTable**: Data table with search and pagination
- **DashboardHeader**: Page header with navigation

### Templates
- **DashboardTemplate**: Main dashboard layout
- **AddTransactionTemplate**: Transaction creation layout

## 🔄 State Management

### React Context Architecture
- **TransactionContext**: Manages transaction state and operations
- **AnalyticsContext**: Manages analytics state and real-time updates

### Context Features
- Centralized state management
- Real-time updates via WebSocket
- Optimistic updates for better UX
- Error handling and loading states

## 🔌 Custom Hooks

### useSocket
- Manages WebSocket connection
- Handles real-time event listeners
- Automatic reconnection logic

### useDebounce
- Generic debounce hook for performance
- Used in search functionality
- Configurable delay timing

### useTransactions
- Transaction data fetching
- CRUD operations
- Search and filtering

### useAnalytics
- Analytics data fetching
- Real-time updates
- Currency conversion display

## 🌐 API Integration

### API Client (lib/api.ts)
- Centralized API calls
- Error handling
- Type-safe responses
- Environment-based configuration

### WebSocket Integration
- Real-time transaction updates
- Analytics live updates
- Connection state management

## 🎨 Styling Architecture

### Tailwind CSS
- Utility-first CSS framework
- Responsive design
- Dark mode support (prepared)
- Custom component variants

### Design System
- Consistent spacing and typography
- Color palette and theming
- Component variants and states

## 🔧 Development Features

### TypeScript
- Full type safety
- Interface definitions
- Generic components
- Type guards and utilities

### Testing Strategy
- Component testing with React Testing Library
- Hook testing with renderHook
- Context testing with providers
- API mocking and integration tests

### Performance Optimizations
- Debounced search (500ms)
- Memoized components
- Optimized re-renders
- Code splitting with Next.js

## 🚀 Build & Deployment

### Next.js 15 Features
- App Router for file-based routing
- Server-side rendering capabilities
- Static site generation
- API routes (if needed)

### Development Workflow
- Hot reloading
- Type checking
- ESLint integration
- Prettier formatting 