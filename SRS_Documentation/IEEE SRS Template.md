

# 

# **Software Requirements Specification**

# **for**

# **\<Project Name\>**

**Version 1.0**

**Prepared by**

| \<name\> | \<e-mail\> | \<section\> |
| :---: | :---: | :---: |
| **\<name\>** | **\<e-mail\>** | **\<section\>** |
| **\<name\>** | **\<e-mail\>** | **\<section\>** |

| Faculty: | Mary Ann Gliefen A. Bermudo |
| ----: | :---- |
| **Course:** | **ISY108 Requirements Engineering** |
| **Date:** | **\<place the date of submission here\>** |

**Table of Contents**

**Table of Contents	[ii](#table-of-contents)**

**Revision History	[iii](#heading)**

**Executive Summary	[1](#executive-summary)**

**1\.**	**Introduction	[1](#introduction)**  
1.1	Purpose	[1](#purpose)  
1.2	Intended Audience and Reading Suggestions	[1](#intended-audience-and-reading-suggestions)

**2\.**	**Project Description	[1](#project-description)**  
2.1	Overview of the Current System	[1](#overview-of-the-current-system)  
2.2	Problem Statement	[2](#problem-statement)  
2.3	Objectives	[2](#objectives)  
2.4	Significance of the System	[2](#significance-of-the-system)  
2.5	Scope and Limitation	[2](#scope-and-limitation)  
2.6	Benchmark Systems	[1](#heading=h.6k5csp79f2ni)  
1.3	Salient Features of the System	[1](#heading=h.6k5csp79f2ni)  
2.6	Gantt Chart	[2](#benchmark-systems)

**3\.**	**Methodology	[2](#methodology)**  
3.1	Requirements	[2](#requirements)  
3.2	Design	[3](#design)  
3.3	Build prototype	[3](#heading=h.hho6stgjzh3b)  
3.4	User evaluation	[3](#heading=h.cv7z2enqqlwv)  
3.5	Refining prototype	[3](#heading=h.cv7z2enqqlwv)  
3.6	Implement and Maintenance	[3](#implementation-and-maintenance)

**4\.**	**Requirements Definition	[3](#requirements-definition)**  
4.1	Requirements Traceability Matrix	[3](#requirements-traceability-matrix)  
4.2	Proposed Activity Diagram	[3](#activity-diagram)

**5\.**	**Analysis and Design	[4](#analysis-and-design)**  
5.1	Use Case Diagram	[4](#use-case-diagram)  
5.2	Use Case Description	[4](#use-case-description)  
5.3	Sequence Diagram	[6](#sequence-diagram)  
5.4	Collaboration Diagram	[6](#collaboration-diagram)

**6\.**	**Data Models	[7](#data-models)**  
6.1	Entity-Relationship Diagram	[7](#entity-relationship-diagram)  
6.2	Class Diagram	[7](#class-diagram)  
6.3	Context Diagram	[7](#context-diagram)  
6.4	Component Diagram	[7](#component-diagram)  
6.5	Package Diagram	[8](#package-diagram)

**7\.**	**The System	[8](#the-system)**  
7.1	System Overview	[8](#system-overview)

**8\.**	**Other Nonfunctional Requirements	[9](#other-nonfunctional-requirements)**  
8.1	Performance Requirements	[9](#performance-requirements)  
8.2	Safety Requirements	[9](#safety-requirements)  
8.3	Security Requirements	[9](#security-requirements)  
8.4	Software Quality Attributes	[9](#software-quality-attributes)

**9\.**	**Results and Discussion	[10](#results-and-discussion)**

**10\.**	**Summary and Conclusion	[10](#summary-and-conclusion)**

**11\.**	**Recommendations	[10](#recommendations)**

**Appendix A: Working Bibliography	[10](#the-system)**

**Appendix B: Interview Results and Documentation	[10](#appendix-b:-interview-results-and-documentation)**

**Appendix C: Work Breakdown Structure	[10](#the-system)**

**Appendix D: Glossary**	

**Revision History**

| Name | Date | Reason For Changes | Version |
| :---- | :---- | :---- | :---- |
|  |  |  |  |
|  |  |  |  |

# **Executive Summary** {#executive-summary}

*\<A summary of all the essential information in the proposal so a busy executive can read it quickly and decide what parts of the plan to read in more depth. DON’T FORGET TO UPDATE THE TABLE OF CONTENTS.\>*

1. # **Introduction** {#introduction}

   1. ## **Purpose**  {#purpose}

*\<Identify the product whose software requirements are specified in this document, including the revision or release number. Describe the scope of the product that is covered by this SRS, particularly if this SRS describes only part of the system or a single subsystem.\>*

2. ## **Intended Audience and Reading Suggestions** {#intended-audience-and-reading-suggestions}

*\<Describe the different types of reader that the document is intended for, such as developers, project managers, marketing staff, users, testers, and documentation writers. Describe what the rest of this SRS contains and how it is organized. Suggest a sequence for reading the document, beginning with the overview sections and proceeding through the sections that are most pertinent to each reader type.\>*

2. # **Project Description** {#project-description}

*\<* *Introduction here\>*

1. ## **Overview of the Current System** {#overview-of-the-current-system}

*\<* *After the narrative of the overview of the current process or system, put the Activity diagram of the current system. Have a brief explanation of the diagram below it.\>*

1. Example of a figure label. (*figure label*)

   2. ## **Problem Statement** {#problem-statement}

*\<Describe the problems and issues encountered by the business in using the current system. Expound what you have gathered from the interview\>*

3. ## **Objectives** {#objectives}

   1. ### **General Objective**

*\<Place here the general objective of the study. Ex. To develop a prototype for …\>*

2. ### **Specific Objective**

*\<Place here the specific objectives necessary to achieve the general objective.\>*

4. ## **Significance of the System** {#significance-of-the-system}

*\<Place here the significance of the system and its impact to the business. Expound each.\>*

5. ## **Scope and Limitation** {#scope-and-limitation}

*\<Place here the scope and limitations of the system.\>*

6. ## **Benchmark Systems** {#benchmark-systems}

*\<List at least 10 related systems include descriptions and its features.\>*

7. ## **Salient Features of the System**

*\<Place here the salient or key features of the system.\>*

8. ## **Gantt Chart**

*\<Write an introduction here then, place your Gantt chart (table format) and provide a brief description below the table. Refer to the slides.\>*

1. Table Type Styles (sample)

|  | *Main Activities* | *Target date* | *Actual date* | *Status* |
| :---: | :---: | :---: | :---: | :---: |
| Project proposal | More table copya |  |  |  |
|  |  |  |  |  |

3. # **Methodology** {#methodology}

*\<Introduction: **Discuss** what software methodology you are using.*   
*Per item below, **discuss and expound** what tools, methods you used for said phase.\>*

1. ## **Requirements** {#requirements}

*\<What elicitation methods you used? Discuss each. Discuss and expound what tools, methods you used in developing the requirements specification.\>*  
*\<Discuss and expound the activities you have done in this phase. Include what tools, methods you used for requirements analysis and model. Ex. WRSPM, use case diagram\>*

2. ## **Design** {#design}

*\<Discuss the activities you have done in this phase. Discuss and expound what tools, methods you used for Design phase. Ex. Using modeling tools such as Sequence Diagram, Class Diagram, ERD\>*

3. ## **Build prototype**

*\<Discuss the activities you have done in this phase. Discuss and expound what tools, methods you used for Implementation phase.\>*

4. ## **User evaluation**

*\< Discuss and expound what tools, methods you used for testing phase. Based on discussion, which test is appropriate for your system and how you will go about it.\>*

5. ## **Implementation and Maintenance** {#implementation-and-maintenance}

*\<Discuss and expound what tools, methods you used for Implementation phase. Discussion here may include software and hardware requirements of the developer and user. \>*

4. # **Requirements Definition** {#requirements-definition}

*\<Introduction here. Provide a narrative about the functional and nonfunctional business requirements for the system. List all functions that the customer wants. Summarize the information you gathered from the interview. \>*

1. ## **Requirements Traceability Matrix** {#requirements-traceability-matrix}

*\<Provide an overview, then identify and list all end-user requirements and any work product. Use the format below. See sample RTM in the slides. \>*

2. Table Type Styles (sample title)

| RTM ID | *Requirements* | *Notes* | *Requestor* | *Request Date* | *Status* |
| :---: | :---: | :---: | :---: | :---: | :---: |
| copy | More table copya |  |  |  |  |

		a. Sample of a Table footnote. (*Table footnote*)

*\<Provide a narrative here.\>*

2. ## **Activity Diagram** {#activity-diagram}

*\<Write an introduction here then place the activity diagram of the proposed system. Have a brief explanation of the diagram below it.\>*

2. Example of a figure label. (*figure label*)

5. # **Analysis and Design** {#analysis-and-design}

*\<Introduction here.\>*

1. ## **Use Case Diagram** {#use-case-diagram}

*\<Provide an introduction.\>*  
*\<Place here the use case diagram. Have a brief explanation below it.\>*

2. ## **Use Case Description** {#use-case-description}

*\<Write an introduction then place here the use case descriptions.\>*

| Use Case ID: | Enter a unique numeric identifier for the Use Case. e.g. UC-1.2.1 |
| ----: | :---- |
| **Use Case Name:** | Enter a short name for the Use Case using an active verb phrase. e.g. Withdraw Cash  |
| **Actors:** | \[An actor is a person or other entity external to the software system being specified who interacts with the system and performs use cases to accomplish tasks. Different actors often correspond to different user classes, or roles, identified from the customer community that will use the product. Name the actor that will be initiating this use case (primary) and any other actors who will participate in completing the use case (secondary).\] |
| **Description:** | \[Provide a brief description of the reason for and outcome of this use case.\] |
| **Trigger:** | \[Identify the event that initiates the use case. This could be an external business event or system event that causes the use case to begin, or it could be the first step in the normal flow.\] |
| **Preconditions:** | \[List any activities that must take place, or any conditions that must be true, before the use case can be started. Number each pre-condition. e.g. Customer has active deposit account with ATM privileges Customer has an activated ATM card.\] |
| **Normal Flow:** | \[Provide a detailed description of the user actions and system responses that will take place during execution of the use case under **normal, expected** conditions. This dialog sequence will ultimately lead to accomplishing the goal stated in the use case name and description. Example: Customer inserts  ATM card Customer enters PIN  System prompts customer to enter language performance English or Spanish System validates if customer is in the bank network System prompts user to select transaction type Customer selects Withdrawal From Checking System prompts user to enter withdrawal amount … System ejects ATM card\] |
| **Alternative Flows:**  | \[Document **legitimate** branches from the main flow to handle special conditions (also known as extensions). For each alternative flow reference the branching step number of the normal flow and the condition which must be true in order for this extension to be executed.  e.g. Alternative flows in the *Withdraw Cash* transaction:  4a. In step 4 of the normal flow, if the customer is not in the bank network  System will prompt customer to accept network fee   Customer accepts  Use Case resumes on step 5  4b. In step 4 of the normal flow, if the customer is not in the bank network  System will prompt customer to accept network fee   Customer declines  Transaction is terminated Use Case resumes on step 9 of normal flow Note:  Insert a new row for each distinctive alternative flow.  \] |
| **Exceptions:** | \[Describe any anticipated **error conditions** that could occur during execution of the use case, and define how the system is to respond to those conditions.  e.g. Exceptions to the Withdraw Case transaction  2a.   In step 2 of the normal flow, if the customer enters and invalid PIN  Transaction is disapproved Message to customer to re-enter PIN Customer enters correct PIN Use Case resumes on step 3 of normal flow\]  |
| **Postconditions:** | \[Describe the state of the system at the conclusion of the use case execution. Should include both *minimal guarantees* (what must happen even if the actor’s goal is not achieved) and the *success guarantees* (what happens when the actor’s goal is achieved. Number each post-condition. e.g. Customer receives cash Customer account balance is reduced by the amount of the withdrawal and transaction fees\] |

| Use Case ID: | And so on… |
| ----: | :---- |
| **Use Case Name:** |  |
| **Actors:** |  |
| **Description:** |  |
| **Trigger:** |  |
| **Preconditions:** |  |
| **Normal Flow:** |   |
| **Alternative Flows:**  |   |
| **Exceptions:** |   |
| **Postconditions:** |   |

3. ## **Sequence Diagram** {#sequence-diagram}

*\<Write an introduction here then place the sequence diagrams. Have a brief explanation of the diagram below it.\>*

3. Example of a figure label. (*figure label*)

*\<Narrative for the diagram placed above.\>*

4. Example of a figure label. (*figure label*)

*\<And so on….\>*

4. ## **Collaboration Diagram** {#collaboration-diagram}

*\<Write an introduction here then place the collaboration diagrams. Have a brief explanation of the diagram below it.\>*

5. Example of a figure label. (*figure label*)

*\<Narrative for the diagram above.\>*

6. Example of a figure label. (*figure label*)

6. # **Data Models** {#data-models}

*\<Intro here. In this section place the ERD and class diagram. Provide a short description of each section and write a short narrative explaining the diagram after each of them.\>*

1. ## **Entity-Relationship Diagram** {#entity-relationship-diagram}

*\<Write an introduction here then place the ER diagram. Write a short narrative explaining the diagram.\>*

7. Example of a figure label. (*figure label*)

   2. ## **Class Diagram** {#class-diagram}

*\<Write an introduction here then place the class diagram. Write a short narrative explaining the diagram.\>*

8. Example of a figure label. (*figure label*)

   3. ## **Context Diagram** {#context-diagram}

*\<Write an introduction here then place the context diagram. Write a short narrative explaining the diagram.\>*

9. Example of a figure label. (*figure label*)

   4. ## **Component Diagram** {#component-diagram}

*\<Write an introduction here then place the component diagram. Write a short narrative explaining the diagram.\>*

10. Example of a figure label. (*figure label*)

    5. ## **Package Diagram** {#package-diagram}

*\<Write an introduction here then place the package diagram. Write a short narrative below explaining the diagram.\>*

11. Example of a figure label. (*figure label*)

7. # **The System** {#the-system}

*\<Intro Here*  
*This section gives the overall specifications and functional requirements of the software to be developed*.\>

1. ## **System Overview** {#system-overview}

*\<Provide an overview of the section here. This section gives an overall view of the main features and capabilities of the software.\>*

### **System Features**

*\<Intro here\>*  
*\<Remember the difference between system feature and function. Place here the main features of the system then describe the functions in the next section. Example: Manage Users, Manage Registration, etc.\>*

1. #### ***System Feature 1***

*\<Don’t really say “System Feature 1.” State the feature name in just a few words.\>*  
*\<Provide a description of the feature.\>*

2. #### ***System Feature 2***

*\<Don’t really say “System Feature 2.” State the feature name in just a few words.\>*  
*\<Provide a description of the feature.\>*

3. #### ***System Feature 3 (and so on)***

*\<Don’t really say “System Feature 3.” State the feature name in just a few words.\>*  
*\<Provide a description of the feature.\>*

2. ### **System Functions**

*\<Provide an overview here. This section provides a listing of all the functions that must be performed or delivered by the system, and a description of each.  Include screen designs to help visualize the function being discussed.  Usually, the functions are based on the menu and toolbar options. Be detailed in this section.\>*

1. #### ***System Function 1***

   *\< Provide a description of the function.\>*

   *\<Screen Designs/Screen Shots of the function\>*

   2. #### ***System Function 2***

   *\< Provide a description of the function.\>*

   *\<Screen Designs/Screen Shots of the function\>*

      3. #### ***System Function 3 (and so on)***

   *\<Provide a description of the function.\>*

   *\<Screen Designs/Screen Shots of the function\>*

8. # **Other Nonfunctional Requirements** {#other-nonfunctional-requirements}

   1. ## **Performance Requirements** {#performance-requirements}

*\<If there are performance requirements for the product under various circumstances, state them here and explain their rationale, to help the developers understand the intent and make suitable design choices. Specify the timing relationships for real time systems. Make such requirements as specific as possible. You may need to state performance requirements for individual functional requirements or features.\>*

2. ## **Safety Requirements** {#safety-requirements}

*\<Specify those requirements that are concerned with possible loss, damage, or harm that could result from the use of the product. Define any safeguards or actions that must be taken, as well as actions that must be prevented. Refer to any external policies or regulations that state safety issues that affect the product’s design or use. Define any safety certifications that must be satisfied.\>*

3. ## **Security Requirements** {#security-requirements}

*\<Specify any requirements regarding security or privacy issues surrounding use of the product or protection of the data used or created by the product. Define any user identity authentication requirements. Refer to any external policies or regulations containing security issues that affect the product. Define any security or privacy certifications that must be satisfied.\>*

4. ## **Software Quality Attributes** {#software-quality-attributes}

*\<Specify any additional quality characteristics for the product that will be important to either the customers or the developers. Some to consider are: adaptability, availability, correctness, flexibility, interoperability, maintainability, portability, reliability, reusability, robustness, testability, and usability. Write these to be specific, quantitative, and verifiable when possible. At the least, clarify the relative preferences for various attributes, such as ease of use over ease of learning.\>*

9. # **Results and Discussion** {#results-and-discussion}

\<*This section provides the results and discussion. After you have done testing your software, present the results here and discuss its interpretation. Provide graphical representation of the results to support your discussion.\>*

10. # **Summary and Conclusion** {#summary-and-conclusion}

\<*This section gives an assessment of what happened in this project.  It presents **explanations and justifications** on **how the objectives** of the project **were met**, to what extent and why some objectives were not met.\>*

11. # **Recommendations** {#recommendations}

**Appendix A: Working Bibliography**

*\<List any other documents or Web addresses to which this SRS refers. These may include user interface style guides, contracts, standards, system requirements specifications, use case documents, or a vision and scope document. Provide enough information so that the reader could access a copy of each reference, including title, author, version number, date, and source or location. Please use APA format. \>*

*\<Working Bibliography.* List all references – APA7 citation reference\>

\<DON’T FORGET TO UPDATE THE TABLE OF CONTENTS\>

**Appendix B: Interview Results and Documentation**

*\<Place interview questions and per respondent’s transcript. Include documentation – pictures during the interview\>*

**Appendix C: Work Breakdown Structure**

*\<Place complete WBS, align main phases using prototyping method\>*

**Appendix D: Glossary**

*\<Define all the terms necessary to properly interpret the SRS, including acronyms and abbreviations. You may wish to build a separate glossary that spans multiple projects or the entire organization, and just include terms specific to a single project in each SRS.\>*

