# SECTION 5: ANALYSIS AND DESIGN

## Introduction

This section presents comprehensive UML modeling and design artifacts that translate the validated requirements from Section 4 into concrete architectural and behavioral specifications. All diagrams are derived directly from stakeholder interview data and requirements traceability matrix entries.

The analysis and design phase employs industry-standard Unified Modeling Language (UML) notation to ensure clarity and maintainability. Diagrams are organized to show both static structure (what the system consists of) and dynamic behavior (how the system operates over time).

---

## 5.1 Use Case Diagram {#use-case-diagram}

The Use Case Diagram provides a high-level functional overview of ClaimIT, showing all actors (users) and the primary use cases (functions) they can perform. This diagram consolidates all functional requirements into a visual representation of system capabilities.

```
[Placeholder for Use Case Diagram]

Actors:
1. Guest/Visitor (Unauthenticated)
2. Student (Authenticated)
3. Faculty/Staff (Authenticated)
4. SID Admin (Authenticated)
5. System (Timer-based automated processes)

Use Cases by Actor:

Guest/Visitor:
- UC-2.1: Browse Found Items
- UC-2.2: Search Items (read-only)
- UC-0.1: Register/Login

Student:
- Inherits all Guest capabilities, plus:
- UC-1.1: Report Lost Item
- UC-1.2: Report Found Item
- UC-2.2: View Item Details (full access)
- UC-3.1: Submit Claim
- UC-3.2: Track Claim Status
- UC-4.1: Send Message
- UC-4.2: Receive Notifications
- UC-6.1: Manage My Items (edit/delete own posts)
- UC-6.2: View My Dashboard (personal statistics)

Faculty/Staff:
- Inherits all Student capabilities, plus:
- UC-1.3: Mark Item as "Turned in to SID"
- UC-5.3: Access Faculty Dashboard (enhanced statistics)

SID Admin:
- Inherits browse/search capabilities, plus:
- UC-5.1: Moderate Items (edit/archive/delete any item)
- UC-5.2: Process Claims (approve/deny with reasons)
- UC-5.3: Manage Item Lifecycle (disposal scheduling)
- UC-5.4: View Admin Dashboard (comprehensive analytics)
- UC-5.5: Send Admin Messages (broadcast or individual)
- UC-5.6: View Audit Logs
- UC-5.7: Configure System Settings (categories, locations)
- UC-5.8: Generate Reports (recovery rates, statistics)

System (Automated):
- UC-7.1: Send Automatic Notifications (matching, status changes)
- UC-7.2: Generate QR Codes
- UC-7.3: Archive Expired Items (after disposal deadline)
- UC-7.4: Clean Up Temporary Data
```

**Use Case Relationships:**

- **Includes:** Common functionality extracted to reduce duplication
  - UC-0.2: Authenticate User (included by all authenticated use cases)
  - UC-4.3: Send Notification (included by multiple workflow use cases)
- **Extends:** Optional behaviors that may occur
  - UC-3.1.1: Request Additional Proof (extends Submit Claim when admin needs more info)
  - UC-1.2.1: Enable Peer-to-Peer (extends Report Found Item as optional flag)

**System Boundary:** All use cases occur within the ClaimIT system boundary. External integrations (Active Directory, Email Server) are shown outside the boundary as external systems.

---

## 5.2 Use Case Descriptions {#use-case-description}

Detailed use case descriptions following IEEE standard format. Each primary use case is documented with actors, preconditions, main flow, alternative flows, exception handling, and postconditions.

---

### UC-1.1: Report Lost Item

