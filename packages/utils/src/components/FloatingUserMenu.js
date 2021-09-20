/* eslint-disable react/forbid-prop-types */
import React, {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  useRef,
  useMemo,
} from "react";

import { useId } from "@reach/auto-id";
import { Portal } from "@blend-ui/modal";
import styled, { css, ThemeProvider } from "styled-components";
import { space } from "styled-system";

import { useTheme, Avatar } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import bxHome from "@iconify/icons-bx/bx-home";
import bxBell from "@iconify/icons-bx/bx-bell";
import bxHistory from "@iconify/icons-bx/bx-history";
import logoutIcon from "@iconify/icons-fe/logout";

//import { ReactComponent as DisplayAppIcon } from "./display-app.svg";
import { DisplayAppIcon } from "./assets/display-app.js";
import { NotificationHeader, NotificationCard } from "./Notifications";

import gql from "graphql-tag";
import { listNotificationsByDate } from "../graphql/queries";
//import { listNotificationsByDate } from "@prifina-apps/utils";

import PropTypes from "prop-types";
/*
const emptyAvatar =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkiIGhlaWdodD0iNTkiIHZpZXdCb3g9IjAgMCA1OSA1OSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjkuNSIgY3k9IjI5LjUiIHI9IjI5LjUiIGZpbGw9IiNDM0MyQzIiLz4KPHBhdGggZD0iTTIzLjY4NzUgMjIuMzk1NkMyMy42ODc1IDI1LjYwMDMgMjYuMjk1NCAyOC4yMDgxIDI5LjUgMjguMjA4MUMzMi43MDQ2IDI4LjIwODEgMzUuMzEyNSAyNS42MDAzIDM1LjMxMjUgMjIuMzk1NkMzNS4zMTI1IDE5LjE5MSAzMi43MDQ2IDE2LjU4MzEgMjkuNSAxNi41ODMxQzI2LjI5NTQgMTYuNTgzMSAyMy42ODc1IDE5LjE5MSAyMy42ODc1IDIyLjM5NTZaTTM5LjgzMzQgNDEuMTI0OEg0MS4xMjVWMzkuODMzMUM0MS4xMjUgMzQuODQ4NiAzNy4wNjc5IDMwLjc5MTUgMzIuMDgzNCAzMC43OTE1SDI2LjkxNjdDMjEuOTMwOSAzMC43OTE1IDE3Ljg3NSAzNC44NDg2IDE3Ljg3NSAzOS44MzMxVjQxLjEyNDhIMzkuODMzNFoiIGZpbGw9IiNGNUY4RjciLz4KPC9zdmc+Cg==";
*/

const positionVariation = props => {
  //console.log("POS ", props);
  let pos = null;

  if (props.positionOption === "top-left") {
    pos = css`
      top: 0;
      left: 0;
      align-items: flex-start;
    `;
  }
  if (props.positionOption === "top-right") {
    pos = css`
      top: 0;
      right: 0;
      align-items: flex-end;
    `;
  }
  if (props.positionOption === "top-center") {
    pos = css`
      top: 0;
    `;
  }
  if (props.positionOption === "left-middle") {
    pos = css`
      top: 50%;
      left: 0;
      align-items: flex-start;
    `;
  }

  if (props.positionOption === "bottom-left") {
    pos = css`
      bottom: 0;
      left: 0;
      align-items: flex-start;
    `;
  }
  if (props.positionOption === "bottom-right") {
    pos = css`
      bottom: 0;
      right: 0;
    `;
  }
  if (props.positionOption === "bottom-center") {
    pos = css`
      bottom: 0;
    `;
  }
  if (props.positionOption === "right-middle") {
    pos = css`
      right: 0;
      top: 50%;
      align-items: flex-end;
    `;
  }
  if (props.positionOption === "center-middle") {
    pos = css`
      top: 50%;
    `;
  }
  return [pos];
};
const alertVariation = props => {
  //console.log("ALERT ", props);
  let styles = props.theme.componentStyles.alert[props.componentStyle];

  return [styles];
};

