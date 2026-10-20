# Section 7: The System

## 7.1 System Overview

ClaimIT is a comprehensive Lost and Found Information System designed specifically for the Mindanao State University - Iligan Institute of Technology (MSU-IIT) campus. Built as a Progressive Web Application (PWA), it provides a cross-platform solution accessible via any modern web browser on desktop and mobile devices, eliminating the need for app store downloads while offering an app-like experience.

The system bridges the gap between the traditional, manual lost and found process managed by the Security and Investigation Division (SID) and the informal, scattered reporting that occurs on social media platforms. ClaimIT operates on a dual-mode architecture:

1.  **Peer-to-Peer (P2P) Recovery:** Facilitates direct coordination between students/faculty for low-value items, speeding up recovery times.
2.  **Centralized SID Management:** Mandates the turnover of high-value items (e.g., electronics, wallets) to the SID office, where they are logged, verified, and stored securely until claimed.

At its core, ClaimIT prioritizes security and privacy. It integrates with the university's Active Directory via SAML SSO for authenticated access, ensuring all users are verified constituents. Personal contact numbers are masked in favor of a secure in-app messaging system to prevent harassment. The system also digitizes the SID's logbook, providing a searchable, audit-ready database of all turned-over items, replacing the inefficient manual paper logs.

## 7.2 System Features

The following features define the core capabilities of the ClaimIT system:

**Feature 1: Secure SAML SSO Authentication**
Integration with MSU-IIT's My.IIT portal credentials ensures that only legitimate students, faculty, and staff can access the system. This eliminates anonymous reporting and establishes accountability for all transactions.

**Feature 2: Dual-Stream Reporting Engine**
A smart reporting interface that categorizes items as "Lost" or "Found." For found items, the system intelligently prompts the user to either keep the item for P2P handover (low value) or turn it over to SID (high value/sensitive), guiding them through the appropriate process.

**Feature 3: Intelligent Search and Filtering**
An advanced search bar equipped with filters for category (electronics, clothing, ID), date range, location found, and color. The search algorithm uses keyword matching to help users quickly locate potential matches for their lost items.

**Feature 4: Secure In-App Messaging**
A privacy-focused chat system that allows finders and owners to coordinate meetups without revealing personal phone numbers or social media profiles. The chat includes safety warnings for physical meetups.

**Feature 5: Digital Proof of Ownership**
A structured claiming process where users must submit digital proof (e.g., a photo of the item before it was lost, a description of unique markers, or unlocking a device in person) before a handover can be scheduled.

**Feature 6: QR Code Identity Verification**
A secure handover mechanism where the system generates a unique QR code for the owner upon claim approval. The finder (or SID officer) scans this code to confirm the identity of the claimant and mark the transaction as complete.

**Feature 7: SID Admin Dashboard**
A centralized command center for SID officers to manage turned-over inventory, verify high-value item reports, view analytics on recovery rates, and manage the digital logbook.

**Feature 8: Smart Notification System**
Real-time push notifications and email alerts inform users about potential item matches, claim status updates, new messages, and reminders to turn over items to SID.

**Feature 9: Privacy-First Image Handling**
The system enforces privacy guidelines on image uploads. For sensitive items like wallets, users are instructed to photograph the exterior only. The system compresses images to optimize performance while maintaining visibility.

**Feature 10: Digital Logbook & Audit Trail**
Replaces the manual logbook with a tamper-proof digital record. Every action—from reporting to claiming—is timestamped and logged, providing SID with a complete history of every item's lifecycle.

**Feature 11: Interactive Map Location Pinning**
Integration with mapping services allows users to pin the exact location where an item was lost or found, providing visual context to help narrow down search areas.

**Feature 12: User Reputation & Leaderboard**
A gamification element that tracks "Top Finders" to encourage honest reporting. Users earn badges or points for successfully returning items, fostering a culture of honesty on campus.

**Feature 13: Automated Expiry & Archiving**
The system automatically flags unclaimed items after a set period (e.g., 30 days) for disposal or donation, helping SID manage storage space efficiently.

**Feature 14: Responsive PWA Interface**
A fluid, responsive design that adapts to various screen sizes (mobile, tablet, desktop), ensuring a consistent user experience whether accessed from a phone on the go or a desktop in an office.

**Feature 15: Role-Based Access Control (RBAC)**
Distinct interfaces and permission sets for different user roles: Students/Staff (Standard Users) and SID Officers (Admin Users), ensuring security and appropriate access to sensitive data.

