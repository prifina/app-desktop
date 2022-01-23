import React, { useState } from "react";
//import { PrifinaLogo } from "../components/PrifinaLogo";

import { useHistory } from "react-router-dom";

import { useAppContext } from "../lib/contextLib";
//import { UserMenuContextProvider } from "@blend-ui/floating-user-menu";
import UserMenuContextProvider from "./FloatingUserMenu";

import LogoutDialog from "./LogoutDialog";

const withUsermenu = () => WrappedComponent => {
  const WithUsermenu = props => {
    const history = useHistory();
    const { userAuth, Auth } = useAppContext();
    const [logout, setLogout] = useState(false);

    const onDialogClose = (e, action) => {
      //console.log("CLOSE ", e, action);
      setLogout(false);
      e.preventDefault();
    };
    const onDialogClick = async (e, action) => {
      //console.log("BUTTON ", e, action);
      setLogout(false);
      if (action === "logout") {
        console.log("LOGOUT...");
        try {
          //console.log("LOGOUT...");
          setLogout(true);

          await Auth.signOut();
          userAuth(false);
          history.replace("/");
        } catch (e) {
          console.log("error signing out: ", e);
        }
      }
      e.preventDefault();
    };
    const logOut = () => {
      //console.log("LOGOUT...");
      setLogout(true);
    };
    return (
      <UserMenuContextProvider
        onExit={logOut}
        onHome={() => {
          console.log("HOME CLICK...");
          history.replace("/");
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
