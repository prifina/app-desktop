const strings = {
  en: {
    /* Create account */
    invalidEntry: "Value is required",
    invalidPhoneNumber: "Phone number is not valid",
    invalidEmail: "Email is not valid",
    usernameExists: "Username exists",
    usernameError: "Username is too short (<{{length}})",
    usernameError2: "Spaces are not allowed in username",
    invalidPassword: "Password confirmation failed",
    createAccountTitle: "Create an account",
    firstNamePlaceholder: "First Name",
    lastNamePlaceholder: "Last Name",
    usernamePlaceholder: "User Name",
    usernamePrompt:
      "This should be longer than {{length}} characters and no spaces are allowed",
    emailPlaceholder: "Email",
    emailPrompt: "This email will be used for 2-step verification",
    phoneNumberPlaceholder: "Phone Number",
    phonePrompt: "This number will be used for 2-step verification",
    passwordPlaceholder: "Password",
    passwordPrompt: "Strong password is required",
    confirmPlaceholder: "Confirm Password",
    signInButton: "Sign In",
    nextButton: "Next",
    /* Landing page */
    welcomeMessage: "Hello",
    landingPage:
      "We are a team of enthusiasts who understand how important web security is. That is why we have created this environment that will help you implement your boldest ideas without fear for your data.",
    landingPageInfo: "Fill the form on the right",
    /* Terms & conditions */
    termsTitle: "Prifina's Terms of Use",
    agreeementTitle: "Agreement",
    agreementText:
      "By using or visiting any of Prifina’s websites, or any of our products, software, or applications, you signify your agreement to these Terms.",
    serviceTitle: "The Service",
    serviceText:
      "Some of the things you can do through the Service are listed below.",
    accountsTitle: "Accounts",
    accountsText:
      "To access Prifina’s Services, you will need to create an account (“Account”).",
    dataTitle: "Your Data",
    dataText:
      "Your data is fully in your control. Only you can access your data and your data profiles. Third parties can access your data only with your permission.",
    materialsTitle: "Third Party Materials",
    materialsText:
      "Certain portions of the Service may include, display, or make available content, data, information, applications, or materials from third parties (“Third-Party Materials”).",
    declineButton: "Decline",
    approveButton: "Approve",
    /* Phone verification */
    codeDigitsError: "Only numbers are allowed",
    codeLengthError: "The code must be 6 digits long",
    verificationTitle: "Setup your 2-step verification method",
    phoneVerificationTitle: "Setup your phone verification",
    phoneVerificationText:
      "In order to keep your personal data safe and secure you have to provide your email and phone details",
    codePropmt: "Enter the code here",
    codeMissing: "Didn't receive a code?",
    sendAgainLinkText: "Send again",
    backButton: "Back",
    verifyButton: "Verify",
    /* Email verification */
    emailVerificationTitle: "Setup your email verification",
    emailVerificationText:
      "In order to keep your personal data safe and secure you have to provide your email and phone details",
    emailMissing: "Didn't receive an email?",
  },
};

export default { ...strings };