

### 1. The Platform Dilemma (Mobile vs. Web)

- **Current SRS/PRD:** Defines the project as a **Mobile Application** (React Native) to be deployed on the App Store/Play Store.

- **ICTC Interview:** Strongly recommends a **Responsive Web App** instead.
  
  - *Reason 1:* Students won't install an app they rarely use.
  
  - *Reason 2:* App Store approval is difficult/slow.
  
  - *Reason 3:* Integration with university SSO (SAML) is easier on the web.

- **Decision Needed:** Should we pivot the SRS to describe a **Progressive Web App (PWA) / Responsive Web App**, or do you want to stick to the **Native Mobile App** requirement (perhaps due to your course requirements)?

- **Answer:** Go with **Progressive Web App (PWA) / Responsive Web App**

### 2. The Database & Backend Conflict

- **Current SRS/PRD:** Heavily relies on **Google Firebase** (Firestore, Auth, Storage) as the backend.

- **ICTC Interview:** Recommends using an **SQL Database** and internal university hosting.
  
  - *Reason:* Data policy enforcement (banning users) is inconsistent if you use an external DB like Firebase.

- **Decision Needed:** For this Capstone/Class Project, are you allowed to stick with **Firebase** (as it is easier for development), or must you strictly follow ICTC's recommendation to use an **SQL/Internal DB**?
  
  - *Suggestion:* If this is a student project, usually sticking to Firebase is acceptable if you justify it as a "Prototype" phase, but I need your confirmation.
  
  **Answer:** We will stick to Firebase, but specify that it is only for prototyping, and in actual deployment, we will use SQL/Internal DB.

### 3. Custody of Found Items (Peer-to-Peer vs. Centralized)

- **Current SRS/PRD:** Implies a centralized flow where items are turned over to SID.

- **SID Interview:** Explicitly stated they are **okay** with students keeping found items and handling claims themselves (Peer-to-Peer) to reduce SID workload. They only require turnover if the finder chooses to do so.

- **Decision Needed:** Should the system support a **"Peer-to-Peer Claim"** status where students meet up directly, or should we mandate that **ALL** found items must be surrendered to SID?

- **Answer:** The system should support a **"Peer-to-Peer Claim"**

### 4. Privacy & Contact Information

- **Current SRS/PRD:** Mentions displaying contact info or profile details.

- **SID Interview:** Explicitly stated **"Maybe we should not include [phone/ID numbers]... our number should only be known to people we know."**

- **Decision Needed:** shall we restrict communication **strictly** to in-app messaging and hide all phone numbers/IDs from the public feed?

- **Answer:** Users can optionally provide their phone number. If they choose to share it, the person who finds their lost item can contact them.

### 5. Photo Evidence Policy

- **SID Interview:** Specific rule regarding wallets: **Do not take photos of the contents (money/IDs)**, only the exterior. Verification happens via interview.

- **Action:** I will add this as a specific constraint in the "User Requirements" section. (No decision needed, just notifying you this will be added).

- **Answer:** yes go with that.

### 6. Authentication Method

- **Current SRS/PRD:** Mentions LDAP via Firebase.

- **ICTC Interview:** Specifies the university uses **SAML SSO** (backed by Active Directory).

- **Decision Needed:** Should the SRS list **SAML SSO** as the requirement (to satisfy ICTC), or keep it as generic **LDAP/University Email** integration (to satisfy your Firebase implementation plan)?

- **Answer:** list **SAML SSO** as the requirement (to satisfy ICTC)

### 
