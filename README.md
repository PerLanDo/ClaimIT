# ClaimIT - Lost & Found Management System

<div align="center">

![ClaimIT](https://img.shields.io/badge/ClaimIT-MSU--IIT-800000?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Prototype%20Complete-00FF00?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Ready-FFD700?style=for-the-badge)

**A Modern Progressive Web Application for Campus Lost & Found Management**

*Developed for Mindanao State University - Iligan Institute of Technology*

</div>

---

## 📱 About ClaimIT

ClaimIT is a comprehensive lost and found management system designed to modernize how the MSU-IIT campus community reports, searches, and recovers lost items. Built as a Progressive Web Application (PWA), it provides:

- 🔍 **Easy Item Reporting** - Report lost or found items with photos and details
- 🎯 **Smart Matching** - Advanced search and filtering to find your belongings
- 💬 **In-App Messaging** - Coordinate item recovery without revealing personal info
- ✅ **Claim System** - Verify ownership with proof-based claiming
- 🏢 **SID Integration** - Secure turnover of high-value items to campus security
- 📊 **Analytics** - Track recovery rates and system performance
- 🔔 **Real-time Notifications** - Stay updated on claims and matches

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 👤 Test Accounts

### Student
- Email: `juan.delacruz@g.msuiit.edu.ph`
- Email: `maria.santos@g.msuiit.edu.ph`

### Faculty
- Email: `prof.rodriguez@g.msuiit.edu.ph`

### SID Administrator
- Email: `admin.sid@msuiit.edu.ph` **(Admin Dashboard Access)**

*Note: This is a prototype - any email from the seed data will work for login.*

---

## 📊 Current Data (Seed)

The prototype comes pre-populated with:

- **10 Users** (6 students, 2 faculty, 1 staff, 1 admin)
- **27 Items** (7 lost, 20 found)
- **5 Claims** (various statuses)
- **7 Messages** (across 3 conversations)
- **10 Notifications** (all types)
- **3 Turnover Logs** (SID-managed items)

---

## ✨ Key Features

### For Students & Faculty

#### 🔍 Browse & Search Items
- Three-tab interface: **ALL** | **LOST** | **FOUND**
- Real-time search across titles and descriptions
- Advanced filtering by category, status, location, and date

#### 📝 Report Items
- Toggle between "I LOST something" and "I FOUND something"
- Upload up to 5 photos per item
- Auto-generated QR codes for verification
- Option to turn over high-value items to SID

#### 🎯 Claim Found Items
- Submit proof of ownership (minimum 50 characters)
- Attach supporting documents/images
- Track claim status in real-time
- Get notified when claims are reviewed

#### 💬 Secure Messaging
- Item-specific conversations
- Coordinate pickup without sharing personal contact info
- Read/unread message tracking

#### 🔔 Smart Notifications
- Claim status updates
- New message alerts
- Item match suggestions
- Turnover reminders

### For SID Administrators

#### 📊 Analytics Dashboard
- Recovery rate tracking
- Total items managed
- Pending claims overview
- Recent activity monitoring

#### 📦 Turnover Management
- Track high-value items received
- Log item conditions and details
- Manage item releases
- Generate reports

---

## 🎨 Design System

### Brand Colors (MSU-IIT)
- **Primary**: Maroon `#800000`
- **Secondary**: Gold `#FFD700`
- **Accent**: Dynamic gradients

### Responsive Design
- 📱 **Mobile-first** approach
- 💻 **Tablet-optimized** admin dashboard
- 🖥️ **Desktop-enhanced** layouts

### Theme Support
- ☀️ Light mode (default)
- 🌙 Dark mode
- Auto-detection of system preference

---

## 🏗️ Technical Stack

### Frontend
- ⚛️ **React 18** - UI framework
- 📘 **TypeScript** - Type safety
- 🎨 **Tailwind CSS** - Styling system
- 🔀 **Wouter** - Lightweight routing
- 📡 **React Query** - Data fetching
- 🎭 **Radix UI** - Accessible components
- 🎬 **Framer Motion** - Animations

### Backend
- 🟢 **Node.js + Express** - API server
- 💾 **In-Memory Storage** (Prototype)
- 🔐 **Session Management** - Auth handling
- 🌐 **WebSocket** - Real-time updates

### Future (Production)
- 🔥 Firebase - Authentication & Database
- ☁️ Cloud Storage - Image hosting
- 📧 Email Service - Notifications
- 🔍 Algolia - Advanced search

---

## 📁 Project Structure

```
ClaimIT_Replit/
├── client/src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts (Auth, Theme)
│   ├── lib/               # Utilities & API calls
│   └── hooks/             # Custom React hooks
├── server/
│   ├── routes.ts          # API routes
│   ├── storage.ts         # In-memory data storage
│   ├── seed.ts            # Database seeding
│   └── index.ts           # Server entry point
├── shared/
│   └── schema.ts          # Shared type definitions
├── SRS_Documentation/     # Complete IEEE SRS, UML/ERD Diagrams & Interview Transcripts
│   ├── Final Document/    # Full IEEE SRS (00 Final SRS.md & Sections 5-11)
│   ├── Diagram/           # Activity, Class, ERD, Sequence, Use Case & Context diagrams
│   ├── Interview Data/    # ICTC & SID stakeholder interview transcripts
│   └── App Information/   # App overview & Product Requirements Document (PRD)
└── attached_assets/        # Prototype design & requirements documents
```

---

## 🧪 Testing

See **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** for comprehensive testing instructions.

### Quick Test
1. Login with any test account
2. Navigate to Dashboard
3. Click LOST/FOUND/ALL tabs
4. Click an item to view details
5. Try submitting a claim
6. Check Messages and Notifications

---

## 📚 Documentation

- **[SRS_Documentation/Final Document/00 Final SRS.md](./SRS_Documentation/Final%20Document/00%20Final%20SRS.md)** - Complete IEEE Software Requirements Specification (SRS)
- **[SRS_Documentation/Diagram/](./SRS_Documentation/Diagram/)** - System Architecture, UML, ERD, Sequence, and Activity Diagrams
- **[SRS_Documentation/Interview Data/](./SRS_Documentation/Interview%20Data/)** - Stakeholder Interview Transcripts (SID & ICTC)
- **[COMPLETION_REPORT.md](./COMPLETION_REPORT.md)** - Detailed feature documentation
- **[IMPROVEMENTS_REPORT.md](./IMPROVEMENTS_REPORT.md)** - App analysis & improvements report
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Step-by-step testing scenarios
- **[design_guidelines.md](./design_guidelines.md)** - MSU-IIT UI/UX brand guidelines

---

## 🔐 Security Features

- ✅ Role-based access control (Student, Faculty, Staff, SID Admin)
- ✅ Proof-based claim verification
- ✅ In-app messaging (no personal info sharing)
- ✅ QR code verification for handovers
- ✅ Audit trail for all transactions
- ✅ Secure SID turnover for high-value items

---

## 📈 Statistics & Impact

### Current Prototype Metrics
- **Recovery Rate**: Calculated dynamically based on returned items
- **Response Time**: Real-time messaging and notifications
- **Coverage**: All item categories supported
- **Accessibility**: 24/7 availability via web browser

### Expected Production Impact
- Target recovery rate: **60%+** (up from 20-30% manual system)
- Average claim processing: **< 1 day**
- User satisfaction: **High** (modern, user-friendly interface)

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Build for production
npm start            # Run production build

# Type Checking
npm run check        # TypeScript type check

# Database
npm run db:push      # Push schema changes (for SQL migration)
```

---

## 🚧 Roadmap

### Phase 1: Prototype ✅ **COMPLETE**
- [x] Core UI components
- [x] Item reporting & browsing
- [x] Claims management
- [x] Messaging system
- [x] Notifications
- [x] Admin dashboard
- [x] Seed data population

### Phase 2: Production Backend 🔜
- [ ] Firebase authentication (My.IIT SSO)
- [ ] Firestore database integration
- [ ] Cloud storage for images
- [ ] Email notification system
- [ ] Push notifications (FCM)

### Phase 3: Advanced Features 🔮
- [ ] QR code scanner (camera access)
- [ ] AI-powered item matching
- [ ] Advanced analytics
- [ ] Mobile app wrapper
- [ ] Multi-language support
- [ ] Offline mode (Service Worker)

---

## 📄 License

This project is a prototype developed for MSU-IIT. All rights reserved.

---

## 👥 Contributors

**Development Team** (ISY108 Project)
- System Design & Implementation
- UI/UX Design following MSU-IIT brand guidelines
- Testing & Documentation

**Stakeholders**
- **SID (Security Intelligence Division)** - Operations & requirements
- **ICTC (Information & Communication Technology Center)** - Technical infrastructure
- **MSU-IIT Community** - End users

---

## 📞 Support

For questions or issues during testing:
1. Check **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**
2. Review **[COMPLETION_REPORT.md](./COMPLETION_REPORT.md)**
3. Inspect console for error messages
4. Restart the dev server if needed

---

## 🎉 Acknowledgments

Built with modern web technologies and best practices in mind.

Special thanks to:
- MSU-IIT for the opportunity
- SID & ICTC for operational insights
- The open-source community for amazing tools

---

<div align="center">

**Made with ❤️ for MSU-IIT**

![MSU-IIT Colors](https://img.shields.io/badge/Maroon-%23800000-800000) ![MSU-IIT Colors](https://img.shields.io/badge/Gold-%23FFD700-FFD700)

</div>
