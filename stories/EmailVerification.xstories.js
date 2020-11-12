import React from "react";
import EmailVerification from "../src/pages/EmailVerification";

export default { title: "Email Verification" };

export const email = () => <EmailVerification />;
email.story = {
  name: "Email Verification",
};
