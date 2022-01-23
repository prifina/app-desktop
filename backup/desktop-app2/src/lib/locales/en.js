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
    emailPrompt: "This email will be used for two-step verification.",
    phoneNumberPlaceholder: "Phone Number",
    phoneNumberPlaceholder2: "555_555_555",
    phonePrompt: "This number will be used for two-step verification.",
    passwordPlaceholder: "Password",

    confirmPlaceholder: "Confirm Password",
    existingAccount: "Have an account?",
    acceptTerms: "Please approve terms of use to continue.",

    finalizeText: "This process may take a few seconds",

    /* Landing page */
    loginWelcomeMessage: "My Prifina",
    loginLandingPage: "Login to access your personal data cloud.",
    welcomeMessage: "Hello",
    landingPage:
      "We are a team working on the future of personal applications. That's why we created this personal cloud environment that will help you implement your boldest ideas while allowing individuals to keep their data.",
    landingPageInfo: "Fill in the form on the right",
    /* Terms & conditions */
    termsTitle: "Prifina's Terms of Use",
    termsLastUpdated: "Last updated: October, 2020",
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
    verifySUpportLink: "Still didn't receive the code",
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
      "Authentication code was sent to your vefified phone number.",

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
  },
};

export default { ...strings };
