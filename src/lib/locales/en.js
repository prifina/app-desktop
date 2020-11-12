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
    loginLink: "Login",
    /* Create account */
    invalidEntry: "Value is required",
    invalidPhoneNumber: "Phone number is not valid",
    invalidEmail: "Email is not valid",
    usernameExists: "Username already exists",
    usernameError: "Username is too short (under {{length}} characters)",
    usernameError2: "Spaces are not allowed in the username",
    invalidPassword: "Password confirmation failed",
    createAccountTitle: "Create an account",
    firstNamePlaceholder: "First Name",
    lastNamePlaceholder: "Last Name",
    usernamePlaceholder: "User Name",
    emailPlaceholder: "Email",
    emailPrompt: "This email will be used for 2-step verification",
    phoneNumberPlaceholder: "Phone Number",
    phonePrompt: "This number will be used for 2-step verification",
    passwordPlaceholder: "Password",

    confirmPlaceholder: "Confirm Password",
    existingAccount: "Have an account?",

    /* Landing page */
    welcomeMessage: "Hello",
    landingPage:
      "We are a team working on the future of personal applications. This is why we have created this personal cloud environment that will help you implement your boldest ideas while allowing individuals to keep their data.",
    landingPageInfo: "Fill in the form on the right",
    /* Terms & conditions */
    termsTitle: "Prifina's Terms of Use",
    termsLastUpdated: "Last Updated: {{date}}",
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
      "Your data is fully under your control. Only you can access your data and your data profiles. Third parties can access your data only with your permission.",
    materialsTitle: "Third Party Materials",
    materialsText:
      "Certain portions of the Service may include, display, or make available content, data, information, applications, or materials from third parties (“Third-Party Materials”).",

    /* Phone verification */
    codeDigitsError: "Only numbers are allowed",
    codeLengthError: "The code must be 6 digits long",
    verificationTitle: "Setup your 2-step verification method",
    phoneVerificationTitle: "Setup your phone verification",
    phoneVerificationText:
      "Please provide your email and phone details in order to keep your personal data safe and secure",
    codePropmt: "Enter the code here",
    codeMissing: "Didn't receive a code?",
    sendAgainLinkText: "Send again",
    invalidCode: "Incorrect code, please re-enter the correct code",

    /* Email verification */
    emailVerificationTitle: "Setup your email verification",
    emailVerificationText:
      "In order to keep your personal data safe and secure, you have to provide your email and phone details",
    emailMissing: "Didn't receive an email?",
    /* Decline dialog */
    declineTitle: "Decline Prifina’s terms of use?",
    declineText:
      "By declining our Terms of Use, you are rejecting the usage of the Prifina application.",
  },
};

export default { ...strings };
