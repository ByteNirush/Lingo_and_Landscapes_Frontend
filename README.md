# Lingo and Landscapes Frontend

React + Vite frontend for the Lingo and Landscapes language learning and visa services platform.

## Features

- Modern React with Vite
- TailwindCSS for styling
- JWT Authentication with secure token storage
- Role-based access control (Admin/User)
- Responsive design with mobile support
- Real-time booking and scheduling
- Visa services request system
- Admin dashboard with analytics

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Lingo and Landscapes
VITE_APP_URL=http://localhost:5173
VITE_ENABLE_DEMO_MODE=false
VITE_ENABLE_VISA_SERVICES=true
```

## Running the Application

### Development mode
```bash
npm run dev
```

### Production build
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Run with json-server (demo mode - deprecated)
```bash
npm run server
npm run dev:full
```

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api/v1)
- `VITE_API_TIMEOUT`: API request timeout in milliseconds (default: 30000)
- `VITE_APP_NAME`: Application name
- `VITE_APP_URL`: Frontend URL
- `VITE_ENABLE_DEMO_MODE`: Enable demo mode with json-server (default: false)
- `VITE_ENABLE_VISA_SERVICES`: Enable visa services feature (default: true)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React Context providers (Auth)
├── pages/          # Page components
├── utils/          # Utility functions and API clients
├── assets/         # Static assets
└── api/            # Legacy API functions
```

## Pages

- **Home**: Landing page with features and testimonials
- **About**: About the platform
- **Gallery**: Photo gallery
- **Login/Signup**: Authentication pages
- **Dashboard**: User dashboard (for learners)
- **Slots**: Browse and book demo sessions
- **My Bookings**: View user's bookings
- **Visa Services**: Submit visa requests
- **My Visa Requests**: View user's visa requests
- **Profile**: User profile management
- **Admin Dashboard**: Admin analytics and management
- **Admin Slots**: Manage demo session slots
- **Admin Bookings**: Manage bookings
- **Admin Users**: Manage users
- **Admin Visa Requests**: Manage visa requests

## API Integration

The frontend uses a centralized API client (`src/utils/api.js`) with axios for HTTP requests. Authentication is handled via JWT tokens stored in localStorage.

### API Endpoints

All API calls are prefixed with `VITE_API_URL` and use the following structure:
- `/auth/signin` - User login
- `/auth/signup` - User registration
- `/auth/me` - Get current user profile
- `/requests` - Demo session requests
- `/slots` - Session slots
- `/bookings` - Bookings
- `/visa` - Visa requests
- `/users` - User management (admin only)

## Security Features

- JWT token authentication
- Protected routes with role-based access
- Secure token storage in localStorage
- Automatic token refresh on profile load
- API request timeout handling
- Security headers via Vite config

## Development Notes

- The app uses React Router for navigation
- State management via React Context
- Toast notifications with react-hot-toast
- Icons from lucide-react
- Font: Poppins via @fontsource/poppins

## Backend Integration

The frontend is designed to work with the Node.js/Express/MongoDB backend. Ensure the backend is running on the configured API URL before starting the frontend.
