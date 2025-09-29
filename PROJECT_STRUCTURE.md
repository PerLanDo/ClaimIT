# ClaimIT Project Structure

## 📁 Directory Overview

```
ClaimIT/
├── backend/                    # Node.js Backend
│   ├── config/                 # Configuration files
│   │   └── database.js         # Supabase configuration
│   ├── database/               # Database related files
│   │   └── schema.sql          # PostgreSQL schema with RLS
│   ├── middleware/             # Express middleware
│   │   └── auth.js             # Authentication middleware
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Authentication routes
│   │   ├── items.js            # Item management routes
│   │   ├── claims.js           # Claim process routes
│   │   ├── messages.js         # Messaging system routes
│   │   ├── admin.js            # Admin management routes
│   │   └── profile.js          # User profile routes
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   └── env.example             # Environment variables template
│
├── mobile/                     # React Native Frontend
│   ├── src/                    # Source code
│   │   ├── components/         # Reusable components
│   │   │   └── CustomDrawerContent.tsx
│   │   ├── context/            # React context providers
│   │   │   └── AuthContext.tsx # Authentication context
│   │   ├── screens/            # Screen components
│   │   │   ├── auth/           # Authentication screens
│   │   │   │   └── LoginScreen.tsx
│   │   │   ├── main/           # Main app screens
│   │   │   │   ├── DashboardScreen.tsx
│   │   │   │   ├── ItemDetailScreen.tsx
│   │   │   │   ├── ReportItemScreen.tsx
│   │   │   │   ├── ClaimProcessScreen.tsx
│   │   │   │   ├── MessagesScreen.tsx
│   │   │   │   └── ProfileScreen.tsx
│   │   │   └── admin/          # Admin screens
│   │   │       ├── AdminDashboardScreen.tsx
│   │   │       ├── AdminItemsScreen.tsx
│   │   │       ├── AdminClaimsScreen.tsx
│   │   │       └── AdminUsersScreen.tsx
│   │   ├── services/           # API services
│   │   │   └── api.ts          # Axios configuration and endpoints
│   │   └── theme/              # UI theme
│   │       └── theme.ts        # Material Design 3 theme
│   ├── assets/                 # Static assets
│   │   └── fonts/              # Font files
│   ├── App.tsx                 # Main app component
│   ├── app.json                # Expo configuration
│   ├── package.json            # Mobile dependencies
│   ├── babel.config.js         # Babel configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── metro.config.js         # Metro bundler configuration
│
├── README.md                   # Project documentation
├── PROJECT_STRUCTURE.md        # This file
├── setup.sh                    # Linux/Mac setup script
└── setup.bat                   # Windows setup script
```

## 🔧 Key Files and Their Purpose

### Backend Files

#### `server.js`
- Main Express server configuration
- Middleware setup (CORS, helmet, rate limiting)
- Route mounting and error handling
- Server startup and port configuration

#### `config/database.js`
- Supabase client configuration
- Service role and anonymous client setup
- Database connection management

#### `database/schema.sql`
- Complete PostgreSQL database schema
- Tables: users, items, claims, messages, notifications, categories
- Row Level Security (RLS) policies
- Indexes for performance optimization
- Triggers for automatic timestamp updates

#### `middleware/auth.js`
- JWT token validation
- Role-based access control
- User authentication middleware

#### Route Files
- **`auth.js`**: Login, registration, profile management
- **`items.js`**: CRUD operations for lost/found items
- **`claims.js`**: Claim submission and admin approval workflow
- **`messages.js`**: User-to-user and admin messaging
- **`admin.js`**: Admin dashboard and management functions
- **`profile.js`**: User profile and statistics

### Mobile Files

#### `App.tsx`
- Main application component
- Navigation setup (Stack, Tab, Drawer navigators)
- Theme provider configuration
- Authentication state management

#### `src/context/AuthContext.tsx`
- User authentication state management
- Login/logout functionality
- Token storage and API integration

#### `src/services/api.ts`
- Axios HTTP client configuration
- API endpoint definitions
- Request/response interceptors
- Error handling

#### `src/theme/theme.ts`
- Material Design 3 theme configuration
- Custom ClaimIT color scheme
- Typography and component styling

#### Screen Components
- **Authentication**: Login with role selection
- **Main App**: Dashboard, item details, reporting, claiming
- **Admin**: Dashboard, item management, claim review, user management
- **Profile**: User statistics and settings

## 🗄️ Database Schema

### Core Tables

#### `users`
- User profiles and authentication data
- Role-based access (student, staff, teacher, admin)
- Points system for gamification

#### `items`
- Lost and found items
- Image URLs, QR codes, status tracking
- Category and location information

#### `claims`
- Item claim requests
- Proof submission and admin review
- Status tracking (pending, approved, rejected)

#### `messages`
- User-to-user messaging
- Admin communication
- Context-aware conversations

#### `notifications`
- System notifications
- Real-time updates
- User engagement tracking

#### `categories`
- Item categorization
- Icon and description metadata

## 🔐 Security Features

### Authentication
- University email validation
- JWT token-based authentication
- Role-based access control

### Database Security
- Row Level Security (RLS) policies
- Service role and anonymous client separation
- Input validation and sanitization

### API Security
- Rate limiting
- CORS configuration
- Helmet security headers
- Request validation

## 📱 Mobile App Features

### Navigation
- Drawer navigation for main app
- Tab navigation for core features
- Admin-specific navigation
- Modal screens for forms

### UI Components
- Material Design 3 components
- Custom ClaimIT branding
- Responsive design
- Dark/light theme support

### Functionality
- Image upload and camera integration
- QR code generation and scanning
- Real-time messaging
- Push notifications
- Offline data caching

## 🚀 Deployment Architecture

### Backend Deployment
- Vercel serverless functions
- Supabase PostgreSQL database
- Backblaze B2 for image storage
- Environment variable configuration

### Mobile Deployment
- Expo Application Services (EAS)
- iOS App Store and Google Play Store
- Over-the-air updates
- Production builds with optimizations

## 🔄 Development Workflow

### Local Development
1. Backend: `cd backend && npm run dev`
2. Mobile: `cd mobile && npm start`
3. Database: Supabase local development
4. Testing: Jest for backend, Jest + React Native Testing Library for mobile

### Production Deployment
1. Backend: Automatic deployment via Vercel
2. Database: Supabase production instance
3. Mobile: EAS build and store submission
4. Monitoring: Error tracking and analytics

## 📊 Performance Considerations

### Backend Optimization
- Database indexing
- Query optimization
- Caching strategies
- Rate limiting

### Mobile Optimization
- Image compression
- Lazy loading
- Memory management
- Bundle size optimization

## 🔮 Future Enhancements

### Planned Features
- AI image recognition
- Geo-tagging integration
- Push notification system
- Offline support
- Campus ID integration

### Technical Improvements
- Real-time updates with WebSockets
- Advanced caching strategies
- Performance monitoring
- Automated testing pipeline
