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
import { rgba } from "polished";

import { Text, useTheme } from "@blend-ui/core";

import { Avatar } from "@blend-ui/avatar";

import { BlendIcon } from "@blend-ui/icons";

import bxHome from "@iconify/icons-bx/bx-home";
import bxBell from "@iconify/icons-bx/bx-bell";
import bxHistory from "@iconify/icons-bx/bx-history";
import feLogout from "@iconify/icons-fe/logout";
import bxClose from "@iconify/icons-bx/x";
import bxQuestionMark from "@iconify/icons-bx/bx-question-mark";

import { DisplayAppIcon } from "./assets/display-app.js";
import { NotificationHeader, NotificationCard } from "./Notifications-v2";

//import gql from "graphql-tag";

//import { listSystemNotificationsByDateQuery } from "../graphql/api";
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

export const UserMenuContext = createContext({});

const ModalDiv = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 31;
  /* background-color: rgba(30, 29, 29, 0.1); */
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
const FooterIconButton = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid ${props => props.theme.colors.textPrimary};
  border-radius: 50%;
  align-self: center;
  margin-left: 20px;
`;
const IconButton = styled.div`
  width: 24px;
  height: 24px;

  background-color: ${props => rgba(props.theme.colors.textPrimary, 0.03)};
  border: 1px solid ${props => rgba(props.theme.colors.textPrimary, 0.1)};
  border-radius: 50%;

  cursor: pointer;
  &:hover {
    border-color: ${props => props.theme.colors.textPrimary};
    box-shadow: 0px 0px 6px 3px rgba(91, 92, 91, 0.1);
    & > span > svg > path {
      color: ${props => rgba(props.theme.colors.textPrimary, 0.8)};
    }
  }
`;
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
  min-width: 360px;
  background: ${props => rgba(props.theme.colors.textPrimary, 0.02)};
  border: 1px solid ${props => rgba(props.theme.colors.textPrimary, 0.1)};
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  height: 100vh;
  padding-top: 25px;
  /* padding-right: 25px; */
  z-index: 32;
  backdrop-filter: blur(8px);
`;
const MenuFooter = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  position: absolute;
  bottom: 0px;
`;
const MenuFooterLink = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  color: ${props => props.theme.colors.textPrimary};

  cursor: pointer;

  &:hover {
    color: ${props => props.OnHoverColor};
    & > ${FooterIconButton} {
      border: 1px solid ${props => props.OnHoverColor};
      color: ${props => props.OnHoverColor};
      & > span > svg > path {
        color: ${props => props.OnHoverColor};
      }
    }
  }
`;
const IconBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  padding-right: 25px;

  & div:first-child {
    margin-right: auto;
    margin-left: 20px;
  }
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

const NotificationBadge = ({ cnt = 0, isOpen = true }) => {

  //console.log("BADGE ", cnt)
  if (cnt === 0) return null;
  //console.log("RENDER BADGE");
  return (<Badge isOpen={isOpen}>{cnt > 99 ? "99+" : cnt}</Badge>)
}

