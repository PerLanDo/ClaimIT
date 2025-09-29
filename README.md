# ClaimIT - Lost and Found Campus App

A comprehensive mobile application for reporting, searching, and claiming lost-and-found items on campus. Built with React Native frontend and Node.js backend, featuring role-based authentication and admin management.

## 🎯 Features

### Core Functionality
- **Authentication & Roles**: University email login with Student, Staff, Teacher, and Admin roles
- **Item Reporting**: Report lost/found items with photos, descriptions, and location details
- **Search & Filter**: Advanced search by name, description, location, category, and date
- **Main Dashboard**: Organized tabs for Lost, Found, and All items with floating action button
- **Item Details**: Comprehensive item information with QR codes and claim functionality
- **Claim Process**: Submit claims with proof, reviewed by Security Intelligence Division (SID)
- **Messaging System**: In-app chat between users and admins
- **User Profiles**: Personal statistics, points system, and profile management
- **Admin Dashboard**: Complete management interface for SID administrators

### Admin Features (SID)
- Approve/deny claims with admin notes
- Edit, archive, or delete items
- Manage user roles and permissions
- Analytics dashboard with statistics
- Category breakdown and user activity monitoring

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **React Hook Form** for form management
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **TypeScript** for server-side code
- **Supabase** for database and authentication
- **JWT** for token-based authentication
- **Multer** for file uploads
- **QRCode** for QR code generation

### Database
- **Supabase PostgreSQL** with Row Level Security (RLS)
- Comprehensive schema with users, items, claims, messages, and notifications

### Cloud Services
- **Backblaze B2** for image storage (configured but not implemented)
- **Vercel** for serverless deployment
- **Supabase Realtime** for live updates

## 📱 Screenshots

The app includes screens that match the provided mockups:
- Login screen with role selection
- Main dashboard with Lost/Found/All tabs
- Item detail page with claim and message buttons
- Report item form with image upload
- Claim process with proof submission
- Admin dashboard with statistics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account
- Backblaze B2 account (for image storage)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ClaimIT/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   B2_KEY_ID=your_backblaze_key_id
   B2_APPLICATION_KEY=your_backblaze_application_key
   B2_BUCKET_NAME=claimit-images
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql`
   - Enable Row Level Security policies

5. **Start the server**
   ```bash
   npm run dev
   ```

### Mobile App Setup

1. **Navigate to mobile directory**
   ```bash
   cd ../mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API configuration**
   Edit `src/services/api.ts` and update the `BASE_URL` for your backend.

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 📊 Database Schema

The database includes the following main tables:
- `users` - User profiles and authentication
- `items` - Lost/found items with metadata
- `claims` - Item claim requests and status
- `messages` - User-to-user and admin messaging
- `notifications` - System notifications
- `categories` - Item categorization

## 🔐 Authentication

The app uses university email validation with the following domains:
- `.edu` - Standard educational institutions
- `.ac.` - Academic institutions
- `university.` - University domains
- `college.` - College domains

## 🎨 UI/UX Features

- **Material Design 3** with custom ClaimIT branding
- **Dark red/maroon** primary color scheme matching mockups
- **Responsive design** for various screen sizes
- **Intuitive navigation** with drawer and tab navigation
- **Real-time updates** for messages and notifications
- **QR code generation** for item verification
- **Image upload** with camera and gallery support

## 📈 Admin Dashboard

The admin interface provides:
- **Statistics Overview**: Items, claims, and user metrics
- **Item Management**: View, edit, archive, or delete items
- **Claim Review**: Approve/reject claims with admin notes
- **User Management**: View users and modify roles
- **Category Analytics**: Breakdown of items by category
- **Recent Activity**: Latest items and user actions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile

### Items
- `GET /api/items` - List items with filters
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Claims
- `GET /api/claims` - List claims
- `POST /api/claims` - Submit claim
- `PUT /api/claims/:id/status` - Update claim status (admin)

### Messages
- `GET /api/messages/conversations` - List conversations
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/:id` - Get conversation messages

### Admin
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/items` - Admin item management
- `GET /api/admin/users` - User management
- `PUT /api/admin/users/:id/role` - Update user role

## 🚀 Deployment

### Backend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Mobile App Deployment
1. **Android**: Use Expo Application Services (EAS) or build locally
2. **iOS**: Use EAS or Xcode for App Store submission

```bash
# Build for production
eas build --platform android
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## 🔮 Future Enhancements

- **AI Image Recognition**: Automatic item matching using ML
- **Geo-tagging**: Location-based lost/found tracking
- **Reward Leaderboard**: Gamification with points and achievements
- **Campus ID Integration**: Direct integration with university systems
- **Push Notifications**: Real-time alerts for claims and messages
- **Offline Support**: Cached data for offline viewing

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🙏 Acknowledgments

- Design inspiration from the provided mockups
- Supabase for excellent backend-as-a-service
- React Native community for extensive documentation
- Expo team for the amazing development platform

---

**ClaimIT** - Making campus life easier, one found item at a time! 🎓📱
