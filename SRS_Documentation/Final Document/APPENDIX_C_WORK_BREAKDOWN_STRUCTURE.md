# Appendix C: Work Breakdown Structure (WBS)

The following Work Breakdown Structure details the specific tasks required to complete the ClaimIT project, organized by the phases defined in the Gantt Chart (Section 2.8).

**1.0 Planning Phase**

- 1.1 Project Initiation
  - 1.1.1 Define project scope and objectives
  - 1.1.2 Identify stakeholders (SID, ICTC, Students)
  - 1.1.3 Form development team
- 1.2 Requirement Gathering
  - 1.2.1 Conduct interview with SID
  - 1.2.2 Conduct interview with ICTC
  - 1.2.3 Analyze existing manual processes
- 1.3 Documentation
  - 1.3.1 Draft Software Requirements Specification (SRS)
  - 1.3.2 Review SRS with advisor
  - 1.3.3 Finalize SRS

**2.0 Analysis & Design Phase**

- 2.1 System Analysis
  - 2.1.1 Define Use Cases
  - 2.1.2 Create Sequence Diagrams
  - 2.1.3 Create Activity Diagrams
- 2.2 Database Design
  - 2.2.1 Design Entity Relationship Diagram (ERD)
  - 2.2.2 Define Data Dictionary
  - 2.2.3 Setup Firebase Firestore schema (Prototype)
- 2.3 UI/UX Design
  - 2.3.1 Create Wireframes (Low-fidelity)
  - 2.3.2 Create High-fidelity Mockups (Figma)
  - 2.3.3 Design PWA responsive layouts

**3.0 Development Phase**

- 3.1 Environment Setup
  - 3.1.1 Initialize React project
  - 3.1.2 Configure Firebase project
  - 3.1.3 Setup GitHub repository
- 3.2 Frontend Development
  - 3.2.1 Develop Authentication Module (Login/Register)
  - 3.2.2 Develop Dashboard & Feed
  - 3.2.3 Develop Reporting Forms (Lost/Found)
  - 3.2.4 Develop Search & Filter components
  - 3.2.5 Develop User Profile & Settings
- 3.3 Backend Integration
  - 3.3.1 Implement Firebase Auth
  - 3.3.2 Implement CRUD operations for Items
  - 3.3.3 Implement Image Upload (Storage)
  - 3.3.4 Implement Real-time Messaging
- 3.4 Admin Module Development
  - 3.4.1 Develop SID Dashboard
  - 3.4.2 Develop Turnover Logbook features
  - 3.4.3 Develop Reporting/Analytics view

**4.0 Testing Phase**

- 4.1 Unit Testing
  - 4.1.1 Test individual components
  - 4.1.2 Test API integrations
- 4.2 Integration Testing
  - 4.2.1 Test end-to-end flows (Report -> Claim -> Handover)
  - 4.2.2 Test PWA offline capabilities
- 4.3 User Acceptance Testing (UAT)
  - 4.3.1 Conduct testing sessions with students
  - 4.3.2 Conduct testing sessions with SID staff
  - 4.3.3 Collect and analyze feedback

**5.0 Deployment & Handover Phase**

- 5.1 Deployment
  - 5.1.1 Deploy to hosting platform (e.g., Vercel/Netlify for prototype)
  - 5.1.2 Perform final smoke tests
- 5.2 Documentation & Training
  - 5.2.1 Create User Manuals
  - 5.2.2 Create Admin Guide
  - 5.2.3 Conduct handover presentation to ICTC