|       **Use Case ID:** | UC-1.1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     **Use Case Name:** | Report Lost Item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|            **Actors:** | Primary: Student, Faculty, Staff<br/>Secondary: System, Database                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|       **Description:** | A user reports an item they have lost by providing detailed information and optional photos. The system stores the report and makes it searchable for potential matchers who may have found the item.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|           **Trigger:** | User clicks "Report Lost Item" button on the dashboard.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|     **Preconditions:** | 1. User is authenticated via SAML SSO<br/>2. User has Student, Faculty, or Staff role<br/>3. System is operational and database is accessible                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|       **Normal Flow:** | 1. System displays lost item reporting form<br/>2. User enters item title (required, max 100 characters)<br/>3. User selects category from dropdown (Electronics, Clothing, IDs/Cards, Wallets, Books, Bags, Tumblers, Umbrellas, Keys, Other)<br/>4. User enters description (required, max 1000 characters)<br/>5. User selects location where item was lost from campus map or dropdown<br/>6. User selects approximate date and time of loss<br/>7. User optionally uploads photos (max 5, JPEG/PNG, 5MB each)<br/>8. User optionally provides contact phone number (checkbox + input field)<br/>9. User reviews entered information on preview screen<br/>10. User clicks "Submit Report"<br/>11. System validates all required fields and file formats<br/>12. System generates unique item ID<br/>13. System stores item record in database with status "Lost"<br/>14. System generates QR code linked to item<br/>15. System displays success message with item ID<br/>16. System sends confirmation notification to user<br/>17. Use case ends successfully                                                                                                                                                                                                                                                                                                                                                                 |
| **Alternative Flows:** | **Alt-7a: User uploads photos of wallet interior (policy violation)**<br/>- At step 7, if system detects potential sensitive content in wallet photo (using metadata or admin flagging):<br/> 7a.1 System displays warning: "For wallets, please photograph only the exterior. Contents must not be visible for privacy/security reasons."<br/> 7a.2 System rejects the photo upload<br/> 7a.3 User must re-take/select different photo<br/> 7a.4 Flow returns to step 7<br/><br/>**Alt-11a: Validation fails (missing required fields)**<br/>- At step 11, if required fields are empty or invalid:<br/> 11a.1 System highlights fields with errors in red<br/> 11a.2 System displays specific error messages for each field<br/> 11a.3 Flow returns to step 2<br/> 11a.4 User corrects errors and resubmits<br/><br/>**Alt-11b: File upload fails (wrong format or size)**<br/>- At step 11, if uploaded file doesn't meet requirements:<br/> 11b.1 System displays error: "File must be JPEG or PNG and under 5MB"<br/> 11b.2 System rejects upload<br/> 11b.3 Flow returns to step 7<br/><br/>**Alt-11c: Rate limit exceeded (spam prevention)**<br/>- At step 11, if user has posted more than 10 items today:<br/> 11c.1 System displays message: "Daily posting limit reached. Please contact SID if you need to report additional items."<br/> 11c.2 System logs potential abuse attempt<br/> 11c.3 Use case ends with error |
|        **Exceptions:** | **Exc-1: Network connection lost**<br/>- System auto-saves form data to browser local storage<br/>- User can resume after reconnection<br/>- Saved data expires after 24 hours<br/><br/>**Exc-2: Database write failure**<br/>- System displays error message: "Unable to save report. Please try again."<br/>- System logs error for admin review<br/>- User can retry submission<br/><br/>**Exc-3: User cancels during process**<br/>- System prompts: "Are you sure? Unsaved data will be lost."<br/>- If confirmed, system discards data and returns to dashboard<br/>- If cancelled, user continues editing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|    **Postconditions:** | **Success guarantee:**<br/>1. Item record exists in database with unique ID<br/>2. Item appears in search results for all users<br/>3. User receives confirmation notification<br/>4. Item is tagged with user's ID for ownership tracking<br/>5. QR code is generated and accessible<br/>6. Audit log entry created with timestamp and user ID<br/><br/>**Minimal guarantee (even if goal not achieved):**<br/>1. Any uploaded photos are stored securely or fully deleted (no orphans)<br/>2. Database integrity maintained<br/>3. No sensitive user data exposed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

---

### UC-3.1: Submit Claim