const AvatarWithBadge = (props) => {
  const { avatar, initials, offset, width, effect, onClick, notificationCount } = props;

  return <>
    <Avatar
      id="userMenu-avatar"
      src={avatar}
      initials={initials}
      alt={"avatar"}
      width={width || 32}
      style={{
        curson: "pointer",
        margin: offset,
        filter: "drop-shadow(0px 4px 8px rgba(91, 92, 91, 0.25))",
      }}
      effect={effect || null}
      onClick={onClick}
      className={"UserMenuAvatar"}
    />
    <NotificationBadge cnt={notificationCount} isOpen={false} />
  </>
}
const UserMenuContextProvider = ({
  offset = "15px",
  id,
  position = "top-right",
  theme,
  onExit,
  onHome,
  onHelp,
  children,
}) => {
  const defaultTheme = useTheme();
  theme = theme || defaultTheme;
  const menuContext = useRef(null);
  const [userMenu, setUserMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
  const notificationUpdates = useRef({});

  const subscriptionHandler = useRef(null);

  //const menuEffectCalled = useRef(false);

  //({ AppIcon, title, date, msg, footer })

  const notificationList = async () => {


    const notifications = await notificationUpdates.current["listSystemNotificationsByDateQuery"](
      {
        owner: activeUser.current.uuid,
        filter: {
          status: { eq: 0 },
        },
        sortDirection: "DESC",
      },
    );

    console.log("NOTIFICATION LIST", notifications);
    /*
    {
      "notificationId": "136d0311-250d-b3b1-ac7f-be677860412d",
      "body": "{\"date\":\"2022-03-26\",\"ownerType\":\"user\",\"collectionType\":\"activities\",\"ownerId\":\"9G7RZB\",\"subscriptionId\":\"3a0dda931ced4fcdfd81ff741bd9f30e-1\"}",
      "createdAt": "2022-03-26T03:24:18.123Z",
      "owner": "6145b3af07fa22f66456e20eca49e98bfe35",
      "sender": "6145b3af07fa22f66456e20eca49e98bfe35",
      "status": 0,
      "type": "FITBIT-DATA-NOTIFICATION",
      "updatedAt": "2022-03-26T03:24:18.123Z"
  }
  */

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
    //return null;
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
    } else if (i === 4) {
      setIsOpen(false);
      onHelp();
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

  /*
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
*/
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
        console.log("UNSUBS CORE HANDLER ", subscriptionHandler.current);
        notificationUpdates.current["subscriptions"].unsubscribe(subscriptionHandler.current);
        //subscriptionHandler.current.unsubscribe();
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
        //...options,
        notifications: options.notifications,
        RecentApps: options.RecentApps,
        prifinaID: options.prifinaID
      };

      const menu = {
        id,
        options: menuOptions
      };
      activeUser.current = options.activeUser;
      notificationUpdates.current["listSystemNotificationsByDateQuery"] = options.listSystemNotificationsByDateQuery;
      notificationUpdates.current["subscriptions"] = options.coreApiClient;
      //notificationUpdates.current["CoreApiClient"] = options.coreApiClient;

      options.coreApiClient.setCallback((res) => {
        console.log("CORE SUBSCRIBTION RESULTS ", res);
        onUpdate(1);
      });

      const subsID = notificationUpdates.current["subscriptions"].subscribe(newSystemNotification, {
        owner: options.prifinaID,
      },);

      subscriptionHandler.current = subsID;

      //prifinaQraphQLHandler.current = menu.options.PrifinaGraphQLHandler;
      /*
      subscriptionHandler.current = subscribeNotification(
        menu.options.PrifinaGraphQLHandler,
        {
          owner: menu.options.prifinaID,
        },
      );
      */
      totalNotifications.current = menu.options.notifications || 0;
      setNotificationCount(totalNotifications.current);
      setUserMenu(menu);
      return menu;
    },

    [],
  );
  /* 
    const setActiveUser = useCallback(user => {
      activeUser.current = user;
    }, []); */

  const notificationSelectChange = e => { };
  const notificationButtonClick = e => { };
  const notificationCloseClick = e => { };
  menuContext.current = {
    userMenu,
    show,
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
                <AvatarWithBadge {...userMenu.options} offset={offset} notificationCount={notificationCount} onClick={() => {
                  setIsOpen(prev => !prev);
                }} />

              )}
              {/* 
                <React.Fragment>
                  <Avatar
                    id="userMenu-avatar"
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
                    onClick={() => {
                      setIsOpen(prev => !prev);
                    }}
                    className={"UserMenuAvatar"}
                  />
                  <NotificationBadge cnt={notificationCount} />
                </React.Fragment>
                */}
              {/* floating menu */}
              {isOpen && (
                <React.Fragment>
                  <ModalDiv
                    onClick={() => {
                      setIsOpen(prev => !prev);
                    }}
                  />
                  <MenuBase>
                    <IconBar>
                      {/* Close Button */}
                      <IconButton>
                        <BlendIcon
                          className="userMenu-logout"
                          iconify={bxClose}
                          color={rgba(theme.colors.textPrimary, 0.5)}
                          style={{
                            position: "relative",
                            right: "0.8px",
                            bottom: "0.9px",
                          }}
                          onClick={() => setIsOpen(prev => !prev)}
                        />
                      </IconButton>

                      {/* Bell Button */}
                      <IconButton>
                        <BlendIcon
                          className="userMenu-bell"
                          iconify={bxBell}
                          size={"20px"}
                          color={rgba(theme.colors.textPrimary, 0.5)}
                          style={{
                            position: "relative",
                            right: "-1.3px",
                            bottom: "-0.9px",
                          }}
                          onClick={e => iconClick(e, 1)}
                        />
                      </IconButton>
                      <NotificationBadge cnt={notificationCount} />

                      {/* History Button */}
                      <IconButton>
                        <BlendIcon
                          className="userMenu-history"
                          iconify={bxHistory}
                          size={"20px"}
                          color={rgba(theme.colors.textPrimary, 0.5)}
                          style={{
                            position: "relative",
                            right: "-0.5px",
                            bottom: "-0.8px",
                          }}
                          onClick={e => iconClick(e, 2)}
                        />
                      </IconButton>

                      {/* Home Button */}
                      <IconButton>
                        <BlendIcon
                          className="userMenu-home"
                          iconify={bxHome}
                          size={"20px"}
                          color={rgba(theme.colors.textPrimary, 0.5)}
                          style={{
                            position: "relative",
                            right: "-1.1px",
                            bottom: "-0.5px",
                          }}
                          onClick={e => iconClick(e, 3)}
                        />
                      </IconButton>

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
                            height: "calc(100vh - 300px)",
                            overflowY: "scroll",
                          }}
                        >
                          {notificationCards}
                        </div>
                      </div>
                    )}

                    {iconButtons[2] && <div>{userMenu.options.RecentApps}</div>}
                    <MenuFooter>
                      <hr
                        style={{
                          width: "300px",
                          height: "2px",
                          backgroundColor: theme.colors.basePrimary,
                          position: "absolute",
                          top: 0,
                          margin: "0px",
                          alignSelf: "center",
                        }}
                      />

                      {/* Help */}
                      <MenuFooterLink
                        OnHoverColor="#00847A"
                        // onClick={e => iconClick(e, 3)}
                        onClick={e => iconClick(e, 4)}
                      >
                        <FooterIconButton>
                          <BlendIcon
                            className="userMenu-home"
                            iconify={bxQuestionMark}
                            size={"14px"}
                            color={theme.colors.textPrimary}
                            style={{
                              position: "relative",
                              right: "0px",
                              bottom: "5px",
                            }}
                          />
                        </FooterIconButton>
                        <Text style={{ color: "inherit" }}>Help</Text>
                      </MenuFooterLink>

                      {/* Logout */}
                      <MenuFooterLink
                        OnHoverColor={"#E93232"}
                        onClick={e => iconClick(e, 0)}
                      >
                        <FooterIconButton>
                          <BlendIcon
                            className="userMenu-home"
                            iconify={feLogout}
                            size={"12px"}
                            color={theme.colors.textPrimary}
                            style={{
                              position: "relative",
                              right: "-1.5px",
                              bottom: "6px",
                            }}
                          />
                        </FooterIconButton>
                        <Text style={{ color: "inherit" }}>Logout</Text>
                      </MenuFooterLink>
                    </MenuFooter>
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
  onHelp: PropTypes.func,
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
