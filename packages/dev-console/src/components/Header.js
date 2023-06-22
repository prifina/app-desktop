
import React, { useEffect, useRef } from "react";
import { Flex } from "@blend-ui/core";
//import { useUserMenu } from "@prifina-apps/ui-lib";

import AppStudioLogo from "./AppStudioLogo";

import styled from "styled-components";
import PropTypes from "prop-types";

const NavbarContainer = styled(Flex)`
  height: 58px;
  width: 100%;
  padding-left: 64px;
  position: fixed;
  top: 0;
  z-index: 1;
`;

const Header = (/*{ notificationCount,
  activeUser,
  listSystemNotificationsByDateQuery,
  coreApiClient, }*/) => {
  /*
    const effectCalled = useRef(false);
    const userMenu = useUserMenu();
  
    useEffect(() => {
      if (!effectCalled.current) {
        effectCalled.current = true;
        const userMenuInit = {
          //effect: { hover: { width: 42 } },
          notifications: notificationCount,
          RecentApps: [],
          prifinaID: activeUser.uuid,
          activeUser: activeUser,
          listSystemNotificationsByDateQuery: listSystemNotificationsByDateQuery,
          coreApiClient: coreApiClient
        };
        //console.log("User menu init ", userMenuInit);
        userMenu.show(userMenuInit);
      }
  
    }, []);
  */
  return (
    <>
      <NavbarContainer bg="basePrimary">
        <AppStudioLogo className="appStudio" />
      </NavbarContainer>
    </>
  );
};
/*
Header.propTypes = {
  notificationCount: PropTypes.number,
  activeUser: PropTypes.object,
  coreApiClient: PropTypes.object,
  listSystemNotificationsByDateQuery: PropTypes.func
};
*/


export default Header;

//export default withUsermenu()(Header);