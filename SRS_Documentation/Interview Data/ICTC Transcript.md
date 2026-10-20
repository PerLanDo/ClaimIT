**Part 1: Integration & Authentication**

1. What is the university's primary user authentication system? (e.g., LDAP, Active Directory, SSO). Is there a standard procedure or API for integrating new applications with it?
   
   **Answer:** We are using the SAML protocol for SSO, and behind it we use Active Directory with LDAP.
   
   I think it’s better to make it web-based rather than a mobile app, because regular users won’t use this system often. The only part that should be mobile-accessible is the admin side, since the admin will use the system more frequently.
   
   It’s better to make it web-based because you can use SSO directly. In a mobile app, you would need to rely on APIs for login or handle SSO with additional state management. On the web, the session state lets the system know you’re still the same user until you log out. With APIs, you usually rely on tokens, and they don’t maintain the same kind of state.
   
   The current system uses SAML SSO. It’s a simple PHP-based setup with Active Directory on the backend, which stores the records of students and faculty.
   
   The role-based feature in the app comes from Active Directory. Your role in the institution—whether you’re a student or faculty—is already recorded there. For faculty, they also register with a biometric system at our office, so these records are stored in Active Directory as well.
   
   However, if you want to add specialized roles—like an admin whose job is only to manage claimed items, or an admin whose role is to check items—you would use a separate database for that. It would have its own table specifically for these specialized roles.”

2. Are there any other existing campus systems that you would recommend this app integrate with? (e.g., Student Information System for contact details).
   
   **Answer:**  One system I would recommend integrating with your app is the notification system. This would be useful for the admin—for example, to notify them whenever there is a claimant for an item that has been posted.

**Part 2: Security & Data Privacy**

1. What are the university's specific data privacy policies we must adhere to, especially concerning student data and compliance with the Philippine Data Privacy Act (RA 10173)? 
   
   **Answer:** Regarding the legal terms, you can find the policy on the institute’s website. From a technical privacy perspective, you might hide the name of the claimant and the item from the admin. A best practice in IT is to encrypt sensitive information in the database. For example, you could encrypt student ID numbers or details of claimed items.
   
   This is especially important if the items are valuable, like a money claim of 200,000 PHP, because exposing that information could pose security risks. For general privacy and IT best practices, you should also follow the requirements of the admin. For instance, if the admin publishes a bulletin for claimed items, you might only include basic information without disclosing full details.
   
   Regarding the information added to the system, like ID numbers and mobile numbers, our school is not as strict as the EU because we don’t have third-party affiliations, such as with Google Ads. So using this information shouldn’t be a problem, since it’s necessary for the system’s operation.
   
   However, this information should not be visible to the admin. The system should handle it internally, with appropriate layers of protection. Disclosure would only be required if we were a profit organization using the data for selling purposes, in which case it should be stated in a privacy policy.

2. What are the standard requirements for data encryption, both for data stored on the server (at rest) and data transmitted over the network (in transit)?
   
   **Answer:** In the development environment, it’s best to use dummy data, because production data—like student information—cannot be distributed and should remain on the server. You can use tools like Faker libraries to simulate data for testing.
   
   Regarding encryption, you don’t need to encrypt names, since they are already accessible in the system. The data that should be encrypted includes ID numbers, passwords, and tokens. For other sensitive data, you should check with the admin or the security division, who are key stakeholders, and possibly ask users if they have specific concerns about their data.
   
   Keep in mind that excessive encryption can slow down the system, so encrypt only sensitive data. You should also encrypt data at the network layer. In the database, encryption should be strong enough that even someone with access cannot identify a user just by looking at a row. The goal is that accessing the data shouldn’t reveal who the user is.

3. What are your security requirements for an administrative portal? Is two-factor authentication (2FA) a standard requirement for staff access?
   
   **Answer:** We didn’t implement 2FA because we’re not fully established and currently rely on SMS blasts. Since the SMS system is down, we are developing a password request feature via email. My suggestion is to continue using standard login through SAML for now.

