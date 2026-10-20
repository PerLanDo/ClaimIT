# Section 8: Non-Functional Requirements

## 8.1 Performance Requirements

The ClaimIT system is designed to serve the entire MSU-IIT community, estimated at approximately 12,000+ students, faculty, and staff. The system must meet the following performance benchmarks:

1.  **Response Time:**

    - The system shall load the dashboard and main feed within **3 seconds** on a standard 4G mobile connection.
    - Search queries (filtering by category, date, or keyword) shall return results within **2 seconds**.
    - Image uploads (compressed client-side) shall complete within **5 seconds** for files under 5MB.

2.  **Throughput & Concurrency:**

    - The system shall support at least **500 concurrent users** during peak hours (e.g., after major campus events or exams).
    - The backend shall be capable of handling **1,000+ new item reports per day** without performance degradation.

3.  **Resource Usage:**
    - The Progressive Web App (PWA) shall utilize service workers to cache static assets, ensuring the application shell loads instantly on repeat visits.
    - Client-side storage usage (IndexedDB/LocalStorage) shall not exceed **50MB** to respect user device limits.

## 8.2 Security Requirements

Given the handling of personal property data and integration with university credentials, security is paramount.

1.  **Authentication & Authorization:**

    - Access to the system shall be strictly controlled via **SAML Single Sign-On (SSO)** integrated with the MSU-IIT Active Directory (My.IIT).
    - Session timeouts shall be enforced after **30 minutes of inactivity** to prevent unauthorized access on shared devices.
    - **Role-Based Access Control (RBAC)** shall strictly enforce permissions:
      - _Standard Users_ can only edit/delete their own reports.
      - _SID Admins_ have global privileges to manage all reports and view audit logs.

2.  **Data Privacy (RA 10173 Compliance):**

    - **Personal Information Masking:** Users' mobile numbers and email addresses shall never be displayed publicly. All communication must occur via the internal chat system.
    - **Image Privacy:** The system shall automatically strip EXIF metadata (location, device info) from uploaded photos before storage.
    - **Content Moderation:** Uploaded images must be screened (automated or manual) to ensure no sensitive personal data (e.g., ID numbers, credit card details) is visible.

3.  **Data Integrity & Encryption:**
    - All data in transit must be encrypted using **TLS 1.2/1.3 (HTTPS)**.
    - Sensitive data at rest (e.g., user logs, chat history) shall be encrypted in the database.
    - The system shall prevent SQL Injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF) attacks through standard framework protections (e.g., React sanitization, parameterized queries).

## 8.3 Reliability and Availability Requirements

1.  **Availability:**

    - The system shall be available **24/7**, with a targeted uptime of **99.9%** during the academic semester.
    - Scheduled maintenance shall be performed during off-peak hours (12:00 AM - 4:00 AM) with prior notification.

2.  **Fault Tolerance:**

    - In the event of a network disconnection, the PWA shall provide an **Offline Mode** allowing users to view previously loaded data and draft reports (to be synced when connectivity is restored).
    - The system shall gracefully handle database connection failures by displaying user-friendly error messages rather than raw stack traces.

3.  **Data Backup:**
    - Automated incremental backups of the database shall be performed **daily**.
    - Full system backups shall be performed **weekly** and stored in a separate, secure location (e.g., cloud storage bucket with versioning).

## 8.4 Usability Requirements

1.  **User Interface (UI) Design:**

    - The interface shall follow **Material Design** principles to ensure familiarity and ease of use.
    - The design must be **Responsive**, adapting seamlessly to mobile phones (portrait/landscape), tablets, and desktop monitors.

2.  **Accessibility:**

    - The system shall aim for **WCAG 2.1 AA compliance**, ensuring contrast ratios and screen reader compatibility for users with visual impairments.
    - Touch targets (buttons, icons) on mobile views shall be at least **44x44 pixels** to accommodate finger tapping.

3.  **Learnability:**
    - First-time users shall be guided by a brief **onboarding tutorial** explaining the "Lost" vs. "Found" reporting process.
    - Error messages shall be descriptive and offer corrective actions (e.g., "Image file too large. Please upload a file smaller than 5MB" instead of "Error 413").

## 8.5 Software Quality Attributes

1.  **Maintainability:**

    - The codebase shall follow a **modular component architecture** (React Components) to facilitate easy updates and debugging.
    - Code shall be documented using standard commenting practices (e.g., JSDoc).

2.  **Portability:**
    // ...existing code... - As a PWA, the system shall be platform-independent, functioning correctly on **Chrome, Firefox, Safari, and Edge** browsers across Windows, macOS, Android, and iOS.