const Base = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  /* left: 0; */
  display: flex;
  align-items: flex-end;

  justify-content: center;
  flex-direction: column;
  /*
  justify-content: flex-end;
  flex-direction: row;
  */
  min-width: 100px;
  /* pointer-events: none; */

  overflow: hidden;

  z-index: 30;
  ${props => props.theme.baseStyles};
  ${space}
`;

const MenuBase = styled.div`
  min-width: 350px;
  background: #f5f8f7;
  box-shadow: -4px 0px 8px rgba(91, 92, 91, 0.1);
  border: 0;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  height: 100vh;
  padding-top: 25px;
  /* padding-right: 25px; */
  z-index: 32;
`;

const IconBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 25px;
`;

const IconDiv = styled.div`
  margin: 8px;
  justify-content: center;
  height: 24px;
`;
const LabelDiv = styled.div`
  justify-content: center;
  font-weight: 600;
  margin-right: 8px;
`;
const TextDiv = styled.div`
  justify-content: center;
  font-weight: 400;
`;

export const UserMenuContext = createContext({});

function useIsMountedRef() {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });
  return isMountedRef;
}

const ModalDiv = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 31;
  background-color: rgba(30, 29, 29, 0.1);
`;

const Badge = styled.span`
  position: absolute;
  top: ${props => (props.isOpen ? "20px" : "9px")};
  right: ${props => (props.isOpen ? "143px" : "9px")};
  padding: 3.5px 5.5px;
  border-radius: 50%;
  background: red;
  font-size: 10px;
  line-height: 10px;
  color: white;
  font-weight: 700;
