import React from "react";
import PhoneVerification from "../src/pages/PhoneVerification";

export default { title: "Phone Verification" };

export const phone = () => <PhoneVerification />;
phone.story = {
  name: "Phone Verification",
};