|       **Use Case ID:** | UC-3.1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     **Use Case Name:** | Submit Claim for Found Item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|            **Actors:** | Primary: Student, Faculty, Staff<br/>Secondary: SID Admin, System                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|       **Description:** | A user who believes a found item belongs to them submits a claim by providing proof of ownership. The claim is routed to SID Admin for verification and approval. This addresses SID's documented problem with fraudulent claim attempts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|           **Trigger:** | User clicks "Claim This Item" button on item detail page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|     **Preconditions:** | 1. User is authenticated<br/>2. Item status is "Found - Available"<br/>3. Item is not already claimed by this user<br/>4. User is not the original poster of this found item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|       **Normal Flow:** | 1. System displays claim submission form pre-populated with item details<br/>2. User views item photos and description for reference<br/>3. System prompts: "Please describe how you can prove this item is yours"<br/>4. User enters proof of ownership explanation (min 50 characters, max 500 characters)<br/> Examples: "My name is engraved on the back", "I can describe the contents of the wallet including specific cards and amount of cash", "I have the receipt with serial number"<br/>5. User optionally uploads supporting evidence photos (e.g., receipt, photo of them with item)<br/>6. User specifies preferred contact method: In-app messaging only OR Phone (if provided in profile)<br/>7. User checks acknowledgment: "I understand providing false information may result in account suspension"<br/>8. User clicks "Submit Claim"<br/>9. System validates description length and content<br/>10. System changes item status to "Claim Pending"<br/>11. System creates claim record with timestamp and user ID<br/>12. System sends notification to SID Admin: "New claim requires review for [Item Title]"<br/>13. System sends confirmation to user: "Your claim has been submitted. SID will review and contact you."<br/>14. System displays estimated review time: "Claims typically reviewed within 24-48 hours"<br/>15. Use case ends successfully |
| **Alternative Flows:** | **Alt-4a: Description too vague (fails fraud prevention check)**<br/>- At step 4, if user provides generic description like "It's mine" or "I lost it":<br/> 4a.1 System prompts: "Please provide specific details that prove ownership. Generic statements are not sufficient."<br/> 4a.2 System highlights minimum detail requirements<br/> 4a.3 Flow returns to step 4<br/><br/>**Alt-6a: User prefers peer-to-peer coordination (item marked as such)**<br/>- At step 6, if item was posted with "Peer-to-Peer" flag:<br/> 6a.1 System displays message: "This item's finder prefers direct coordination"<br/> 6a.2 System enables in-app messaging between claimant and finder<br/> 6a.3 SID Admin receives notification but claim doesn't require formal approval<br/> 6a.4 Users coordinate directly, optionally involving SID for verification<br/><br/>**Alt-9a: User has previous denied claims (fraud pattern detected)**<br/>- At step 9, if user has 2+ denied claims in past 30 days:<br/> 9a.1 System flags claim as "High Risk - Review History"<br/> 9a.2 System sends priority notification to SID Admin with user's claim history<br/> 9a.3 Admin receives additional scrutiny prompt<br/> 9a.4 Flow continues to step 10                                                                                                                                       |
|        **Exceptions:** | **Exc-1: Duplicate claim attempt**<br/>- If user has already submitted a claim for this item:<br/> - System displays: "You have already submitted a claim for this item. Status: [Pending/Approved/Denied]"<br/> - System provides link to view existing claim<br/> - Use case ends<br/><br/>**Exc-2: Item claimed by someone else while form open**<br/>- If another user's claim was approved between steps 1-8:<br/> - System refreshes item status<br/> - System displays: "This item has already been claimed. If you believe this is an error, contact SID directly."<br/> - Use case ends<br/><br/>**Exc-3: Item removed/archived**<br/>- If item was deleted or archived by admin:<br/> - System displays: "This item is no longer available"<br/> - Use case ends                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|    **Postconditions:** | **Success guarantee:**<br/>1. Claim record created in database with status "Pending"<br/>2. Item status changed to "Claim Pending"<br/>3. SID Admin notified and claim appears in admin queue<br/>4. User notified of successful submission<br/>5. Audit log records claim attempt with user ID, timestamp, item ID<br/>6. Email sent to user (if email notifications enabled)<br/><br/>**Minimal guarantee:**<br/>1. Database consistency maintained<br/>2. Item not left in inconsistent state<br/>3. No claims lost due to concurrent access                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

---

### UC-5.2: Process Claim (Admin)