## 7.3 System Functions

This section details the step-by-step execution of key system functions.

### Function 1: Login via My.IIT Portal

**Description:** The process of authenticating a user using their university credentials.
**Steps:**

1.  User opens the ClaimIT web application.
2.  User clicks the "Login with My.IIT" button on the landing page.
3.  System redirects user to the MSU-IIT SSO login page.
4.  User enters their username and password.
5.  Upon success, user is redirected back to the ClaimIT Dashboard.
    **Visual:**
    > [Insert Screenshot: ClaimIT Landing Page with "Login" button] > [Insert Screenshot: MSU-IIT SSO Login Interface]

### Function 2: View Dashboard (Home Feed)

**Description:** The main landing view after login, showing recent posts and status summaries.
**Steps:**

1.  User lands on the Dashboard.
2.  System displays a "Quick Stats" card (Items Reported, Items Returned).
3.  System displays a feed of recently reported "Lost" and "Found" items.
4.  User can toggle between "Lost" and "Found" tabs.
    **Visual:**
    > [Insert Screenshot: User Dashboard showing feed of items]

### Function 3: Report a Lost Item

**Description:** A user submits a report for an item they have lost.
**Steps:**

1.  User clicks the "+" (New Report) button in the navigation bar.
2.  User selects "I Lost an Item".
3.  User fills in details: Category, Item Name, Date Lost, Location (Pin on Map), Description.
4.  User uploads a reference photo (optional).
5.  User clicks "Submit Report".
6.  System posts the item to the public feed.
    **Visual:**
    > [Insert Screenshot: "Report Lost Item" Form] > [Insert Screenshot: Map Interface for pinning location]

### Function 4: Report a Found Item (Peer-to-Peer)

**Description:** A user reports a low-value item they found and intend to return directly.
**Steps:**

1.  User clicks the "+" button and selects "I Found an Item".
2.  User fills in details and uploads a photo.
3.  System asks: "Is this a high-value item (Wallet, Phone, Laptop)?"
4.  User selects "No".
5.  System advises user to keep the item safe for handover.
6.  User submits the report.
    **Visual:**
    > [Insert Screenshot: "Report Found Item" Form] > [Insert Screenshot: High-Value Item Check Prompt]

### Function 5: Report a Found Item (Turnover to SID)

**Description:** A user reports a high-value item that must be surrendered to security.
**Steps:**

1.  User reports a found item and selects "Yes" for high-value.
2.  System displays instruction: "Please surrender this item to the SID Office within 24 hours."
3.  System generates a "Turnover Ticket" with a unique ID.
4.  User brings item to SID.
5.  SID Officer scans the ticket to acknowledge receipt.
    **Visual:**
    > [Insert Screenshot: Turnover Instruction Screen] > [Insert Screenshot: Digital Turnover Ticket with QR Code]

### Function 6: Search for Items

**Description:** Finding a specific item using keywords and filters.
**Steps:**

1.  User clicks the "Search" icon.
2.  User types keywords (e.g., "Blue Umbrella").
3.  User applies filters: Category (Accessories), Date (Last 3 days).
4.  System displays matching results.
    **Visual:**
    > [Insert Screenshot: Search Bar with Filter Options expanded] > [Insert Screenshot: Search Results List]

### Function 7: View Item Details

**Description:** Viewing the full information of a specific report.
**Steps:**

1.  User clicks on an item card from the feed or search results.
2.  System displays full details: large photo, full description, location map, and status.
3.  System displays action buttons ("This is mine" or "I found this").
    **Visual:**
    > [Insert Screenshot: Item Detail View]

### Function 8: Submit a Claim Request

**Description:** A user claims ownership of a found item.
**Steps:**

1.  On a "Found Item" detail page, user clicks "Claim Item".
2.  System prompts for "Proof of Ownership".
3.  User enters text description of unique markers (e.g., "Scratch on the back").
4.  User uploads a photo (if available).
5.  User clicks "Submit Claim".
    **Visual:**
    > [Insert Screenshot: Claim Request Form]

### Function 9: Review and Approve Claim (Finder Side)

**Description:** The finder reviews a claim request from a potential owner.
**Steps:**

1.  Finder receives a notification: "New claim for [Item Name]".
2.  Finder views the claim details and proof submitted.
3.  Finder clicks "Accept Claim" if satisfied.
4.  System opens a chat channel between Finder and Owner.
    **Visual:**
    > [Insert Screenshot: Claim Review Screen showing proof]