`;

const UserMenuContextProvider = ({
  offset = "15px",
  id,
  position = "top-right",
  theme,
  onExit,
  onHome,
  /*
  clientHandler,
  activeUser,
  */
  children,
}) => {
  //console.log("ID ", id, id === null, typeof id);
  const defaultTheme = useTheme();
  theme = theme || defaultTheme;
  const menuContext = useRef(null);
  const [userMenu, setUserMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMountedRef = useIsMountedRef();
  //const [avatarWidth, setAvatarWidth] = useState(32);
  const [iconButtons, setIconButtons] = useState([false, true, false, false]);

  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationTypeList, setNotificationTypeList] = useState([
    <option key={"notification-all"}>All</option>,
  ]);

  const uuid = useId();
  const _id = id || uuid;
  const portalId = `blend-usermenu-portal-${_id}`;
  const menuId = `blend-usermenu-${_id}`;
  const root = useRef(null);
  const totalNotifications = useRef(0);
  const [notificationCards, setNotificationCards] = useState([]);
  const activeUser = useRef({});
  const clientHandler = useRef(null);

  //({ AppIcon, title, date, msg, footer })

  const notificationList = async () => {
    const notifications = await clientHandler.current.query({
      query: gql(listNotificationsByDate),
      variables: {
        owner: activeUser.current.uuid,
        filter: {
          status: { eq: 0 },
        },
        sortDirection: "DESC",
      },
    });
    console.log("NOTIFICATION LIST", notifications);
    //console.log("NOTIFICATION CARD", NotificationCard);

    const cardList = notifications.data.listNotificationsByDate.items.map(
      (c, i) => {
        return (
          <NotificationCard
            mb={5}
            key={"nn-" + i}
            AppIcon={DisplayAppIcon}
            title={c.type}
            date={new Date(c.createdAt).toLocaleString()}
            msg={c.body}
            footer={""}
          />
        );
      },
    );
    //console.log("cardList ", cardList);
    //setNotificationCards(cardList);
    return cardList;

    /*
    data:
    listNotificationsByDate:
    items: Array(6)
    */
  };
  const iconClick = (e, i) => {
    console.log("CLICK ", i);
    if (i === 0) {
      // logout
      setIsOpen(false);
      onExit();
    } else if (i === 3) {
      setIsOpen(false);
      onHome();
    } else {
      let buttons = iconButtons.map(ic => false);

      buttons[i] = true;
      if (i === 1) {
        notificationList().then(list => {
          console.log("NEW LIST...", list);
          setNotificationCards(list);
          setIconButtons(buttons);
        });
      } else {
        setIconButtons(buttons);
      }
      console.log("ICONS ", iconButtons, buttons);
    }
    //MenuArea = userMenu.options.recentApps;
  };

  useEffect(() => {
    // notifications is the default open button...
    if (isOpen) {
      // user menu open click...
      //console.log("USERMENU OPEN....");
      notificationList().then(list => {
        console.log("NEW2 LIST...", list);
        setNotificationCards(list);
      });
    }
  }, [isOpen]);
  useEffect(() => {
    root.current = document.createElement("div");
    root.current.id = portalId;
    document.body.appendChild(root.current);

    return () => {
      if (root.current) document.body.removeChild(root.current);
    };
  }, []);
  const onUpdate = useCallback(cnt => {
    console.log(
      "UPDATE NOTIFICATION ",
      cnt,
      notificationCount,
      totalNotifications.current,
    );
    totalNotifications.current += cnt;
    setNotificationCount(totalNotifications.current);
  }, []);

  const show = useCallback(
    (options = {}) => {
      const id = Math.random().toString(36).substr(2, 9);
      console.log("MENU SHOW OPTIONS ", options);
      const menuOptions = {
        ...options,
      };

      const menu = {
        id,
        options: menuOptions,
      };
      totalNotifications.current = menu.options.notifications || 0;
      setNotificationCount(totalNotifications.current);
      setUserMenu(menu);
      return menu;
    },
    // [position, remove, timeout, type]
    [],
  );
  const setActiveUser = useCallback(user => {
    activeUser.current = user;
  }, []);
  const setClientHandler = useCallback(handler => {
    clientHandler.current = handler;
  }, []);
  /*
  const success = useCallback(
    (message = "", options = {}) => {
      options.type = "success";
      return show(message, options);
    },
    [show],
  );
*/
  /*
  useEffect(() => {
    if (isMountedRef.current) {
      show({});
    }
  }, [isMountedRef]);
*/

  const notificationSelectChange = e => {};
  const notificationButtonClick = e => {};
  const notificationCloseClick = e => {};
  menuContext.current = {
    userMenu,
    show,
    onUpdate,

    setClientHandler,
    setActiveUser,
  };
  //console.log(alertContext);
  const baseProps = {
    positionOption: position,
    theme,
    /*
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
  */
    id: menuId,
    //w:window.innerWidth
  };

  return (
    <UserMenuContext.Provider value={menuContext}>
      {children}
      {root.current && (
        <Portal container={root.current}>
          <ThemeProvider theme={theme}>
            <Base {...baseProps}>
              {userMenu && !isOpen && (
                <React.Fragment>
                  <Avatar
                    src={userMenu.options.avatar}
                    initials={userMenu.options.initials}
                    alt={"avatar"}
                    width={userMenu.options.width || 32}
                    style={{
                      curson: "pointer",
                      margin: offset,
                      filter: "drop-shadow(0px 4px 8px rgba(91, 92, 91, 0.25))",
                    }}
                    effect={userMenu.options.effect || null}
                    /*
                    onMouseEnter={e => {
                      setAvatarWidth(42);
                    }}
                    onMouseLeave={e => {
                      setAvatarWidth(32);
                    }}
                    */
                    onClick={() => {
                      setIsOpen(prev => !prev);
                    }}
                    className={"UserMenuAvatar"}
                  />
                  {notificationCount > 0 && (
                    <Badge isOpen={false}>
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </Badge>
                  )}
                </React.Fragment>
              )}
              {isOpen && (
                <React.Fragment>
                  <ModalDiv
                    onClick={() => {
                      setIsOpen(prev => !prev);
                    }}
                  />
                  <MenuBase>
                    <IconBar>
                      <div
                        style={{
                          borderRadius: "50%",

                          marginLeft: "15px",
                          boxShadow: "-4px 0px 8px rgba(91, 92, 91, 0.1)",
                          background:
                            "linear-gradient(180deg, #FFFFFF 0%, #E6E8ED 100%)",
                          position: "relative",
                          left: "-112px",
                        }}
                      >
                        <BlendIcon
                          iconify={logoutIcon}
                          color={"#00847A"}
                          onClick={e => iconClick(e, 0)}
                        />
                      </div>
                      <div
                        style={{
                          borderRadius: "50%",
                          marginLeft: "15px",
                          boxShadow: "0px 4px 4px rgba(0, 132, 122, 0.6)",
                          background:
                            "linear-gradient(180deg, #FFFFFF 0%, #E6E8ED 100%)",
                        }}
                      >
                        <BlendIcon
                          iconify={bxBell}
                          color={"#00847A"}
                          onClick={e => iconClick(e, 1)}
                        />
                      </div>
                      {notificationCount > 0 && (
                        <Badge isOpen={true}>
                          {notificationCount > 99 ? "99+" : notificationCount}
                        </Badge>
                      )}
                      <div
                        style={{
                          borderRadius: "50%",
                          marginLeft: "15px",
                          boxShadow: "-4px 0px 8px rgba(91, 92, 91, 0.1)",
                          background:
                            "linear-gradient(180deg, #FFFFFF 0%, #E6E8ED 100%)",
                        }}
                      >
                        <BlendIcon
                          iconify={bxHistory}
                          color={"#00847A"}
                          onClick={e => iconClick(e, 2)}
                        />
                      </div>
                      <div
                        style={{
                          borderRadius: "50%",
                          marginLeft: "15px",
                          marginRight: "20px",
                          boxShadow: "-4px 0px 8px rgba(91, 92, 91, 0.1)",
                          background:
                            "linear-gradient(180deg, #FFFFFF 0%, #E6E8ED 100%)",
                        }}
                      >
                        <BlendIcon
                          iconify={bxHome}
                          color={"#00847A"}
                          onClick={e => iconClick(e, 3)}
                        />
                      </div>
                      <Avatar
                        src={userMenu.options.avatar}
                        initials={userMenu.options.initials}
                        width={userMenu.options.width || 32}
                        alt={"avatar"}
                        style={{
                          curson: "pointer",
                          filter:
                            "drop-shadow(0px 4px 8px rgba(91, 92, 91, 0.25))",
                        }}
                      />
                    </IconBar>
                    {iconButtons[1] && (
                      <div style={{ margin: "25px" }}>
                        <NotificationHeader
                          title={"Notifications"}
                          selectOnChange={notificationSelectChange}
                          buttonOnClick={notificationButtonClick}
                          closeClick={notificationCloseClick}
                          options={notificationTypeList}
                        />
                        <div
                          style={{
                            marginTop: "5px",
                            height: "calc(100vh - 200px)",
                            overflowY: "scroll",
                          }}
                        >
                          {notificationCards}
                        </div>
                      </div>
                    )}
                    {iconButtons[2] && <div>{userMenu.options.RecentApps}</div>}
                  </MenuBase>
                </React.Fragment>
              )}
            </Base>
          </ThemeProvider>
        </Portal>
      )}
    </UserMenuContext.Provider>
  );
};
UserMenuContextProvider.propTypes = {
  offset: PropTypes.string,
  id: PropTypes.string,
  position: PropTypes.string,
  theme: PropTypes.object,
  onExit: PropTypes.func,
  onHome: PropTypes.func,
  children: PropTypes.array,
};

/* Hook */
// ==============================
export const useUserMenu = () => {
  const menuContext = useContext(UserMenuContext);
  console.log("CONTEXT ", menuContext);
  const menu = useMemo(() => {
    return menuContext.current;
  }, [menuContext]);
  return menu;
};

/* @component */
export default UserMenuContextProvider;