|       **Use Case ID:** | UC-5.2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     **Use Case Name:** | Process and Approve/Deny Claim                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|            **Actors:** | Primary: SID Admin<br/>Secondary: Student/Faculty (claimant), System                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|       **Description:** | SID Admin reviews a pending claim by examining proof of ownership, comparing with item details, checking claimant's history, and deciding to approve or deny. This implements the verification workflow to address SID's fraud prevention needs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|           **Trigger:** | Admin clicks on pending claim in Admin Dashboard queue.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|     **Preconditions:** | 1. User authenticated as SID Admin<br/>2. Claim exists with status "Pending"<br/>3. Related item exists in database<br/>4. Claimant account is active                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|       **Normal Flow:** | 1. System displays claim review interface with three panels:<br/> - Left: Item details with all photos<br/> - Middle: Claimant's proof of ownership description and evidence<br/> - Right: Claimant profile (name, role, previous claim history)<br/>2. Admin reviews item description and photos<br/>3. Admin reads claimant's proof of ownership explanation<br/>4. Admin checks if description matches item characteristics<br/>5. Admin reviews claimant's history: success rate, denied claims, account age<br/>6. Admin views any supporting evidence photos provided by claimant<br/>7. **Decision Point: Admin determines if proof is sufficient**<br/>8. **Path A - Approval:**<br/> 8a. Admin clicks "Approve Claim"<br/> 8b. System prompts for optional approval notes (visible to claimant)<br/> 8c. Admin enters notes if needed: "Please bring your MSU-IIT ID for verification"<br/> 8d. Admin clicks "Confirm Approval"<br/> 8e. System changes claim status to "Approved"<br/> 8f. System changes item status to "Claimed - Pending Pickup"<br/> 8g. System sends notification to claimant: "Your claim has been approved! Please visit SID office during hours 7 AM - 9 PM with your ID."<br/> 8h. System sends in-app message with pickup instructions and SID contact info<br/> 8i. System logs approval in audit trail with admin ID and timestamp<br/> 8j. Use case ends successfully<br/>**Path B - Denial:**<br/> 8k. Admin clicks "Deny Claim"<br/> 8l. System requires admin to select denial reason from dropdown:<br/> - "Proof of ownership insufficient"<br/> - "Description does not match item"<br/> - "Suspected fraudulent claim"<br/> - "Item already claimed by verified owner"<br/> - "Other (please specify)"<br/> 8m. Admin enters detailed explanation (required, min 50 characters)<br/> 8n. Admin clicks "Confirm Denial"<br/> 8o. System changes claim status to "Denied"<br/> 8p. System returns item status to "Found - Available"<br/> 8q. System sends notification to claimant with denial reason<br/> 8r. System logs denial in audit trail<br/> 8s. Use case ends |
| **Alternative Flows:** | **Alt-6a: Admin needs more information**<br/>- At step 6, if proof is unclear:<br/> 6a.1 Admin clicks "Request Additional Information"<br/> 6a.2 System displays message composition form<br/> 6a.3 Admin types specific questions: "Please provide more details about [specific aspect]"<br/> 6a.4 System sends message to claimant<br/> 6a.5 System changes claim status to "Information Requested"<br/> 6a.6 System sends notification to claimant<br/> 6a.7 When claimant responds with additional info, claim returns to "Pending" queue<br/> 6a.8 Use case returns to step 1<br/><br/>**Alt-7a: Admin suspects fraud (high-risk case)**<br/>- At step 7, if claimant has suspicious pattern (multiple denials, new account with expensive item claim):<br/> 7a.1 Admin clicks "Flag for Investigation"<br/> 7a.2 System prompts for investigation notes<br/> 7a.3 Admin documents concerns<br/> 7a.4 System changes claim status to "Under Investigation"<br/> 7a.5 System notifies claimant: "Your claim is under review. You may be contacted for additional verification."<br/> 7a.6 Claim remains in admin queue for senior admin review<br/> 7a.7 After investigation, admin follows normal approval/denial path                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|        **Exceptions:** | **Exc-1: Item removed during review**<br/>- If item deleted by another admin or system:<br/> - System displays error: "Item no longer exists"<br/> - System auto-denies claim with reason: "Item record unavailable"<br/> - System notifies claimant<br/> - Use case ends<br/><br/>**Exc-2: Claimant account suspended/deleted**<br/>- If claimant account became inactive:<br/> - System prevents approval/denial<br/> - System displays: "Claimant account inactive. Contact IT support."<br/> - Use case ends with no status change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|    **Postconditions:** | **Success guarantee (Approved):**<br/>1. Claim status = "Approved"<br/>2. Item status = "Claimed - Pending Pickup"<br/>3. Claimant notified with pickup instructions<br/>4. Item removed from public search results<br/>5. Audit log complete with admin decision and timestamp<br/><br/>**Success guarantee (Denied):**<br/>1. Claim status = "Denied"<br/>2. Item status restored to "Found - Available"<br/>3. Claimant notified with specific reason<br/>4. Item remains searchable for other potential owners<br/>5. Denial reason recorded for admin accountability                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

---

_[Additional Use Cases UC-1.2, UC-2.1, UC-2.2, UC-4.1, UC-5.1, UC-5.4 would be documented similarly]_

---

## 5.3 Sequence Diagram {#sequence-diagram}

Sequence diagrams show the time-ordered interactions between objects/components during specific scenarios. These diagrams complement use case descriptions by illustrating the technical message flow.

### Sequence Diagram 1: User Authentication via SAML SSO