### Function 10: Secure In-App Messaging

**Description:** Coordinating the meetup details.
**Steps:**

1.  User opens the "Messages" tab.
2.  User selects the active conversation.
3.  Users exchange text messages to agree on a time and place (e.g., "Meet at Gazebo").
4.  System displays a safety banner: "Meet in public areas."
    **Visual:**
    > [Insert Screenshot: Chat Interface]

### Function 11: Generate Handover QR Code

**Description:** Creating the digital verification token for the meetup.
**Steps:**

1.  Owner arrives at the meetup location.
2.  Owner opens the specific Item Transaction in the app.
3.  Owner clicks "Generate Receive Code".
4.  System displays a unique QR Code on the Owner's screen.
    **Visual:**
    > [Insert Screenshot: QR Code Generation Screen on Owner's device]

### Function 12: Scan QR Code to Confirm Handover

**Description:** The finder verifies the owner and closes the transaction.
**Steps:**

1.  Finder hands over the item.
2.  Finder clicks "Scan Code" in the app.
3.  Finder scans the Owner's QR Code.
4.  System validates the code.
5.  System marks the item as "Returned" and updates both users' history.
    **Visual:**
    > [Insert Screenshot: Camera Interface scanning QR Code] > [Insert Screenshot: "Success! Item Returned" Confirmation Screen]

### Function 13: SID Admin - Dashboard Overview

**Description:** The admin view for security officers.
**Steps:**

1.  SID Officer logs in.
2.  Dashboard displays "Pending Turnovers," "Items in Custody," and "Unclaimed Items."
3.  Officer can quickly access the digital logbook.
    **Visual:**
    > [Insert Screenshot: Admin Dashboard with Analytics Widgets]

### Function 14: SID Admin - Receive Turnover Item

**Description:** Processing an item brought to the office by a student.
**Steps:**

1.  Student presents the "Turnover Ticket" (from Function 5).
2.  Officer scans the ticket or enters the ID.
3.  System pulls up the item details.
4.  Officer verifies the physical item matches the report.
5.  Officer clicks "Confirm Receipt".
6.  Item status changes to "In SID Custody".
    **Visual:**
    > [Insert Screenshot: Admin Interface for Receiving Items]

### Function 15: SID Admin - Verify High-Value Report

**Description:** Reviewing reports to ensure validity.
**Steps:**

1.  Officer views "Pending Reports" list.
2.  Officer selects a report flagged as high-value.
3.  Officer reviews details for compliance (e.g., no sensitive photos).
4.  Officer clicks "Approve" to publish to the feed or "Reject" if inappropriate.
    **Visual:**
    > [Insert Screenshot: Admin Report Verification Screen]

### Function 16: View Notifications

**Description:** Checking system alerts.
**Steps:**

1.  User clicks the Bell icon.
2.  System displays list of alerts (e.g., "Your item was approved," "New message").
3.  User clicks a notification to go to the relevant page.
    **Visual:**
    > [Insert Screenshot: Notification Dropdown/List]

### Function 17: Manage User Profile

**Description:** Updating personal settings.
**Steps:**

1.  User clicks Profile Avatar.
2.  User views their "Reputation Score" and "History".
3.  User can edit notification preferences.
    **Visual:**
    > [Insert Screenshot: User Profile Page]

### Function 18: Generate Lost/Found Report (Admin)

**Description:** SID generating a PDF report of monthly statistics.
**Steps:**

1.  Admin navigates to "Reports" section.
2.  Admin selects date range (e.g., "November 2025").
3.  Admin clicks "Export PDF".
4.  System downloads the statistical report.
    **Visual:**
    > [Insert Screenshot: Admin Reporting Tool]

### Function 19: Archive/Dispose Item

**Description:** Handling items that have exceeded the retention period.
**Steps:**

1.  Admin views "Expired Items" list.
2.  Admin selects an item.
3.  Admin changes status to "Donated" or "Disposed".
4.  System logs the final disposition.
    **Visual:**
    > [Insert Screenshot: Item Disposition Screen]

### Function 20: Logout

**Description:** Securely ending the session.
**Steps:**

1.  User clicks Profile Avatar.
2.  User selects "Logout".
3.  System clears session tokens and redirects to Landing Page.
    **Visual:**
    > [Insert Screenshot: Profile Menu with Logout option]
