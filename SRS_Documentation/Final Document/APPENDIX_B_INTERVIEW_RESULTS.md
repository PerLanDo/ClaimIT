# Appendix B: Interview Results and Documentation

This appendix contains the transcripts of interviews conducted with key stakeholders to gather requirements for the ClaimIT system.

## B.1 Interview with Information and Communication Technology Center (ICTC)

**Subject:** System Integration, Security, and Infrastructure Standards
**Date:** [Insert Date]
**Interviewer:** [Insert Name]
**Respondent:** ICTC Representative

**Part 1: Integration & Authentication**

**Q1: What is the university's primary user authentication system? Is there a standard procedure or API for integrating new applications with it?**
**ICTC:** We are using the SAML protocol for SSO, and behind it we use Active Directory with LDAP. I think it’s better to make it web-based rather than a mobile app, because regular users won’t use this system often. The only part that should be mobile-accessible is the admin side. It’s better to make it web-based because you can use SSO directly. On the web, the session state lets the system know you’re still the same user until you log out.

**Q2: Are there any other existing campus systems that you would recommend this app integrate with?**
**ICTC:** One system I would recommend integrating with your app is the notification system. This would be useful for the admin—for example, to notify them whenever there is a claimant for an item that has been posted.

**Part 2: Security & Data Privacy**

**Q3: What are the university's specific data privacy policies we must adhere to?**
**ICTC:** Regarding the legal terms, you can find the policy on the institute’s website. From a technical privacy perspective, you might hide the name of the claimant and the item from the admin. A best practice in IT is to encrypt sensitive information in the database. For example, you could encrypt student ID numbers or details of claimed items.

**Q4: What are the standard requirements for data encryption?**
**ICTC:** In the development environment, it’s best to use dummy data. Regarding encryption, you don’t need to encrypt names, since they are already accessible in the system. The data that should be encrypted includes ID numbers, passwords, and tokens.

**Q5: What are your security requirements for an administrative portal?**
**ICTC:** We didn’t implement 2FA because we’re not fully established and currently rely on SMS blasts. My suggestion is to continue using standard login through SAML for now.

**Q6: What are the university's policies regarding user-uploaded content?**
**ICTC:** Regarding virus scanning, modern browsers already have built-in protections. The main requirement is to control what file types can be uploaded—for example, only allowing JPEGs. Uploaded files should be stored on a separate, containerized server. The system should enforce a file size limit to prevent denial-of-service issues.

**Part 3: Infrastructure & Performance**

**Q7: What are your primary concerns regarding system scalability and performance?**
**ICTC:** The number of students shouldn’t be a problem for your system because it doesn’t require high availability. Unlike our MICA system, your system isn’t expected to handle such high traffic.

**Q8: Can you describe the campus network environment?**
**ICTC:** Our campus has good Wi-Fi coverage. But in cases where the connection becomes slow, it’s helpful to implement a syncing method. I also recommend using a database instead of an external integration like Google Firebase. Firebase works well for public apps, but for an app used only inside MSU-IIT, a database is more appropriate.

**Q9: What are the university's standard procedures for data backup?**
**ICTC:** Our Database Administrator handles rotating backups. As the developer, you don’t need to focus too much on that area, because it’s managed at the server and database level by the admin.

**Q10: Are there any specific mobile device management policies?**
**ICTC:** Since this will be a web app, you don’t need to worry much about mobile device management policies. Once you finish developing the app, you will pass it to ICTC through a GitHub repository.

---

## B.2 Interview with Security and Investigation Division (SID)

**Subject:** Current Lost and Found Procedures and Requirements
**Date:** [Insert Date]
**Interviewer:** [Insert Name]
**Respondent:** SID Officer

**Part 1: Understanding the Current Process**

**Q1: Could you walk me through the step-by-step process of turnover and claiming?**
**SID:** If someone finds an item and turns it over, we record it. We get the name of the finder, the item, and if it is a wallet, we list the things inside. For claiming, we ask them about the item (color, contents, when/where lost). If answers match, we ask for ID, record it in the logbook, and get their signature.

**Q2: How long does the inquiry process usually take?**
**SID:** If the claimant or the finder is already here, the maximum processing time is about 2 minutes because it already has a record.

**Q3: How do you handle communication between shifts?**
**SID:** For incoming personnel, we turn over the logbook and tell them the items turned over during the schedule. We accommodate claims from 7am to 9pm, Monday to Friday.

**Part 2: Identifying Pain Points & Challenges**

**Q4: What are the biggest challenges with the logbook system?**
**SID:** So far, we haven’t encountered any challenges in recording them, since it is easy to do.

**Q5: Do you think it is ideal to post an image when reporting a found item?**
**SID:** It is okay to take a photo of the item itself. However, for a wallet, we should not take a picture of the contents because it is sensitive information. We only take a picture of the wallet itself.

**Q6: How much time is dedicated to managing lost and found?**
**SID:** During big events (gym, symposiums, concerts), many people come here. During those times, we spend most of our time handling lost and found matters. On normal days, only a few people come.

**Q7: What issues do you encounter with item verification?**
**SID:** There are cases of people being dishonest. Some try to claim items that are not theirs. We ask carefully and explain to them if the answers don't match.

**Q8: What is the policy for unclaimed items?**
**SID:** Unclaimed items remain for one year. Then we extend for two weeks and display them. If still unclaimed, we donate them to the Knowledge and Technology Transfer Office (KTTO) for calamity victims.

**Part 3: Desired Features & Ideal Solution**

**Q9: Is it possible for students to keep the found item and just post it on the app?**
**SID:** For us, we ask students to turn it over, but we can't force them. If they keep the item and post it in the app, it won’t be a problem for us. It is even okay if they allow the finder to handle the claim; this could reduce our workload.

**Q10: How would an automated notification system impact your workload?**
**SID:** It will be a big help. If the user is notified that their item matches, they will be able to come to our office to claim it. This app will also help because sometimes students are shy to come to the office.

**Q11: Is it okay to display the phone number/ID number of the user?**
**SID:** Maybe we should not include that. It’s not really necessary, because our number should only be known to people we know.
