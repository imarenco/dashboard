# Sales Analytics Dashboard - Frontend

A modern, componentized React application built with Next.js 15, TypeScript, and Tailwind CSS, following Atomic Design principles.

## 🏗️ Architecture Overview

This frontend follows **Atomic Design** methodology for component organization:

### 📁 Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard page
│   ├── add-transaction/   # Add transaction page
│   └── layout.tsx         # Root layout
├── components/            # Atomic Design components
│   ├── atoms/            # Basic building blocks
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Select.tsx
│   │   └── LoadingSpinner.tsx
│   ├── molecules/        # Simple combinations of atoms
│   │   ├── SearchBar.tsx
│   │   ├── AnalyticsCard.tsx
│   │   └── TransactionForm.tsx
│   ├── organisms/        # Complex UI components
│   │   ├── AnalyticsCards.tsx
│   │   ├── TransactionsTable.tsx
│   │   └── DashboardHeader.tsx
│   └── templates/        # Page layouts
│       ├── DashboardTemplate.tsx
│       └── AddTransactionTemplate.tsx
├── hooks/                # Custom React hooks
│   ├── useSocket.ts      # Socket.IO connection management
│   ├── useTransactions.ts # Transaction data management
│   └── useAnalytics.ts   # Analytics data management
├── lib/                  # Utility functions
│   ├── api.ts           # API client functions
│   └── format.ts        # Formatting utilities
└── types/               # TypeScript type definitions
    ├── transaction.ts
    └── analytics.ts
```

## 🎯 Component Hierarchy

### **Atoms** (Basic Building Blocks)
- **Button**: Reusable button with variants (primary, secondary, outline)
- **Input**: Form input with label, error handling, and icon support
- **Card**: Content container with consistent styling
- **Select**: Dropdown component with options
- **LoadingSpinner**: Animated loading indicator

### **Molecules** (Simple Combinations)
- **SearchBar**: Input with search icon and functionality
- **AnalyticsCard**: Card displaying analytics data with icon
- **TransactionForm**: Form for creating new transactions

### **Organisms** (Complex Components)
- **AnalyticsCards**: Grid of analytics cards
- **TransactionsTable**: Data table with sorting and filtering
- **DashboardHeader**: Page header with search and actions

### **Templates** (Page Layouts)
- **DashboardTemplate**: Complete dashboard layout
- **AddTransactionTemplate**: Add transaction page layout

## 🪝 Custom Hooks

### **useSocket**
Manages Socket.IO connections and real-time event handling:
```typescript
const { socket, onNewTransaction, onAnalyticsUpdate } = useSocket();
```

### **useTransactions**
Handles transaction data fetching, filtering, and real-time updates:
```typescript
const { transactions, filteredTransactions, searchTerm, setSearchTerm, loading } = useTransactions();
```

### **useAnalytics**
Manages analytics data and real-time updates:
```typescript
const { analytics } = useAnalytics();
```

## 🔧 Key Features

### **Real-Time Updates**
- Socket.IO integration for live transaction updates
- Automatic analytics refresh
- Optimistic UI updates

### **Component Reusability**
- Atomic Design ensures components are highly reusable
- Consistent styling with Tailwind CSS
- TypeScript for type safety

### **Performance Optimizations**
- Custom hooks for data management
- Efficient re-rendering with proper state management
- Lazy loading and code splitting

### **Developer Experience**
- Clean separation of concerns
- Type-safe API calls
- Consistent error handling
- Easy to test and maintain

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📝 Usage Examples

### Using Atoms
```tsx
import { Button, Input, Card } from '@/components';

<Button variant="primary" size="md">
  Click me
</Button>

<Input 
  label="Email" 
  placeholder="Enter email"
  error="Invalid email"
/>

<Card padding="md">
  Content here
</Card>
```

### Using Molecules
```tsx
import { SearchBar, AnalyticsCard } from '@/components';

<SearchBar 
  value={searchTerm} 
  onChange={setSearchTerm} 
/>

<AnalyticsCard
  title="Revenue"
  value="$10,000"
  icon={<RevenueIcon />}
  bgColor="bg-green-100"
  iconColor="text-green-600"
/>
```

### Using Hooks
```tsx
import { useTransactions, useAnalytics } from '@/hooks';

function MyComponent() {
  const { transactions, loading } = useTransactions();
  const { analytics } = useAnalytics();
  
  // Component logic
}
```

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Consistent Design System**: Predefined colors, spacing, and typography
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: CSS variables for theming

## 🔄 State Management

- **React Hooks**: useState, useEffect for local state
- **Custom Hooks**: Encapsulated business logic
- **Socket.IO**: Real-time state synchronization
- **API Integration**: Centralized data fetching

## 🧪 Testing Strategy

### Component Testing
- Unit tests for atoms and molecules
- Integration tests for organisms
- E2E tests for complete user flows

### Hook Testing
- Custom hook testing with React Testing Library
- Mock Socket.IO for real-time testing
- API mocking for data fetching tests

## 📈 Performance Considerations

- **Code Splitting**: Automatic with Next.js
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Bundle Analysis**: Regular bundle size monitoring

## 🔮 Future Enhancements

- **Storybook**: Component documentation and testing
- **Design System**: Comprehensive design tokens
- **Accessibility**: ARIA labels and keyboard navigation
- **Internationalization**: Multi-language support
- **PWA**: Progressive Web App features

## 🤝 Contributing

1. Follow Atomic Design principles
2. Write TypeScript for all new components
3. Add proper JSDoc comments
4. Include unit tests for new features
5. Update this README for significant changes

## 📚 Resources

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
