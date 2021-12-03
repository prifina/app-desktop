import React from "react";
import CreateAccount from "../src/pages/CreateAccount";

export default { title: "Create Account" };

export const account = () => <CreateAccount />;
account.story = {
  name: "Create Account",
};
