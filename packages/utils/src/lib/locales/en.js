const strings = {
  en: {
    cancelButton: "Cancel",
    nextButton: "Next",
    signInButton: "Sign In",
    declineButton: "Decline",
    approveButton: "Approve",
    accountButton: "Creating account",
    backButton: "Back",
    verifyButton: "Verify",
    confirmButton: "Confirm",
    loginButton: "Login",
    logoutButton: "Logout",
    registerButton: "Register",
    loginLink: "Login",
    proceedButton: "Proceed",
    closeButton: "Close",
    /* Create account */
    invalidEntry: "Value is required",
    invalidPhoneNumber: "Invalid or existing phone number",
    invalidRegion: "Select region code",
    invalidEmail: "Invalid or existing email",
    usernameExists: "Invalid username.",
    usernameError: "Username is too short (under {{length}} characters)",
    usernameError2: "Spaces are not allowed in the username",
    invalidPassword: "Password confirmation failed",
    passwordQuality: "Password conditions failed",
    createAccountTitle: "Create an account",
    firstNamePlaceholder: "First Name",
    lastNamePlaceholder: "Last Name",
    usernamePlaceholder: "Username",
    emailPlaceholder: "Email",
    emailPrompt: "This email will be used for two-factor verification.",
    phoneNumberPlaceholder: "Phone Number",
    phoneNumberPlaceholder2: "555_555_555",
    phonePrompt: "This number will be used for two-factor verification.",
    passwordPlaceholder: "Password",

    confirmPlaceholder: "Confirm Password",
    existingAccount: "Have an account?",
    acceptTerms: "Please approve terms of use to continue.",

    finalizeText: "This process may take a few seconds",
    noThanks: "No thanks",

    /* Landing page */
    loginWelcomeMessage: "My Prifina",
    loginLandingPage: "Login to access your personal data cloud.",
    welcomeMessage: "Hello",
    landingPage:
      "We are a team working on the future of personal applications. That's why we created this personal cloud environment that will help you implement your boldest ideas while allowing individuals to keep their data.",
    landingPageInfo: "Fill in the form on the right",

    /* Terms & conditions */
    termsTitle: "Prifina's Terms of Use",
    termsText:
      "THESE TERMS AND CONDITIONS CREATE A CONTRACT BETWEEN YOU AND PRIFINA (THE “AGREEMENT”). PLEASE READ THE AGREEMENT CAREFULLY. TO CONFIRM YOUR UNDERSTANDING AND ACCEPTANCE OF THE AGREEMENT, CLICK “AGREE”.",
    termsLastUpdated: "Last Updated: February 8, 2022",
    introductionTitle: "1. INTRODUCTION TO PRIFINA’S SERVICES",
    introductionText:
      "This Agreement governs your use of Prifina’s services (“Services”), applications (“Apps”), and other in-app services (“Content”). Services may be offered through Apps by Prifina or a third party, but any use of the Services, Apps, and Content are governed by this Agreement.",

    serviceTitle: "2. USING PRIFINA’S SERVICES",
    accountSubtitle: "2.1. Prifina Account",
    accountText: `Each end-user must open a Prifina account by providing the required information to Prifina (a Prifina Account) prior to using the Services. Access to and use of the Services is prohibited without a Prifina Account.
      Your Prifina Account is valuable, and you are responsible for maintaining its confidentiality and security. Prifina is not responsible for any losses arising from the unauthorized use of your Prifina Account.
      If you suspect that your Prifina Account has been compromised, please contact the Prifina team at info@prifina.com
      You must be age 13 to create a Prifina Account and use our Services.`,
    dataCloudSubtitle: "2.2. Your Personal Data Cloud",
    dataCloudText:
      "Upon opening a Prifina Account, Prifina automatically creates a “Personal Data Cloud” account in your name on Amazon Web Services. All your data is stored in your Personal Data Cloud. ",
    privacySubtitle: "2.3. Privacy",
    privacyText:
      "Your use of our Services is subject to Prifina’s Privacy Policy, which is available at https://www.prifina.com/legal/privacy/.",
    servicesAndContentSubtitle: "2.4. Services and Content Usage Rules",
    servicesAndContentText:
      "Your use of the Services and Content must follow the rules set forth in this section (“Usage Rules”). Any other use of the Services and Content is a material breach of this Agreement. Prifina may monitor your use of the Services and Content to ensure that you are following these Usage Rules.",
    allServicesSubtitle: "2.4.1. All Services:",
    allServicesText: `- You may use the Services and Content only for personal, noncommercial purposes (except as set forth in section 4 below).
     - Prifina’s delivery of Content does not transfer any commercial or promotional use rights to you, and does not constitute a grant or waiver of any rights of the copyright owners.
     - You may not tamper with or circumvent any security technology included with the Services.
     - You may access our Services only using Prifina’s software, and may not modify or use modified versions of such software.`,
    appStoreContentSubtitle: "2.4.2. App Store Content:",
    appStoreContentText: `- The term “App” includes apps, in-app purchases, extensions (such as keyboards), stickers, and subscriptions made available in an app.
     - You can use Apps on any device that you own or control.`,
    dataStorageSubtitle: "2.5. Data Storage Guidelines",
    dataStorageText: `Your use of the Services, Apps and Content through your Account must comply with the Data Storage Guidelines, which may be updated from time to time. You may not use Prifina’s Services to:
     - store/upload any materials that you do not have permission, right or license to use;
     - store/upload objectionable, offensive, unlawful, deceptive, or harmful content;
     - store/upload personal, private, or confidential information belonging to others;
     - impersonate or misrepresent your affiliation with another person or entity;
     - store/upload or transmit spam, including but not limited to unsolicited or unauthorized advertising, promotional materials, or informational announcements;
     - plan or engage in any illegal, fraudulent, or manipulative activity.
     `,
    yourOwnDataTitle: "3. YOU OWN YOUR DATA",
    yourOwnDataText: `3.1. You are the legal owner of all of the data which you collect in your Personal Data Cloud.
     3.2. However, user-held data ownership does not include data covered the Data Storage guidelines (Section 2.5 above).`,
    appStoreTermsTitle: "4. ADDITIONAL APP STORE TERMS",
    appStoreContentSubtitle: "4.1. License of App Store Content",
    appStoreContentText:
      "The third-party application provider or Prifina as applicable (“Licensor”) reserves all rights in and to the  Application not expressly granted to you under this Agreement.  The license to the app provided by the Licensor is governed by the Licensed Application End User License Agreement (“Standard EULA”) set forth below, unless Prifina or the App Provider provides an overriding custom license agreement (“Custom EULA”). You acknowledge and agree that Prifina is a third-party beneficiary of the Standard EULA or Custom EULA applicable to each Third-Party App and may therefore enforce such agreement.",
    appMaintenanceSubtitle: "4.2. App Maintenance and Support",
    appMaintenanceText: `Prifina is responsible for providing maintenance and support for Prifina Apps only. 
     Third-Party App Providers are responsible for providing maintenance and support for such Third-Party Apps.
     `,
    endUserLicenseSubtitle:
      "4.3. Licensed Application End User License Agreement",
    endUserLicenseText:
      "Apps made available through the App Store are licensed, not sold, to you. Your license to each App is subject to your prior acceptance of either this Licensed Application End User License Agreement (“Standard EULA”), or a custom end user license agreement between you and the Application Provider (“Custom EULA”), if one is provided. Your license to any Prifina App under this Standard EULA or Custom EULA is granted by Prifina, and your license to any Third Party App under this Standard EULA or Custom EULA is granted by the Application Provider of that Third-Party App. Any App that is subject to this Standard EULA is referred to herein as the “Licensed Application.” The Application Provider or Prifina as applicable (“Licensor”) reserves all rights in and to the Licensed Application not expressly granted to you under this Standard EULA.",
    scopeOfLicenseSubtitle: "4.3.a. Scope of License",
    scopeOfLicenseText:
      "Licensor grants you a nontransferable license to use the Licensed Application. The terms of this Standard EULA will govern any content, materials, or services accessible from or purchased within the Licensed Application as well as upgrades provided by Licensor that replace or supplement the original Licensed Application, unless such upgrade is accompanied by a Custom EULA. You may not transfer, redistribute or sublicense the Licensed Application. You may not copy (except as permitted by this license), reverse-engineer, disassemble, attempt to derive the source code of, modify, or create derivative works of the Licensed Application, any updates, or any part thereof (except as and only to the extent that any foregoing restriction is prohibited by applicable law or to the extent as may be permitted by the licensing terms governing the use of any open-sourced components included with the Licensed Application).",
    useOfDataSubtitle: "4.3.b. Use of Data",
    useOfDataText:
      "Licensor may not access or use your data unless you provide explicit consent for the Licensor to do so.  Such consent may be withheld or terminated by you, after which point the Licensor shall discontinue their use of and access to your data.",
    terminationSubtitle: "4.3.c. Termination",
    terminationText:
      "This Standard EULA is effective until terminated by you or Licensor. Your rights under this Standard EULA will terminate automatically if you fail to comply with any of its terms.",
    externalServicesSubtitle: "4.3.d. External Services",
    externalServicesText:
      'The Licensed Application may enable access to Licensor’s and/or third-party services and websites (collectively and individually, "External Services"). You agree to use the External Services at your sole risk. Licensor is not responsible for examining or evaluating the content or accuracy of any third-party External Services, and shall not be liable for any such third-party External Services. Data displayed by any Licensed Application or External Service, including but not limited to financial, medical and location information, is for general informational purposes only and is not guaranteed by Licensor or its agents. You will not use the External Services in any manner that is inconsistent with the terms of this Standard EULA or that infringes the intellectual property rights of Licensor or any third party. You agree not to use the External Services to harass, abuse, stalk, threaten or defame any person or entity, and that Licensor is not responsible for any such use. External Services may not be available in all languages or in your Home Country, and may not be appropriate or available for use in any particular location. To the extent you choose to use such External Services, you are solely responsible for compliance with any applicable laws. Licensor reserves the right to change, suspend, remove, disable or impose access restrictions or limits on any External Services at any time without notice or liability to you.',
    noWarrantySubtitle: "4.3.e. NO WARRANTY",
    noWarrantyText:
      'YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT USE OF THE LICENSED APPLICATION IS AT YOUR SOLE RISK. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE LICENSED APPLICATION AND ANY SERVICES PERFORMED OR PROVIDED BY THE LICENSED APPLICATION ARE PROVIDED "AS IS" AND “AS AVAILABLE,” WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, AND LICENSOR HEREBY DISCLAIMS ALL WARRANTIES AND CONDITIONS WITH RESPECT TO THE LICENSED APPLICATION AND ANY SERVICES, EITHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES AND/OR CONDITIONS OF MERCHANTABILITY, OF SATISFACTORY QUALITY, OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY, OF QUIET ENJOYMENT, AND OF NONINFRINGEMENT OF THIRD-PARTY RIGHTS. NO ORAL OR WRITTEN INFORMATION OR ADVICE GIVEN BY LICENSOR OR ITS AUTHORIZED REPRESENTATIVE SHALL CREATE A WARRANTY. SHOULD THE LICENSED APPLICATION OR SERVICES PROVE DEFECTIVE, YOU ASSUME THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES OR LIMITATIONS ON APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO THE ABOVE EXCLUSION AND LIMITATIONS MAY NOT APPLY TO YOU.',
    limitationOfLiabilitySubtitle: "4.3.f. Limitation of Liability",
    limitationOfLiabilityText:
      "TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL LICENSOR BE LIABLE FOR PERSONAL INJURY OR ANY INCIDENTAL, SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE LICENSED APPLICATION, HOWEVER CAUSED, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, OR OTHERWISE) AND EVEN IF LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU. In no event shall Licensor’s total liability to you for all damages (other than as may be required by applicable law in cases involving personal injury) exceed the amount of fifty dollars ($50.00). The foregoing limitations will apply even if the above-stated remedy fails of its essential purpose.",
    gSubtitle: "4.3.g.",
    gText: `You may not use or otherwise export or re-export the Licensed Application except as authorized by United States law and the laws of the jurisdiction in which the Licensed Application was obtained. In particular, but without limitation, the Licensed Application may not be exported or re-exported (a) into any U.S.-embargoed countries or (b) to anyone on the U.S. Treasury Department's Specially Designated Nationals List or the U.S. Department of Commerce Denied Persons List or Entity List. By using the Licensed Application, you represent and warrant that you are not located in any such country or on any such list. You also agree that you will not use these products for any purposes prohibited by United States law, including, without limitation, the development, design, manufacture, or production of nuclear, missile, or chemical or biological weapons.`,
    hSubtitle: "4.3.h.",
    hText:
      'The Licensed Application and related documentation are "Commercial Items", as that term is defined at 48 C.F.R. §2.101, consisting of "Commercial Computer Software" and "Commercial Computer Software Documentation", as such terms are used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202, as applicable. Consistent with 48 C.F.R. §12.212 or 48 C.F.R. §227.7202-1 through 227.7202-4, as applicable, the Commercial Computer Software and Commercial Computer Software Documentation are being licensed to U.S. Government end users (a) only as Commercial Items and (b) with only those rights as are granted to all other end users pursuant to the terms and conditions herein. Unpublished rights are reserved under the copyright laws of the United States.',
    miscellaneousTitle: "5. MISCELLANEOUS TERMS APPLICABLE TO ALL SERVICES",
    definitionSubtitle: "5.1. Definition of Prifina",
    definitionText:
      "“Prifina” means Prifina Inc., located at One Market Street, San Francisco, California.",
    contractChangesSubtitle: "5.2. Contract Changes",
    contractChangesText:
      "Prifina reserves the right at any time to modify this Agreement and to add new or additional terms or conditions on your use of the Services. Such modifications and additional terms and conditions will be effective immediately and incorporated into this Agreement. Your continued use of the Services will be deemed acceptance thereof.",
    thirdPartySubtitle: "5.3. Third-Party Materials",
    thirdPartyText:
      "Prifina is not responsible or liable for third-party materials included within or linked to the Services.",
    intellectualPropertySubtitle: "5.4. Intellectual Property",
    intellectualPropertyText: `You agree that the Content and Services, including but not limited to graphics, user interface, audio clips, video clips, editorial content, and the scripts and software used to implement the Services, contain proprietary information and material that is owned by Prifina and/or its licensors, and is protected by applicable intellectual property and other laws, including but not limited to copyright. You agree that you will not use such proprietary information or materials in any way whatsoever except for use of the Services for personal, noncommercial uses in compliance with this Agreement. No portion of the Services may be reproduced in any form or by any means, except as expressly permitted by this Agreement. You agree not to modify, rent, loan, sell, or distribute the Services in any manner, and you shall not exploit the Services in any manner not expressly authorized.
     The Prifina name, the Prifina logo, and other Prifina trademarks, service marks, graphics, and logos used in connection with the Services are trademarks or registered trademarks of Prifina in the U.S. and other countries throughout the world. You are granted no right or license with respect to any of the aforesaid trademarks.
     `,
    suspensionOfServicesSubtitle: "5.5. Termination and Suspension of Services",
    suspensionOfServicesText: `If you fail, or Prifina suspects that you have failed, to comply with any of the provisions of this Agreement, Prifina may, without notice to you: (i) terminate this Agreement, and you will remain liable for all amounts due up to and including the date of termination; and/or (ii) terminate your license to the software; and/or (iii) preclude your access to the Services.
     Prifina further reserves the right to modify, suspend, or discontinue the Services at any time with or without notice to you, and Prifina will not be liable to you or to any third party should it exercise such rights.
     `,
    warrantyDisclaimerSubtitle:
      "5.6. Disclaimer of Warranties; Liability Limitation",
    warrantyDisclaimerText: `PRIFINA DOES NOT GUARANTEE, REPRESENT, OR WARRANT THAT YOUR USE OF THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, AND YOU AGREE THAT FROM TIME TO TIME PRIFINA MAY REMOVE THE SERVICES FOR INDEFINITE PERIODS OF TIME, CANCEL THE SERVICES AT ANY TIME, OR OTHERWISE LIMIT OR DISABLE YOUR ACCESS TO THE SERVICES WITHOUT NOTICE TO YOU.
       YOU EXPRESSLY AGREE THAT YOUR USE OF, OR INABILITY TO USE, THE SERVICES IS AT YOUR SOLE RISK. THE SERVICES AND ALL CONTENT DELIVERED TO YOU THROUGH THE SERVICES ARE (EXCEPT AS EXPRESSLY STATED BY PRIFINA) PROVIDED "AS IS" AND "AS AVAILABLE" FOR YOUR USE, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. BECAUSE SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES, THE ABOVE EXCLUSION OF IMPLIED WARRANTIES MAY NOT APPLY TO YOU.
       IN NO CASE SHALL PRIFINA, ITS DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, OR LICENSORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF ANY OF THE SERVICES OR FOR ANY OTHER CLAIM RELATED IN ANY WAY TO YOUR USE OF THE SERVICES AND/OR CONTENT, INCLUDING, BUT NOT LIMITED TO, ANY ERRORS OR OMISSIONS IN ANY CONTENT, OR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES, EVEN IF ADVISED OF THEIR POSSIBILITY. BECAUSE SOME COUNTRIES, STATES OR JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR THE LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, IN SUCH COUNTRIES, STATES OR JURISDICTIONS, PRIFINA'S LIABILITY SHALL BE LIMITED TO THE EXTENT SUCH LIMITATION IS PERMITTED BY LAW.
       PRIFINA SHALL USE REASONABLE EFFORTS TO PROTECT INFORMATION SUBMITTED BY YOU IN CONNECTION WITH THE SERVICES, BUT YOU AGREE THAT YOUR SUBMISSION OF SUCH INFORMATION IS AT YOUR SOLE RISK, AND YOU HEREBY RELEASE PRIFINA FROM ANY AND ALL LIABILITY TO YOU FOR ANY LOSS OR LIABILITY RELATING TO SUCH INFORMATION IN ANY WAY.
       PRIFINA DOES NOT REPRESENT OR GUARANTEE THAT THE SERVICES WILL BE FREE FROM LOSS, CORRUPTION, ATTACK, VIRUSES, INTERFERENCE, HACKING, OR OTHER SECURITY INTRUSION, AND YOU HEREBY RELEASE PRIFINA FROM ANY LIABILITY RELATING THERETO. YOU SHALL BE RESPONSIBLE FOR BACKING UP YOUR OWN SYSTEM, INCLUDING ANY CONTENT ACQUIRED OR RENTED THROUGH THE SERVICES.
       PRIFINA IS NOT RESPONSIBLE FOR DATA CHARGES YOU MAY INCUR IN CONNECTION WITH YOUR USE OF THE SERVICES.
       `,
    waiverSubtitle: "5.7. Waiver and Indemnity",
    waiverText: `BY USING THE SERVICES, YOU AGREE, TO THE EXTENT PERMITTED BY LAW, TO INDEMNIFY AND HOLD PRIFINA, ITS DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, AND LICENSORS HARMLESS WITH RESPECT TO ANY CLAIMS ARISING OUT OF YOUR BREACH OF THIS AGREEMENT, YOUR USE OF THE SERVICES, OR ANY ACTION TAKEN BY PRIFINA AS PART OF ITS INVESTIGATION OF A SUSPECTED VIOLATION OF THIS AGREEMENT OR AS A RESULT OF ITS FINDING OR DECISION THAT A VIOLATION OF THIS AGREEMENT HAS OCCURRED. YOU AGREE THAT YOU SHALL NOT SUE OR RECOVER ANY DAMAGES FROM PRIFINA, ITS DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, AND LICENSORS AS A RESULT OF ITS DECISION TO REMOVE OR REFUSE TO PROCESS ANY INFORMATION OR CONTENT, TO WARN YOU, TO SUSPEND OR TERMINATE YOUR ACCESS TO THE SERVICES, OR TO TAKE ANY OTHER ACTION DURING THE INVESTIGATION OF A SUSPECTED VIOLATION OR AS A RESULT OF PRIFINA'S CONCLUSION THAT A VIOLATION OF THIS AGREEMENT HAS OCCURRED. THIS WAIVER AND INDEMNITY PROVISION APPLIES TO ALL VIOLATIONS DESCRIBED IN OR CONTEMPLATED BY THIS AGREEMENT.`,
    governingLawSubtitle: "5.8. Governing Law and Jurisdiction",
    governingLawText:
      "Except to the extent expressly provided in the following paragraph, this Agreement and the relationship between you and Prifina shall be governed by the laws of the State of California, excluding its conflicts of law provisions. You and Prifina agree to submit to the personal and exclusive jurisdiction of the courts located within the county of San Francisco, California, to resolve any dispute or claim arising from this Agreement. Specifically excluded from application to this Agreement is that law known as the United Nations Convention on the International Sale of Goods.",
    otherProvisionsSubtitle: "5.9. Other Provisions",
    otherProvisionsText: `This Agreement constitutes the entire agreement between you and Prifina and governs your use of the Services, superseding any prior agreements with respect to the same subject matter between you and Prifina. You also may be subject to additional terms and conditions that may apply when you use affiliate services, third-party content, third-party software, or additional services. If any part of this Agreement is held invalid or unenforceable, that portion shall be construed in a manner consistent with applicable law to reflect, as nearly as possible, the original intentions of the parties, and the remaining portions shall remain in full force and effect. Prifina's failure to enforce any right or provisions in this Agreement will not constitute a waiver of such or any other provision. Prifina will not be responsible for failures to fulfill any obligations due to causes beyond its control.
     You agree to comply with all local, state, federal, and national laws, statutes, ordinances, and regulations that apply to your use of the Services. Your use of the Services may also be subject to other laws. Risk of loss for all electronically delivered Transactions passes to the acquirer upon electronic transmission to the recipient. No Prifina employee or agent has the authority to vary this Agreement.
     Prifina may notify you with respect to the Services by sending an email message to your email address or a letter via postal mail to your mailing address, or by a posting on the Services. Notices shall become effective immediately. Prifina may also contact you by email or push notification to send you additional information about the Services.
     You hereby grant Prifina the right to take steps Prifina believes are reasonably necessary or appropriate to enforce and/or verify compliance with any part of this Agreement. You agree that Prifina has the right, without liability to you, to disclose any data and/or information to law enforcement authorities, government officials, and/or a third party, as Prifina believes is reasonably necessary or appropriate to enforce and/or verify compliance with any part of this Agreement (including but not limited to Prifina’s right to cooperate with any legal process relating to your use of the Services, and/or a third-party claim that your use of the Services is unlawful and/or infringes such third party's rights).
     `,

    formError: "Form has errors",

    /* Phone verification */
    codeDigitsError: "Only numbers are allowed",
    codeLengthError: "The code must be six digits long",
    verificationTitle: "Setup your two-step verification method",
    phoneVerificationTitle: "Setup your phone verification",
    phoneVerificationText:
      "Please provide your email address and phone number in order to keep your account secure",
    phoneVerificatioSent: "Phone number verification code was sent.",
    codePropmt: "Enter the code here",
    codeMissing: "Didn't receive the code?",
    sendAgainLinkText: "Click here.",
    invalidCode: "Incorrect code, please enter the correct code.",
    verifySupportLink: "Still didn't receive the code",
    /* Email verification */
    emailVerificationTitle: "Setup email verification",
    emailVerificationText:
      "Please provide your email address and phone number to keep your account secure",
    emailMissing: "Didn't receive the code?",
    emailVerificatioSent: "Email verification code was sent.",
    /* Decline dialog */
    declineTitle: "Decline Prifina’s Terms of Use?",
    declineText:
      "By declining Prifina's Terms of Use you will not be able to use the Prifina application.",
    /* Login */
    loginPage: "Login to your account",
    invalidLogin: "Incorrect username or password.",
    forgotUsername: "Forgot username?",
    forgotPassword: "Forgot password?",
    createAccount: "Create account",
    confirmTitle: "Secure login",
    authConfirmTitle: "Enter authentication code",
    authConfirmationText:
      "We've sent you the authentication code. Please enter it below to login.",
    confirmationCodeSent:
      "Authentication code was sent to your verified phone number.",

    /* Logout dialog */
    logoutTitle: "Are you sure you want to sign out?",
    logoutText:
      "You are also logged out from your personal cloud and any local data apps open in this browser.",
    /* Recover Username */
    recoverUsernameTitle: "Recover username",
    recoverUsernameText1:
      "Enter your phone number. We will send you a confirmation code to recover your username.",
    recoverUsernameText2:
      "If a user account with that phone number exists, we have sent a username to that number.",
    useEmail: "Do you want to use your email adress?",
    /* Reset Password */
    resetPasswordTitle: "Reset password code",
    resetPasswordText:
      "Enter your username. We will send you a confirmation code to reset your password.",
    resetPasswordText2:
      "Please check your phone or email for your verification code. Your code is six digits long. Complete the fields below to reset your password.",
    resetPasswordText3:
      "Your password has been reset. Please login with your new password.",
    sentCodeText:
      "We have sent you a code to your phone number and email address to reset your password.",
    newPassword: "New password",
    confirmNewPassword: "Confirm new password",
    doneButton: "Done",
    codeMissing2: "Did not receive your code?",
    sendAgainLinkText2: "Click here to resend.",
    forgotUsername2: "Forgot your username?",
    /* App Market */
    dataOnYourSide: "Data on your side",
    appMarketText:
      "Free your data from its silos and utilize it in different apps and widgets. Like a key, your data can unlock valuable experiences and insights. By using your data directly, you capture the value and open a new market of apps.",
    category: "Category",
    categorySubText:
      "This section features all the widgets which require user-held data",
    widgetsDirectory: "Widgets Directory",
    widget: "Widget",
    reportBug: "Report bug",
    support: "Support",
    view: "View",
    widgetDetails: "Widget Details",
    dataRequirements: "Data requirements",
    userHeld: "User Held",
    dataTypes: "Data types",
    deviceSupport: "Device Support",
    languages: "Languages",
    ageAppropriate: "Age Appropriate",
    features: "Features",
    userHeldText:
      " Some products on Prifina are powered by ‘user-held’ data which they pull from your data cloud, if the data is not available in your cloud they can’t run. Select from sources below to add the data",
    userDashHeld: "User-held",
    userDashGenerated: "User-generated",
    public: "Public",
    addHealthData: "Add health data to your cloud",
    addViewingData: "Add viewing data to your cloud",
    selectAvailableData: "Select from available sources to add",
    noneNeeded: "None needed",
    connect: "Connect",
    dataSourceModalText1:
      "When and how often we can request your data from third party services depends on how they are set up internally.",
    dataSourceModalText2:
      "Prifina will find the optimal way to connect on your behalf to provide you with the best possible experience.",
    dataSourceModalAlertText:
      "Your data never leaves your cloud. Prifina never shares your data",
    install: "Install",

    /* App Studio */
    appStudio: "App Studio",
    accountDetails: "Account Details",
    developerAgreement: "Developer Agreement",
    welcomeBack: "Welcome back",
    welcomeBackText: "We noticed you are currently logged into Prifina as",
    loginCardTitle: "Great News!",
    loginCardText:
      "Because you have an existing individual Prifina account, you can use it to log in, and  we’ll connect it to your new developer account.",
    continueAs: "Continue as",
    notYou: "Not you?",
    developerAccount: "Developer Account",
    publisherAccounts: "Publisher Accounts",
    publisherAccountsText:
      "Lore issue dolor sit met, ConnectEDU advising elite, used do also tempe incident UT",
    applyToPublishApps: "Apply to publish apps",
    dashboard: "Dashboard",
    projects: "Projects",
    resources: "Resources",
    dataModel: "Data Model",
    soon: "Soon",
    createYourFirstProject: "Create your first project",
    dashboardText:
      "Done with your local build and ready to plug into the power of Prifina? Create a project to get started",
    newProject: "New Project",
    createProject: "Create Project",
    projectType: "Project Type",
    widget: "Widget",
    application: "Application",
    app: "App",
    prifinaAppId: "Prifina app ID",
    prifinaAppIdText:
      "This unique identifer is needed to connect your application to  prifina.",
    copyAndAddToYourBuild: "Copy it and add it to your build.",
    projectName: "Project Name",
    appId: "App ID",
    name: "Name",
    type: "Type",
    progress: "Progress",
    actions: "Actions",
    publishing: "Publishing",
    submit: "Submit",
    showing: "Showing",
    itemsTotal: "items total",
    prfinaDocsButton: "Prifina docs",
    keyResourcesHeading: "Key Resources",
    keyResourcesPara: "Resources to help you build with Prifina",
    prifinaDocsResourcesCardHeading: "Prifina Docs",
    gitResourcesResourcesCardHeading: "App Starter",
    zenDeskResourcesCardHeading: "Zen Desk",
    slackResourcesCardHeading: "LED Slack",
    docsResourcesCardPara:
      "Explore our developer documentation with example code, resources and libraries.",
    gitResourcesCardPara:
      "Quickstart repos for apps and widgets. Prifina hooks already integrated in the starter repos",
    zenResourcesCardPara:
      "Get support from the Prifina Zendesk portal and we will be glad to help out.",
    slackResourcesCardPara:
      "Questions, want feedback? Use the Liberty. Equality. Data Slack to discuss and work on your project.",
    sandboxTesting: "Sandbox testing",
    buildAssets: "Build assets",
    noApps: "No apps...",
    launchSandbox: "Launch Sandbox",
    buildAssets: "Build Assets",
    uploads: "Uploads",
    sandboxTestingText:
      "Finished your local build? See how your application will behave on our platform using our Sandbox enviroment.",
    launchSandboxSession: "Launch Sandbox session",
    copyYourAppId: "Copy your app ID",
    addToLocalBuild: "Add it to your local build",
    getRemoteLink: "Get a remote link for your repo",
    fillOutForm: "Fill out the form and launch the Sandbox",
    readMoreGuide: "Read a more detailed guide in the",
    remoteLink: "Remote Link",
    dataUsage: "Data Usage",
    buildFiles: "Build Files",
    dataUsageText:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt",
    publicApi: "Public API",
    prifinaUserCloud: "Prifina User Cloud",
    noData: "No Data",
    chooseToAddSources: "Choose to add you your data sources",
    dataConectorResults: "Prifina data connectors results...",
    noDataText: "A no data project does not pull any data from any source.",
    learnMoreHere: "Learn more here.",
    dataSourcesUsed: "Data sources used in your project",
    saveButton: "Save",
    pressEditToAddDetails: "Press edit to add more details about data usage",
    addYourComment: "Add your comment...",
    selectSources: "Search and select data sources",
    dataSourcesYouAdd: "Data sources you add will show up here",
    buildFilesText:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt",

    fullSpecHere: "Full spec here",
    dataConnector: "Data connector",
    dataConnectorContains: "This Data connector contains",
    functions: "functions.",
    prfinaDataConnector: "Prifina Data Connector",
    tellUsWhatDataYourAppUses: "Tell us what data your app uses from",
    publicApiAdress: "Public API address",
    listDataAttributesUsed: "List data attributes used in your project",
    title: "Title",
    createPubAccCTATitle: "Publisher account",
    createPubAccCTAText:
      "Ready to release your project to the world? Create a Publisher account to get started.",
    /* Developer account creation page */
    createAppStudioAccount: "Create App Studio account",
    appStudioAccount: "App Studio account",
    redirectNecessary: "Redirect necessary",
    accountCreationText:
      "To get access to Prifina’s Developer Console and its features  you will need to create a seperate account. But don’t worry, the process is quick and easy and you can use your existing Prifina account to get setup.",
    appStudioDisclaimer:
      "Disclaimer message or T&C’s if required Console and its features  you will need to create a seperate account. But don’t worry, the process is quick and easy and you can use your existing Prifina account to get setup.",
    /* Data Cloud */
    dataCloudHomeHeading: "Bring all your data into Data Cloud",
    dataCloudHomeText:
      "Your Data Cloud is the heart of your Personal Data Engine. By bringing your data into your personal data cloud, you can activate it in different apps in your Prifina account.",
    learnMore: "Learn More",
    connectDataSources: "Connect data sources",
    connectingDataSources:
      "Connecting your data sources to activate this data in apps",
    uploadData: "Upload your data",
    uploadFileText: "You can upload one file at a time",
    dragAndDropText: "Drag and drop your files here or",
    clickToBrowse: "click to browse",
    notMoreThan500: "Not more than 500 mb",
    availableSources: "Available Sources",
    connectedSources: "Connected Sources",
    availableDataSources: "Available data sources",
    selectAvailableDataSourcesText:
      "Select from available data sources to add data to your Data cloud",
    addSource: "Add Source",
    connectionPreferences: "Connection Preferences",
    syncWithCloud: "Sync with your cloud:",
    disconnect: "Disconnect",
    dailyRecommended: "Daily (recommended)",

    /* Developer agreement */

    devTermsTitle: "Developer Agreement",
    devTermsText1:
      "THIS IS A LEGAL AGREEMENT BETWEEN YOU AND PRIFINA INC. ('PRIFINA') STATING THE TERMS THAT GOVERN YOUR PARTICIPATION AS A DEVELOPER IN THE PRIFINA PLATFORM. PLEASE READ THIS PRIFINA DEVELOPER AGREEMENT (“AGREEMENT”) BEFORE PRESSING THE 'AGREE' BUTTON AND CHECKING THE BOX AT THE BOTTOM OF THIS PAGE. BY PRESSING 'AGREE,' YOU ARE AGREEING TO BE BOUND BY THE TERMS OF THIS AGREEMENT. IF YOU DO NOT AGREE TO THE TERMS OF THIS AGREEMENT, PRESS 'CANCEL'.",
    devTermsText2:
      "THE MAIN OBJECTIVE OF THIS AGREEMENT IS TO BUILD TRUST BETWEEN PRIFINA AND PRIFINA DEVELOPERS WHO BUILD APPLICATIONS IN THE PRIFINA PLATFORM. PRIFINA SEEKS TO CREATE AN ENVIRONMENT WHERE INDIVIDUALS HAVE FULL OWNERSHIP AND CONTROL OVER THEIR DATA AND WHERE THEIR PRIVACY AND DATA ARE FULLY PROTECTED. PRIFINA ALSO AIMS TO HELP EVERY DEVELOPER SUCCEED IN BUILDING APPLICATIONS IN THE PRIFINA PLATFORM. ",
    devTermsLastUpdated: "Last Updated: March 18, 2022",
    relationshipTitle: "1. Relationship With Prifina; User Name and Password ",
    relationshipText:
      "You understand and agree that by registering with Prifina to become a Developer in the Prifina Platform (“Prifina Developer”), no legal partnership or agency relationship is created between you and Prifina. You agree not to represent otherwise. You also certify that you are at least thirteen years of age and you represent that you are legally permitted to register as a Prifina Developer. Unless otherwise agreed or permitted by Prifina in writing, you cannot share or transfer any benefits you receive from Prifina in connection with being a Prifina Developer. The User Name and password you use to log into your Prifina Developer account cannot be shared in any way or with anyone. You are responsible for maintaining the confidentiality of your User Name and password and for any activity in connection with your account.",
    developerBenefitsTitle: "2. Developer Benefits",
    developerBenefitsText:
      "As a Prifina Developer, you may have the opportunity to attend certain Prifina developer conferences, technical talks, and other events (“Prifina Events”). In addition, Prifina may offer to provide you with certain services (“Services”), as described more fully herein and on the Prifina Developer web pages (“Site”), solely for your own use in connection with your participation as a Prifina Developer. Services may include, but not be limited to, any services Prifina offers at Prifina Events or on the Site as well as the offering of any content or materials displayed on the Site (“Content”). Prifina may change, suspend or discontinue providing the Services, Site, and Content to you at any time, and may impose limits on certain features and materials offered or restrict your access to parts or all of such materials without notice or liability.",
    restrictionsTitle: "3. Restrictions",
    restrictionsText:
      "You agree not to exploit the Site, Services, Prifina Events or Content provided to you by Prifina as a Prifina Developer, in any unauthorized ways. Copyright and other intellectual property laws protect the Site and Content provided to you, and you agree to abide by and maintain all notices, license information, and restrictions contained therein. Unless expressly permitted herein or otherwise permitted in a separate agreement with Prifina, you may not modify, publish, network, rent, lease, loan, transmit, sell, participate in the transfer or sale of, reproduce, create derivative works based on, redistribute, perform, display, or in any way exploit any of the Site, Content or Services. You may not decompile, reverse engineer, disassemble, or attempt to derive the source code of any software or security components of the Services, Site, or Content (except as and only to the extent any foregoing restriction is prohibited by applicable law or to the extent as may be permitted by any licensing terms accompanying the foregoing). Use of the Site, Content or Services to violate, tamper with, or circumvent the security of any computer network, software, passwords, encryption codes, technological protection measures, or to otherwise engage in any kind of illegal activity, or to enable others to do so, is expressly prohibited. Prifina retains ownership of all its rights in the Site, Content, Prifina Events and Services, and except as expressly set forth herein, no other rights or licenses are granted or to be implied under any Prifina intellectual property.",
    confidentialityTitle: "4. Confidentiality",
    confidentialityText:
      "Except as otherwise set forth herein, you agree that any Prifina pre-release software, services, and/or hardware (including related documentation and materials) provided to you as a Prifina Developer (“Pre-Release Materials”) and any information disclosed by Prifina to you in connection with Prifina Events will be considered and referred to as “Prifina Confidential Information”. Notwithstanding the foregoing, Prifina Confidential Information will not include: (a) information that is generally and legitimately available to the public through no fault or breach of yours; (b) information that is generally made available to the public by Prifina; (c) information that is independently developed by you without the use of any Prifina Confidential Information; (d) information that was rightfully obtained from a third party who had the right to transfer or disclose it to you without limitation; or (e) any third party software and/or documentation provided to you by Prifina and accompanied by licensing terms that do not impose confidentiality obligations on the use or disclosure of such software and/or documentation. Further, Prifina agrees that you will not be bound by the foregoing confidentiality terms with regard to technical information about Prifina pre-release software, services and/or hardware disclosed by Prifina at Prifina’s Events, except that you may not post screenshots of, write public reviews of, or redistribute any such materials.",
    nondisclosureTitle:
      "5. Nondisclosure and Nonuse of Prifina Confidential Information",
    nondisclosureText:
      "Unless otherwise expressly agreed or permitted in writing by Prifina, you agree not to disclose, publish, or disseminate any Prifina Confidential Information to anyone other than to other Prifina Developers who are employees and contractors working for the same entity as you and then only to the extent that Prifina does not otherwise prohibit such disclosure. Except for your authorized purposes as a Prifina Developer or as otherwise expressly agreed or permitted by Prifina in writing, you agree not to use Prifina Confidential Information in any way, including, without limitation, for your own or any third party’s benefit without the prior written approval of an authorized representative of Prifina in each instance. You further agree to take reasonable precautions to prevent any unauthorized use, disclosure, publication, or dissemination of Prifina Confidential Information. You acknowledge that unauthorized disclosure or use of Prifina Confidential Information could cause irreparable harm and significant injury to Prifina that may be difficult to ascertain. Accordingly, you agree that Prifina will have the right to seek immediate injunctive relief to enforce your obligations under this Agreement in addition to any other rights and remedies it may have. If you are required by law, regulation or pursuant to the valid binding order of a court of competent jurisdiction to disclose Prifina Confidential Information, you may make such disclosure, but only if you have notified Prifina before making such disclosure and have used commercially reasonable efforts to limit the disclosure and to seek confidential, protective treatment of such information. A disclosure pursuant to the previous sentence will not relieve you of your obligations to hold such information as Prifina Confidential Information.",
    confidentialTitle:
      "6. Confidential Pre-Release Materials License and Restrictions",
    confidentialText:
      "If Prifina provides you with Pre-Release Materials, then subject to your compliance with the terms and conditions of this Agreement, Prifina hereby grants you a nonexclusive, nontransferable, right and license to use the Pre-Release Materials only for the limited purposes set forth in this Section 6; provided however that if such Pre-Release Materials are subject to a separate license agreement, you agree that the license agreement accompanying such materials in addition to Sections 4 and 5 of this Agreement shall also govern your use of the Pre-Release Materials. You agree not to use the Pre-Release Materials for any purpose other than testing and/or development by you of a product designed to operate in combination with the same operating system for which the Pre-Release Materials are designed. This Agreement does not grant you any right or license to incorporate or make use of any Prifina intellectual property (including for example and without limitation, trade secrets, patents, copyrights, and trademarks) in any product. Except as expressly set forth herein, no other rights or licenses are granted or to be implied under any Prifina intellectual property. You agree not to decompile, reverse engineer, disassemble, or otherwise reduce the Pre-Release Materials to a human-perceivable form, and you will not modify, network, rent, lease, transmit, sell, or loan the Pre-Release Materials in whole or in part.",
    developerContentLicenseTitle:
      "7. Developer Content License and Restrictions",
    developerContentLicenseText:
      "As a Prifina Developer, you may have access to certain proprietary content (including, without limitation, video presentations and audio recordings) that Prifina may make available to you from time to time (“Content”). Content shall be considered Prifina Confidential Information, unless otherwise agreed or permitted in writing by Prifina. You may not share the Content with anyone, including, without limitation, employees and contractors working for the same entity as you, regardless of whether they are Prifina Developers, unless otherwise expressly permitted by Prifina. Subject to these terms and conditions, Prifina grants you a personal and non-transferable license to access and use the Content for authorized purposes as a Prifina Developer; provided that you may only download one (1) copy of the Content and such download must be completed within the time period specified by Prifina for such download. Except as expressly permitted by Prifina, you shall not modify, translate, reproduce, distribute, or create derivative works of the Content or any part thereof. You shall not rent, lease, loan, sell, sublicense, assign or otherwise transfer any rights in the Content. Prifina or Prifina’s licensor(s) retain ownership of the Content itself and any copies or portions thereof. The Content is licensed, not sold, to you by Prifina for use only under this Agreement, and Prifina reserves all rights not expressly granted to you. Your rights under this license to use and access the Content will terminate automatically without notice from Prifina if you fail to comply with any of these provisions.",
    developerTechnicalSupportTitle: "8. Developer Technical Support (DTS)",
    developerTechnicalSupportText:
      "As a Prifina Developer, you may have access to Prifina’s software compatibility testing and/or developer technical support incidents (“DTS Services”) that Prifina may make available to you from time to time as a Prifina Developer benefit or for a separate fee. You agree that all use of such DTS Services will be in accordance with Prifina’s usage policies for such services, which are subject to change from time to time, with or without prior notice to you. Without limiting the foregoing, Prifina may post on the Site and/or send an email to you with notices of such changes. It is your responsibility to review the Site and/or check your email address registered with Prifina for any such notices. You agree that Prifina shall not be liable to you or any third party for any modification or cessation of such services. As part of the DTS Services, Prifina may supply you with certain code snippets, sample code, software, and other materials (“Materials”). You agree that any Materials that Prifina provides as part of the DTS Services are licensed to you and shall be used by you only in accordance with the terms and conditions accompanying the Materials. Prifina retains ownership of all of its right, title, and interest in such Materials and no other rights or licenses are granted or to be implied under any Prifina intellectual property. You have no right to copy, decompile, reverse engineer, sublicense or otherwise distribute such Materials, except as may be expressly provided in the terms and conditions accompanying the Materials. ",
    developerTechnicalSupportText2:
      "YOU AGREE THAT WHEN REQUESTING AND RECEIVING TECHNICAL SUPPORT FROM DTS SERVICES, YOU WILL NOT PROVIDE PRIFINA WITH ANY INFORMATION, INCLUDING THAT INCORPORATED IN YOUR SOFTWARE, THAT IS CONFIDENTIAL TO YOU OR ANY THIRD PARTY. YOU AGREE THAT ANY NOTICE, LEGEND, OR LABEL TO THE CONTRARY CONTAINED IN ANY SUCH MATERIALS PROVIDED BY YOU TO PRIFINA SHALL BE WITHOUT EFFECT. PRIFINA SHALL BE FREE TO USE ALL SUCH INFORMATION IT RECEIVES FROM YOU IN ANY MANNER IT DEEMS APPROPRIATE, SUBJECT TO ANY APPLICABLE PATENTS OR COPYRIGHTS. ",
    developerTechnicalSupportText3:
      "Prifina reserves the right to reject a request for DTS Services at any time and for any reason, in which event Prifina may credit you for the rejected lab or support request. You shall be solely responsible for any restoration of lost or altered files, data, programs or other materials provided.",
    amendmentsTitle: "9. Amendments and Communications",
    amendmentsText:
      "Prifina reserves the right, at its discretion, to modify this Agreement, including any rules and policies at any time. You will be responsible for reviewing and becoming familiar with any such modifications (including new terms, updates, revisions, supplements, modifications, and additional rules, policies, terms and conditions) (“Additional Terms”) communicated to you by Prifina. All Additional Terms are hereby incorporated into this Agreement by this reference and your continued use of the Site will indicate your acceptance of any Additional Terms. In addition, Prifina may be sending communications to you from time to time. Such communications may be in the form of phone calls and/or emails and may include, but not be limited to, membership information, marketing materials, technical information, and updates and/or changes regarding your participation as a Prifina Developer. By agreeing to this Agreement, you consent that Prifina may provide you with such communications.",
    devTerminationTitle: "10. Term and Termination",
    devTerminationText:
      "Prifina may terminate or suspend you as a registered Prifina Developer at any time at Prifina’s sole discretion. If Prifina terminates you as a registered Prifina Developer, Prifina reserves the right to deny your reapplication at any time in Prifina’s sole discretion. You may terminate your participation as a registered Prifina Developer at any time, for any reason, by notifying Prifina in writing of your intent to do so. Upon any termination or, at Prifina’s discretion, suspension, all rights and licenses granted to you by Prifina will cease, including your right to access the Site, and you agree to destroy any and all Prifina Confidential Information that is in your possession or control. At Prifina’s request, you agree to provide certification of such destruction to Prifina. No refund or partial refund of any fees paid hereunder or any other fees will be made for any reason. Following termination of this Agreement, Sections 1, 3-5, 7 (but only for so long as the duration specified by Prifina for such usage), 10-19 shall continue to bind the parties.",
    independentDevelopmentTitle: "11. Prifina’s Independent Development",
    independentDevelopmentText:
      "Nothing in this Agreement will impair Prifina’s right to develop, acquire, license, market, promote or distribute products, software or technologies that perform the same or similar functions as, or otherwise compete with, any other products, software or technologies that you may develop, produce, market, or distribute. In the absence of a separate written agreement to the contrary, Prifina will be free to use any information, suggestions or recommendations you provide to Prifina pursuant to this Agreement for any purpose, subject to any applicable patents or copyrights.",
    useOfTrademarksTitle: "12. Use Of Prifina Trademarks, Logos, etc.",
    useOfTrademarksText:
      "You agree to follow Prifina’s trademark and copyright guidelines as published at www.prifina.com/legal (“Guidelines”) and as may be modified from time to time. You agree not to use the marks “Prifina,” the Prifina Logo or any other marks belonging or licensed to Prifina in any way except as expressly authorized in writing by Prifina in each instance or as permitted in Prifina’s Guidelines. You agree that all goodwill arising out of your authorized use of Prifina’s marks shall inure to the benefit of and belong to Prifina.",
    devNoWarrantyTitle: "13. No Warranty",
    devNoWarrantyText:
      "PRIFINA AND ITS AFFILIATES, SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, PARTNERS, AND LICENSORS (COLLECTIVELY, “PRIFINA” FOR PURPOSES OF THIS SECTION 13 AND 14) DO NOT PROMISE THAT THE SITE, CONTENT, SERVICES (INCLUDING, FUNCTIONALITY OR FEATURES OF THE FOREGOING) OR ANY OTHER INFORMATION OR MATERIALS THAT YOU RECEIVE HEREUNDER AS A PRIFINA DEVELOPER (COLLECTIVELY, THE “SERVICE” FOR PURPOSES OF THIS SECTION 13 AND 14) WILL BE ACCURATE, RELIABLE, TIMELY, SECURE, ERROR-FREE OR UNINTERRUPTED, OR THAT ANY DEFECTS WILL BE CORRECTED. THE SERVICE IS PROVIDED ON AN “AS-IS” AND “AS-AVAILABLE” BASIS AND THE SERVICE IS SUBJECT TO CHANGE WITHOUT NOTICE. PRIFINA CANNOT ENSURE THAT ANY CONTENT (INCLUDING FILES, INFORMATION OR OTHER DATA) YOU ACCESS OR DOWNLOAD FROM THE SERVICE WILL BE FREE OF VIRUSES, CONTAMINATION OR DESTRUCTIVE FEATURES. FURTHER, PRIFINA DOES NOT GUARANTEE ANY RESULTS OR IDENTIFICATION OR CORRECTION OF PROBLEMS AS PART OF THE SERVICE AND PRIFINA DISCLAIMS ANY LIABILITY RELATED THERETO. PRIFINA DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTIES OF ACCURACY, NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE. PRIFINA DISCLAIMS ANY AND ALL LIABILITY FOR THE ACTS, OMISSIONS, AND CONDUCT OF ANY THIRD PARTIES IN CONNECTION WITH OR RELATED TO YOUR USE OF THE SERVICE.",
    devNoWarrantyText2:
      "YOU ASSUME TOTAL RESPONSIBILITY AND ALL RISKS FOR YOUR USE OF THE SERVICE, INCLUDING, BUT NOT LIMITED TO, ANY INFORMATION OBTAINED THEREON. YOUR SOLE REMEDY AGAINST PRIFINA FOR DISSATISFACTION WITH THE SERVICE IS TO STOP USING THE SERVICE. THIS LIMITATION OF RELIEF IS A PART OF THE BARGAIN BETWEEN THE PARTIES. TO THE EXTENT THAT PRIFINA MAKES ANY PRE-RELEASE SOFTWARE OR OTHER SERVICES OR INFORMATION RELATED THERETO AVAILABLE TO YOU AS A PRIFINA DEVELOPER, YOU UNDERSTAND THAT PRIFINA IS UNDER NO OBLIGATION TO PROVIDE UPDATES, ENHANCEMENTS, OR CORRECTIONS, OR TO NOTIFY YOU OF ANY PRODUCT OR SERVICES CHANGES THAT PRIFINA MAY MAKE, OR TO PUBLICLY ANNOUNCE OR INTRODUCE THE PRODUCT(S) OR SERVICE AT ANY TIME IN THE FUTURE.",
    devDisclaimerOfLiabilityTitle: "14. Disclaimer of Liability",
    devDisclaimerOfLiabilityText:
      "TO THE EXTENT NOT PROHIBITED BY APPLICABLE LAW, IN NO EVENT WILL PRIFINA BE LIABLE FOR PERSONAL INJURY, OR ANY INCIDENTAL, SPECIAL, INDIRECT, CONSEQUENTIAL OR PUNITIVE DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES RESULTING FROM DELAY OF DELIVERY, FOR LOSS OF PROFITS, DATA, BUSINESS OR GOODWILL, FOR BUSINESS INTERRUPTION OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO THIS AGREEMENT OR YOUR USE OR INABILITY TO USE THE SERVICE, HOWEVER CAUSED, WHETHER UNDER A THEORY OF CONTRACT, WARRANTY, TORT (INCLUDING NEGLIGENCE), PRODUCTS LIABILITY, OR OTHERWISE, EVEN IF PRIFINA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, AND NOTWITHSTANDING THE FAILURE OF ESSENTIAL PURPOSE OF ANY REMEDY. IN NO EVENT SHALL PRIFINA’S TOTAL LIABILITY TO YOU UNDER THIS AGREEMENT FOR ALL DAMAGES (OTHER THAN AS MAY BE REQUIRED BY APPLICABLE LAW IN CASES INVOLVING PERSONAL INJURY) EXCEED THE AMOUNT OF FIFTY DOLLARS ($50.00).",
    devThirdPartyTitle: "15. Third-Party Notices and Products",
    devThirdPartyText:
      "Third-party software provided by Prifina to you as a Prifina Developer may be accompanied by its own licensing terms, in which case such licensing terms will govern your use of that particular third-party software. Mention of third-parties and third-party products in any materials, documentation, advertising, or promotions provided to you as a Prifina Developer is for informational purposes only and constitutes neither an endorsement nor a recommendation. All third-party product specifications and descriptions are supplied by the respective vendor or supplier, and Prifina shall have no responsibility with regard to the selection, performance, or use of these vendors or products. All understandings, agreements, or warranties, if any, take place directly between the vendors and the prospective users.",
    exportControlTitle: "16. Export Control",
    exportControlText:
      "You may not use or otherwise export or re-export any Prifina Confidential Information received from Prifina except as authorized by United States law and the laws of the jurisdiction in which the Prifina Confidential Information was obtained. In particular, but without limitation, the Prifina Confidential Information may not be exported or re-exported (a) into any U.S. embargoed countries or (b) to anyone on the U.S. Treasury Department's list of Specially Designated Nationals or the U.S. Department of Commerce Denied Person’s List or Entity List or any other restricted party lists. By becoming a Prifina Developer or using any Prifina Confidential Information, you represent and warrant that you are not located in any such country or on any such list. You also agree that you will not use any Prifina Confidential Information for any purposes prohibited by United States law.",
    devGoverningLawTitle: "17. Governing Law",
    devGoverningLawText:
      "This Agreement will be governed by and construed in accordance with the laws of the State of California, excluding its conflict of law provisions. The parties further submit to and waive any objections to the personal jurisdiction of and venue in the U.S. District Court for the Northern District of California for any disputes arising out of this Agreement.",
    devMiscellaneousTitle: "18. Miscellaneous",
    devMiscellaneousText:
      "No delay or failure to take action under this Agreement will constitute a waiver unless expressly waived in writing, signed by a duly authorized representative of Prifina, and no single waiver will constitute a continuing or subsequent waiver. This Agreement will bind your successors but may not be assigned, in whole or part, by you without the written approval of an authorized representative of Prifina. Any non-conforming assignment shall be null and void. If any provision is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect and enforceable. This Agreement constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior or contemporaneous understandings regarding such subject matter. No addition to or removal or modification of any of the provisions of this Agreement will be binding upon Prifina unless made in writing and signed by an authorized representative of Prifina. The parties hereto confirm that they have requested that this Agreement and all attachments and related documents be drafted in English.",
  },
};

export default { ...strings };
