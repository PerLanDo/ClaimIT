# **ClaimIT – Campus Lost & Found App (MSU-IIT LAFT)**

## **What it is (Overview)**

ClaimIT is a **Progressive Web Application (PWA)** designed for MSU-IIT to modernize the campus lost-and-found system. It provides a **centralized digital platform** accessible via any web browser on mobile or desktop, allowing students, faculty, and staff to report, browse, and recover lost or found items.

The app connects the university community with the **Security Intelligence Division (SID)** and the **Information and Communication Technology Center (ICTC)**, ensuring that every item is handled with **accountability, transparency, and security**.

Users can **post items with photos, search listings, send secure messages, and submit claims**, while admins (SID) manage approvals, moderate reports, and track activity through an analytics dashboard.

---

## **Key Features**

### **1\. Report Items (Dual-Mode)**

- Add **title, description, category, location, and date**.
- **Dual-Mode Reporting:** Choose between **"Turned in to Security"** (Centralized) or **"Peer-to-Peer"** (Finder keeps item for direct return).
- Upload up to **5 photos** (with privacy restrictions: e.g., no photos of wallet contents).
- Status options: **Lost / Found / Archived**.

### **2\. Browse & Search**

- **Home feed** with item cards and category badges.
- Tabs: **Lost | Found | All**.
- **Search bar** with filters (category, status, date range, location).

### **3\. Item Details**

- Full details: photos, category, location, date, description.
- Poster information (name, role, avatar).
- Action buttons: **Claim Item**, **Message Poster**, **Share**.
- Auto-generated **QR code** for quick verification.

### **4\. Claims Management**

- Submit claim requests with explanation/proof.
- Claims reviewed by **item owner** and **SID admin**.
- Claim status tracking: **Pending | Approved | Rejected**.
- Final retrieval requires **ID confirmation** at SID office.

### **5\. Messaging & Notifications**

- In-app chat with item posters or campus security.
- Push notifications (via Firebase Cloud Messaging) for:
  - Claim status updates
  - New lost/found reports
  - Admin messages
- Bell icon for unread activity.

### **6\. Profiles & Login**

- Sign in with **university credentials** via **SAML Single Sign-On (SSO)**.
- Roles: **Student, Staff, Teacher, Admin (SID)** automatically assigned from Active Directory.
- Profile fields: name, avatar, contact info (optional), school ID number (encrypted).
- **Statistics dashboard**: items reported, lost/found counts, points earned.

### **7\. Admin Dashboard (SID)**

- Approve/deny claims with verification logs.
- Edit, archive, or delete reports.
- Track lost, found, and resolved items.
- Charts for **categories, activity trends, and user contributions**.
- Messaging hub for direct communication with users.

---

## **Target Users**

- **Students:** Report, search, claim, and chat about items.
- **Faculty & Staff:** Same as students, plus report items turned in to security.
- **Campus Security/Admins (SID):** Moderate reports, verify claims, manage items, and analyze activity data.

---

## **Where It’s Used**

- **On-campus** at MSU-IIT.
- Accessible as a **Progressive Web App (PWA)** via standard web browsers on smartphones, tablets, and desktops. No App Store download required.

---

## **Why It Matters**

- **Solves Low Recovery Rates:** Increases the current **20-30% item recovery rate** by making items visible 24/7.
- **Reduces Admin Workload:** Automates search and matching to reclaim the **2-3 hours daily** SID staff currently spend on manual logs.
- **Convenience:** One platform for posting, searching, and recovering items without physical office visits.
- **Trust & transparency:** Clear claim process with photo verification reduces disputes and fraud.
- **Safety:** Sensitive items (IDs, wallets, electronics) can be flagged urgent or routed directly to security.
- **Community engagement:** Messaging connects the right people instantly while protecting privacy.
- **Operational insight:** Admins gain visibility into trends and reporting patterns.
- **Low overhead:** Runs on **Firebase Free Tier** (prototype) with a path to university infrastructure.

---