4. The system will involve users uploading photos. What are the university's policies regarding user-uploaded content and the need for security measures like virus scanning?
   
   **Answer:** Regarding virus scanning, modern browsers already have built-in protections to detect viruses. On the development side, the main requirement is to control what file types can be uploaded—for example, only allowing JPEGs rather than all file types. Uploaded files should be stored on a separate, containerized server with layers that isolate it from other systems, so even if there’s an issue, it won’t affect the rest of the system. Since images are non-executable and just readable, virus risks are minimal.
   
   For security, just use standard browsers with HTTPS. A bigger concern is storage. For example, during graduation applications, graduates may upload high-resolution photos far larger than needed. Since the final output only uses small photos, the system should enforce a file size limit. Without limits, an attacker could flood the system with large files, potentially filling the server and causing a denial-of-service issue. Well-designed systems always set default file size limits for uploads to prevent this.

5. What are the requirements for system logging and auditing? What level of detail is needed for tracking administrative actions and data access?
   
   

**Part 3: Infrastructure & Performance**

1. We are proposing a cloud-hosted solution using Google Firebase. Does the university have any policies or preferences regarding cloud hosting versus on-premise solutions?

2. The campus has over 12,000 potential users. What are your primary concerns regarding system scalability and performance, especially during peak periods like enrollment or exams?
   
   **Answer:**  The number of students shouldn’t be a problem for your system because it doesn’t require high availability. Unlike our MICA system, which students use during enrollment—where 12,000 students generate many simultaneous network calls—your system isn’t expected to handle such high traffic.
   
   However, if your system is connected to MICA’s central database, it could be affected by bottlenecks. If the other system is slow, your system may also experience delays, since it relies on the same central database.

3. Can you describe the campus network environment? Are there areas with known poor connectivity that might necessitate offline capabilities for the mobile app?
   
   **Answer:** Our campus has good Wi-Fi coverage, especially with the my.iit network. But in cases where the connection becomes slow, it’s helpful to implement a syncing method. You can use delayed uploads or caching, so if the device goes offline, the data is stored locally and then uploaded once the internet becomes available.
   
   Network coverage won’t be a big issue because the main stakeholder—the admin—has stable internet in their area.
   
   I also recommend using a database instead of an external integration like Google Firebase. Firebase works well for apps used by a wide, public audience, such as a dating app accessed from anywhere. But for an app that is only used inside MSU-IIT, a database is more appropriate. There have been cases where a student app used its own database, and when our Database Administrator blocked a user for illegal activity, that block didn’t apply to their app because it relied on Firebase. It becomes inconsistent.
   
   It’s better to simulate the actual production environment. Production uses a database and SAML SSO. SAML SSO may look technical, but in development you only need to know how to use Docker. Your frontend—whether Vue or React—can simply use an SSO client library, and your Docker setup will have the SSO server. You just configure your credentials and connect the two. You don’t need to worry about the internal protocol handling, because SAML is already the standard.
   
   So the recommendation is: use SAML SSO, use a database, and implement RBAC if you need specialized roles.

4. What are the university's standard procedures for data backup and disaster recovery? What would be the acceptable Recovery Time Objective (RTO) and Recovery Point Objective (RPO) for a system like this?
   
   **Answer:** What I know is that our Database Administrator handles rotating backups. I don’t have the full details because I’m a developer, but the backup and disaster recovery process is already part of the DBA’s responsibilities. As the developer of this app, you don’t need to focus too much on that area, because it’s managed at the server and database level by the admin.

5. The app will be available for both iOS and Android. Are there any specific mobile device management policies or compatibility requirements we should be aware of?

 **Answer:** Since this will be a web app, you don’t need to worry much about mobile device management policies. Once you finish developing the app, you will pass it to ICTC through a GitHub repository. I will review the code, then our head will also check it, and we’ll approve it from there.

If this were a mobile app, the process would be harder. Based on experience, getting an app approved in the App Store or Play Store takes weeks. But if you submit it directly to us, you would only need to pass the binary file or APK and we would host it internally.

That’s why, for simplicity and faster development, I recommend making it a web app instead of a mobile app, and making it responsive for different screen sizes. The system does not require high availability, so a responsive web setup is enough.


