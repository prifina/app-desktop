import React, { useState } from "react";

import { useAppContext } from "../lib/contextLib";

import UserMenuContextProvider from "./FloatingUserMenu";
import LogoutDialog from "./LogoutDialog";

const prod = {
  APP_URL: process.env.REACT_APP_ALPHA_APP,
  DEV_URL: process.env.REACT_APP_ALPHA_APP_STUDIO,
};
const dev = {
  APP_URL: "http://localhost:3000",
  DEV_URL: "http://localhost:3001",
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

const withUsermenu = () => WrappedComponent => {
  const WithUsermenu = props => {
    const { userAuth, Auth } = useAppContext();
    const [logout, setLogout] = useState(false);

    const onDialogClose = (e, action) => {
      setLogout(false);
      e.preventDefault();
    };
    const onDialogClick = async (e, action) => {
      setLogout(false);
      if (action === "logout") {
        console.log("LOGOUT...");
        try {
          setLogout(true);

          userAuth(false);
        } catch (e) {
          console.log("error signing out: ", e);
        }
      }
      e.preventDefault();
    };
    const logOut = () => {
      setLogout(true);
    };
    return (
      <UserMenuContextProvider
        onExit={logOut}
        onHome={() => {
          console.log("HOME CLICK...");
          window.location.replace(config.APP_URL); // browser-back is / (home)
        }}
        onHelp={() => {
          console.log("HELP CLICK...");
          window.open("https://prifina.zendesk.com/hc/en-us");
        }}
      >
        {logout && (
          <LogoutDialog onClose={onDialogClose} onButtonClick={onDialogClick} />
        )}
        <WrappedComponent {...props} />
      </UserMenuContextProvider>
    );
  };

  WithUsermenu.displayName = `WithUsermenu(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithUsermenu;
};

export default withUsermenu;
