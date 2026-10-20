# **ClaimIT – Lost and Found Campus App**

**Product Requirements Document (PRD)**

---

## **Project Overview**

ClaimIT is a **Progressive Web Application (PWA)** designed to **streamline the lost-and-found process on campus**. It connects students, staff, and teachers with the **Security Intelligence Division (SID)** and the **Information and Communication Technology Center (ICTC)**.

The app enables users to **report, search, and claim items** using either a centralized workflow (SID-managed) or a peer-to-peer approach. SID manages approvals and claims, while ICTC oversees system integration and deployment.

**Level:** Medium to Advanced  
**Type of Project:** Web App Development (PWA), Campus Utility, Security-Tech Integration

---

## **Goals and Objectives**

- Establish a **centralized digital lost-and-found system** for campus.
- Increase the item recovery rate from the current **20-30% to over 60%**.
- Reduce the **2-3 hours daily administrative burden** on SID personnel.
- Enhance **transparency, accountability, and communication** between stakeholders.
- Provide **real-time updates** and **secure claim verification**.

---

## **Key Stakeholders**

- **Primary Users:** Students, Staff, Teachers
- **Admins:** Security Intelligence Division (SID)
- **System Managers:** ICTC

---

## **Core Features**

### **1\. Authentication & Roles**

- Login via **SAML Single Sign-On (SSO)** integrated with University Active Directory.
- Roles: Student, Staff, Teacher, Admin (SID) automatically assigned.
- Admin permissions: approve claims, delete items, view statistics.

### **2\. Item Reporting**

- Report lost/found items with:
  - Title, Description, Category (Books, Electronics, ID Cards, Clothing, etc.)
  - Location (building, room, campus area)
  - Date lost/found
  - Image upload (max 5 photos, **privacy restriction: no wallet contents**).
  - **Dual-Mode Option:** "Turn over to SID" or "Keep for Peer-to-Peer Return".

### **3\. Search & Filter**

- Search items by **name, description, location**.
- Filters: Category, Status (Claimed, Archived, Active), Date range.

### **4\. Main Page (Dashboard)**

- Tabs: **Lost | Found | All**
- Item cards showing: image, name, date posted, posted by, location.
- Floating **Report Item** button.

### **5\. Item Detail Page**

- Displays: Name, Category, Location, Date, Description, Poster details.
- Actions: **Claim Item**, **Message Poster**.
- Auto-generated **QR code** linked to item details.

### **6\. Claim Process**

- User submits claim request.
- Admin (SID) reviews and verifies ownership.
- Approved claims require **ID confirmation** at SID office.

### **7\. Messaging & Notifications**

- In-app messaging (Firebase Firestore Realtime updates).
- Push notifications (Firebase Cloud Messaging) for:
  - Claim status updates
  - New lost/found reports
  - Admin messages

### **8\. User Profile**

- Fields: Full Name, Address, Mobile Number, Email, School ID Number.
- Sensitive info viewable only by Admin.
- Statistics dashboard: total items reported, lost/found counts.
- **Points system** for users who report found items.

### **9\. Admin Features (SID)**

- Approve/deny claims.
- Edit, archive, or delete items.
- Message users.
- Analytics dashboard: active claims, category breakdown, user reporting stats.

---

## **Additional Features (Future Enhancements)**

- AI-powered **image recognition** for item matching.
- **Geo-tagging** for precise lost/found locations.
- **Reward leaderboard** for top item finders.
- Integration with **campus ID system** for faster claim verification.

---

## **Technical Requirements**

### **Frontend**

- **React.js** (Progressive Web Application).
- Responsive design for Mobile, Tablet, and Desktop.

### **Backend (Firebase Free Tier - Prototype)**

- **Authentication:** Firebase Authentication (integrated with SAML SSO provider).
- **Database:** Firestore (NoSQL, real-time sync).
- **Cloud Storage:** Firebase Storage (for images).
- **Hosting/Functions:** Firebase Cloud Functions (for claim approvals, QR code generation, scheduled cleanups).
- **Messaging & Notifications:** Firebase Cloud Messaging (push notifications).
- **Analytics:** Firebase Analytics (user engagement, reporting trends).
- **QR Code Generation:** Open-source libraries (client-side).

### **Deployment**

- **Web-based deployment** accessible via URL.
- No App Store/Play Store deployment required (per ICTC recommendation).
- Future migration path to university SQL infrastructure.

---

## **Milestones**

**Milestone 1: Authentication & Profiles**

- SAML SSO Integration setup
- Role-based login system
- User profile creation

**Milestone 2: Item Reporting & Dashboard**

- Lost/Found reporting with image upload & privacy checks
- Search, filter, and card-based display

**Milestone 3: Claims & Messaging**

- Claim workflow (user → admin approval)
- In-app messaging (Firestore)
- Notifications system (FCM)

**Milestone 4: Admin Dashboard**

- Approvals, statistics, data management

**Milestone 5: Beta Testing & Deployment**

- Security testing with SID
- User testing with students/staff
- Final deployment as PWA

---

## **Client Information**

The client are the **University Security Intelligence Division (SID)** and the **Information and Communication Technology Center (ICTC)**.  
Their goal is to **digitize the campus lost-and-found system** for improved efficiency, accountability, and security.