```
[Placeholder for Sequence Diagram - Authentication Flow]

Participants:
- User (Actor)
- Web Browser
- ClaimIT Frontend (React)
- Firebase Authentication
- SAML Identity Provider (University Active Directory)
- ClaimIT Backend (Firebase Functions)
- Firestore Database

Flow:
1. User → Browser: Clicks "Login with University Account"
2. Browser → Frontend: Button click event
3. Frontend → Firebase Auth: initiateSAMLLogin()
4. Firebase Auth → SAML IdP: Redirect to university SSO login page
5. SAML IdP → User: Display login form
6. User → SAML IdP: Enter university credentials (username/password)
7. SAML IdP → SAML IdP: Validate credentials against Active Directory
8. SAML IdP → SAML IdP: Retrieve user attributes (role, email, name, ID)
9. SAML IdP → Firebase Auth: Return SAML assertion with user data
10. Firebase Auth → Firebase Auth: Validate assertion, create/update user token
11. Firebase Auth → Frontend: Return ID token + user info
12. Frontend → Backend: Call getUserRole(token)
13. Backend → Firestore: Query users collection for additional profile data
14. Firestore → Backend: Return user role, permissions, profile
15. Backend → Frontend: Return complete user object
16. Frontend → Frontend: Store token in session, update UI for user role
17. Frontend → User: Display personalized dashboard
```

**Key Technical Details:**

- Token expiration: 1 hour (refresh token valid for 30 days)
- Role mapping: Active Directory attribute "userRole" → ClaimIT roles
- First-time users: Auto-create profile in Firestore with default settings
- Error handling: Invalid credentials → redirect to error page, expired token → auto-refresh attempt

---

### Sequence Diagram 2: Submit and Process Claim

```
[Placeholder for Sequence Diagram - Claim Submission and Approval]

Participants:
- Student (Claimant)
- Frontend
- Backend API
- Firestore DB
- Firebase Cloud Messaging (FCM)
- SID Admin
- Admin Dashboard

Flow:
A. Claim Submission Phase:
1. Student → Frontend: Click "Claim This Item" on item detail page
2. Frontend → Frontend: Validate user not item poster, item available
3. Frontend → Student: Display claim form
4. Student → Frontend: Enter proof of ownership + supporting docs
5. Frontend → Frontend: Validate description length (50-500 chars)
6. Frontend → Backend: POST /api/claims/submit {itemId, userId, proof, evidence[]}
7. Backend → Backend: Validate request, check rate limits, fraud patterns
8. Backend → Firestore: Transaction BEGIN
9. Backend → Firestore: Create claim document {status: "pending", timestamp, userId, itemId, proof}
10. Backend → Firestore: Update item document {status: "Claim Pending"}
11. Backend → Firestore: Transaction COMMIT
12. Backend → Firestore: Query admins collection for SID Admin user IDs
13. Backend → FCM: Send push notification to all SID Admins
14. Backend → Firestore: Create notification record for claimant
15. Backend → Frontend: Return success response {claimId, estimatedReviewTime}
16. Frontend → Student: Display success message + tracking info

B. Admin Review Phase (24 hours later):
17. Admin → Dashboard: Login and open "Pending Claims" queue
18. Dashboard → Backend: GET /api/claims/pending
19. Backend → Firestore: Query claims where status="pending" ORDER BY timestamp
20. Firestore → Backend: Return claims array
21. Backend → Dashboard: Return claims with populated item/user data
22. Dashboard → Admin: Display list of pending claims
23. Admin → Dashboard: Click on specific claim to review
24. Dashboard → Backend: GET /api/claims/{claimId}/details
25. Backend → Firestore: Fetch claim, related item, claimant profile, claim history
26. Firestore → Backend: Return complete claim package
27. Backend → Dashboard: Return formatted claim review data
28. Dashboard → Admin: Display claim review interface (3-panel view)
29. Admin → Admin: Review proof, compare to item, check history
30. Admin → Dashboard: Click "Approve" and add pickup notes
31. Dashboard → Backend: POST /api/claims/{claimId}/approve {notes, adminId}
32. Backend → Firestore: Transaction BEGIN
33. Backend → Firestore: Update claim {status: "Approved", approvedBy: adminId, approvedAt: timestamp}
34. Backend → Firestore: Update item {status: "Claimed", claimedBy: userId}
35. Backend → Firestore: Create audit log entry
36. Backend → Firestore: Transaction COMMIT
37. Backend → FCM: Send push notification to claimant
38. Backend → Firestore: Create notification record for claimant
39. Backend → Dashboard: Return success response
40. Dashboard → Admin: Display confirmation + next claim in queue
41. FCM → Student: Deliver push notification "Claim Approved!"
42. Student → Frontend: Open app from notification
43. Frontend → Backend: GET /api/claims/{claimId}
44. Backend → Firestore: Fetch updated claim details
45. Firestore → Backend: Return claim with pickup instructions
46. Backend → Frontend: Return claim data
47. Frontend → Student: Display approval message with SID office hours, pickup instructions
```

