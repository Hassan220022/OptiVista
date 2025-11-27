# OptiVista Admin Dashboard

A modern, responsive admin dashboard for managing the OptiVista AR Eyewear e-commerce platform.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **UI Components**: Custom components inspired by shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Database**: Supabase (PostgreSQL)

## Features

### Dashboard
- Overview statistics (revenue, orders, products, users)
- Recent orders list
- Top-selling products
- Quick stats for pending items

### Products Management
- View all products with filters and search
- Product status indicators (active, inactive, draft)
- Stock level monitoring
- AR-enabled product badges
- CRUD operations for products

### Orders Management
- View all orders with status tracking
- Filter by status (pending, confirmed, processing, shipped, delivered, cancelled)
- Order details with item breakdown
- Status update functionality
- Payment status tracking

### Users Management
- View all registered users
- Filter by role (shoppers, admins)
- User activity tracking
- Order history per user

### Reviews Moderation
- View all product reviews
- Filter by approval status and rating
- Approve/reject pending reviews
- Verified purchase badges

### Feedback Management
- View customer feedback and support requests
- Filter by type (bug, feature, support, general)
- Status tracking (new, in progress, resolved, closed)

### Settings
- Store configuration
- Email settings
- Notification preferences
- Security settings
- Appearance customization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your Supabase credentials
```

### Development

```bash
# Start development server
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `VITE_API_BASE_URL` | FastAPI backend URL (optional) |

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Header, DashboardLayout)
│   └── ui/              # Reusable UI components (Button, Card, Table, etc.)
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Dashboard.tsx    # Main dashboard page
│   ├── Products.tsx     # Products management
│   ├── Orders.tsx       # Orders management
│   ├── Users.tsx        # Users management
│   ├── Reviews.tsx      # Reviews moderation
│   ├── Feedback.tsx     # Feedback management
│   └── Settings.tsx     # Settings page
├── types/
│   └── database.ts      # TypeScript types for Supabase
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Global styles with Tailwind
```

## API Integration

The admin dashboard connects to:

1. **Supabase** - Direct database access for real-time data
2. **FastAPI Backend** (optional) - For complex business logic and admin-specific endpoints

### Admin API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/admin/dashboard` | GET | Dashboard statistics |
| `/api/v1/admin/products` | GET/POST/PUT/DELETE | Product CRUD |
| `/api/v1/admin/orders` | GET | List all orders |
| `/api/v1/admin/orders/{id}/status` | PATCH | Update order status |
| `/api/v1/admin/users` | GET | List all users |
| `/api/v1/admin/reviews` | GET/PATCH | Review moderation |

## License

This project is part of the OptiVista AR Eyewear platform.
