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

import { DisplayAppIcon } from "./assets/display-app.js";
import { NotificationHeader, NotificationCard } from "./Notifications";

import gql from "graphql-tag";

import { listSystemNotificationsByDateQuery } from "../graphql/api";
import { newSystemNotification } from "../graphql/subscriptions";

import PropTypes from "prop-types";

const positionVariation = props => {
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
  children,
}) => {
  const defaultTheme = useTheme();
  theme = theme || defaultTheme;
  const menuContext = useRef(null);
  const [userMenu, setUserMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMountedRef = useIsMountedRef();

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
  const prifinaQraphQLHandler = useRef(null);
  const subscriptionHandler = useRef(null);

  //({ AppIcon, title, date, msg, footer })

  const notificationList = async () => {
    const notifications = await listSystemNotificationsByDateQuery(
      prifinaQraphQLHandler.current,
      {
        owner: activeUser.current.uuid,
        filter: {
          status: { eq: 0 },
        },
        sortDirection: "DESC",
      },
    );

    console.log("NOTIFICATION LIST", notifications);

    const cardList = notifications.data.listSystemNotificationsByDate.items.map(
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

    return cardList;
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

  const subscribeNotification = (GRAPHQL, variables) => {
    //return null;
    console.log("SYSTEM NOTIFICATION SUBS ", variables);
    return GRAPHQL.graphql({
      authMode: "AMAZON_COGNITO_USER_POOLS",
      query: gql(newSystemNotification),
      variables: variables,
    }).subscribe({
      next: ({ provider, value }) => {
        console.log("NOTIFICATION SUBS RESULTS ", value);
        onUpdate(1);
      },
      error: error => console.warn(error),
    });
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

      // unsubscribe...
      if (subscriptionHandler.current) {
        console.log("UNSUBS CORE HANDLER");
        subscriptionHandler.current.unsubscribe();
      }
    };
  }, []);
  const onUpdate = cnt => {
    console.log(
      "UPDATE NOTIFICATION ",
      cnt,
      notificationCount,
      totalNotifications.current,
    );
    totalNotifications.current += cnt;
    setNotificationCount(totalNotifications.current);
  };

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

      prifinaQraphQLHandler.current = menu.options.PrifinaGraphQLHandler;
      subscriptionHandler.current = subscribeNotification(
        menu.options.PrifinaGraphQLHandler,
        {
          owner: menu.options.prifinaID,
        },
      );
      totalNotifications.current = menu.options.notifications || 0;
      setNotificationCount(totalNotifications.current);
      setUserMenu(menu);
      return menu;
    },

    [],
  );
  const setActiveUser = useCallback(user => {
    activeUser.current = user;
  }, []);
  const setClientHandler = useCallback(handler => {
    clientHandler.current = handler;
  }, []);
  const setPrifinaGraphQLHandler = useCallback(handler => {
    prifinaQraphQLHandler.current = handler;
  }, []);

  const notificationSelectChange = e => {};
  const notificationButtonClick = e => {};
  const notificationCloseClick = e => {};
  menuContext.current = {
    userMenu,
    show,
    setClientHandler,
    setActiveUser,
    setPrifinaGraphQLHandler,
  };

  const baseProps = {
    positionOption: position,
    theme,
    id: menuId,
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
  theme: PropTypes.instanceOf(Object),
  onExit: PropTypes.func,
  onHome: PropTypes.func,
  children: PropTypes.instanceOf(Array),
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