**Error Handling Branches:**

- Transaction failure at step 11 or 36 → Rollback, retry 3 times, then return error
- Notification delivery failure → Log error, continue (user can check status manually)
- Concurrent claim approval → Second admin sees "Already processed" message

---

_[Additional sequence diagrams would cover: Item Posting, Search, Messaging, QR Code Scanning]_

---

## 5.4 Collaboration Diagram {#collaboration-diagram}

Collaboration diagrams (also called Communication diagrams) show object interactions similar to sequence diagrams but emphasize the structural organization and message numbering rather than time sequence.

### Collaboration Diagram 1: Report Lost Item

```
[Placeholder for Collaboration Diagram]

Objects and their relationships:

:User
  |
  | 1: enterItemDetails()
  | 2: uploadPhotos()
  | 9: displaySuccess()
  |
:ItemForm (UI Component)
  |
  | 3: validateInput()
  | 4: submitItem(data)
  |
:ItemController
  |
  | 5: createItem()
  |  |
  |  | 5.1: save(item)
  |  |
:FirestoreDB
  |
  | 6: generateQRCode(itemId)
  |
:QRCodeService
  |
  | 7: sendNotification(user)
  |
:NotificationService
  |
  | 8: logAction(user, item)
  |
:AuditLogger

Message Flow:
1: User enters item details into form
2: User uploads photos (validates format/size client-side)
3: ItemForm validates all required fields filled
4: ItemForm submits validated data to ItemController
5: ItemController creates item object
  5.1: ItemController calls FirestoreDB to save item
6: ItemController calls QRCodeService to generate unique QR code
7: ItemController calls NotificationService to send confirmation to user
8: ItemController calls AuditLogger to record creation action
9: ItemForm displays success message to User
```

**Key Relationships:**

- **User ↔ ItemForm:** Direct interaction (user input)
- **ItemForm → ItemController:** Unidirectional (form submits to controller)
- **ItemController ↔ FirestoreDB:** Bidirectional (CRUD operations)
- **ItemController → QRCodeService:** Unidirectional (fire-and-forget)
- **ItemController → NotificationService:** Unidirectional (async call)
- **ItemController → AuditLogger:** Unidirectional (logging)

---

### Collaboration Diagram 2: Admin Approves Claim

```
[Placeholder for Collaboration Diagram]

Objects:
:SIDAdmin, :AdminDashboard, :ClaimController, :FirestoreDB, :NotificationService, :AuditLogger, :Student

Message Flow:
1: SIDAdmin → AdminDashboard: selectClaim(claimId)
2: AdminDashboard → ClaimController: getClaimDetails(claimId)
  2.1: ClaimController → FirestoreDB: fetchClaim(claimId)
  2.2: ClaimController → FirestoreDB: fetchRelatedItem(itemId)
  2.3: ClaimController → FirestoreDB: fetchClaimantHistory(userId)
3: AdminDashboard ← ClaimController: return(claimPackage)
4: AdminDashboard → SIDAdmin: display(claimPackage)
5: SIDAdmin → AdminDashboard: clickApprove(notes)
6: AdminDashboard → ClaimController: approveClaim(claimId, adminId, notes)
  6.1: ClaimController → FirestoreDB: updateClaimStatus("Approved")
  6.2: ClaimController → FirestoreDB: updateItemStatus("Claimed")
  6.3: ClaimController → AuditLogger: logApproval(claimId, adminId)
  6.4: ClaimController → NotificationService: notifyClaimant(userId, "Approved")
7: NotificationService → Student: pushNotification("Claim Approved")
8: AdminDashboard ← ClaimController: return(success)
9: AdminDashboard → SIDAdmin: displayConfirmation()
```

---

_[Additional collaboration diagrams would show: Search Flow, Messaging Interaction, Peer-to-Peer Coordination]_

---

**End of Section 5**

_This section has provided comprehensive behavioral and structural models of the ClaimIT system. The next section (Section 6) will focus on data models including Entity-Relationship Diagrams and Class Diagrams that define the system's data architecture._
