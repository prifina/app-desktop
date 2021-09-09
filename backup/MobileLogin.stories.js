import React from "react";
import MobileLogin from "../pages/MobileLogin";

export default { title: "MobileLogin" };

import { ToastContextProvider } from "@blend-ui/toast";

export const mlogin = () => <MobileLogin />;
/*
mlogin.story = {
  name: "MobileLogin",
};
*/
mlogin.story = {
  name: "MobileLogin",
  decorators: [
    (Story) => {
      return (
        <ToastContextProvider position={"top-center"}>
          <Story />
        </ToastContextProvider>
      );
    },
  ],
};
