/* eslint-disable react/display-name */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
/* global localStorage */

import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  useCallback,
} from "react";

import { Box, Flex, Text, Button } from "@blend-ui/core";

import {
  useAppContext,
  useIsMountedRef,
  listAppsQuery,
  addAppVersionMutation,
  getPrifinaUserQuery,
  updateUserProfileMutation,
  getNotificationCount,
  useUserMenu,
  withUsermenu,
} from "@prifina-apps/utils";

//import { useAppContext } from "../lib/contextLib";
import { API as GRAPHQL, Auth } from "aws-amplify";
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

//import Amplify, { Auth, API as GRAPHQL } from "aws-amplify";

import { useHistory } from "react-router-dom";

import { StyledBox } from "../components/DefaultBackground";
import { PrifinaLogo } from "../components/PrifinaLogo";

//import { listAppsQuery, addAppVersionMutation } from "../graphql/api";

//import withUsermenu from "../components/UserMenu";

import styled from "styled-components";
import { useTable } from "react-table";

import gql from "graphql-tag";

import UploadApp from "../components/UploadApp";

import PropTypes from "prop-types";

/*
const importApp = appName => {
  console.log("APP ", appName);
  return React.lazy(() =>
    import("../pages/" + appName).catch(() => import("./NotFoundPage")),
  );
};
*/

const TableStyles = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;
  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    padding: 1rem;
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: scroll;
  }

  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }

  table td.status,table td.date,table td.version,table td.appType {
    text-align: center
`;

// Create a default prop getter
const defaultPropGetter = () => ({});

function Table({
  columns,
  data,
  getColumnProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) {
  console.log("TABLE ", data);
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    // Return an array of prop objects and react-table will merge them appropriately
                    {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style,
                      },
                      getColumnProps(cell.column),
                      getCellProps(cell),
                    ])}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const Content = ({
  Component,

  initials,
  notificationCount,
  updateNotificationHandler,
  appSyncClient,
  activeUser,

  ...props
}) => {
  const userMenu = useUserMenu();
  console.log(
    "USERMENU DEV APP INIT  ",
    { ...props },

    initials,
    notificationCount,
    typeof updateNotificationHandler,
    appSyncClient,
    activeUser,
  );

  userMenu.setClientHandler(appSyncClient);
  userMenu.setActiveUser(activeUser);
  useEffect(() => {
    userMenu.show({
      initials: initials,
      effect: { hover: { width: 42 } },
      notifications: notificationCount,
      RecentApps: [],
    });
    //console.log(RecentApps);
  }, []);

  updateNotificationHandler(userMenu.onUpdate);

  //return <Component appSyncClient={appSyncClient} {...props} />;
  return <Component data={props.data} currentUser={props.currentUser} />;
};

Content.propTypes = {
  Component: PropTypes.elementType.isRequired,
  initials: PropTypes.string,
  notificationCount: PropTypes.number,
  updateNotificationHandler: PropTypes.func,
  appSyncClient: PropTypes.object,
  activeUser: PropTypes.object,
};

/*
const Content = () => {
  const history = useHistory();

  const versionStatus = [
    "init",
    "received",
    "review",
    "review",
    "review",
    "published",
  ];

  const appTypes = ["Widget", "App"];

  const Columns = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Type",
      accessor: "appType",
      className: "appType",
      Cell: cellProp => appTypes[cellProp.row.values.appType],
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Status",
      accessor: "status",
      className: "status",
      Cell: cellProp => versionStatus[cellProp.row.values.status],
    },
    {
      Header: "Version",
      accessor: "version",
      className: "version",
    },
    {
      Header: "Modified",
      accessor: "modifiedAt",
      className: "date",
    },
    {
      Header: () => null, // No header
      id: "sendApp", // It needs an ID
      Cell: cellProp => {
        //console.log("ROW ", cellProp);
        return (
          <Button
            variation={"link"}
            onClick={e => {
              console.log(cellProp.row.values);
              sendClick(cellProp.row.values);
            }}
          >
            Send
          </Button>
        );
      },
    },
  ];

  const [upload, setUpload] = useState(false);
  const selectedRow = useRef({});

  const sendClick = row => {
    selectedRow.current = row;
    setUpload(true);
  };

  const closeClick = (fileUploaded = false, version) => {
    if (fileUploaded) {
      addAppVersionMutation(API, {
        id: selectedRow.current.id,
        nextVersion: version,
        status: 1, //received
      }).then(res => {
        setUpload(false);
      });
    } else {
      setUpload(false);
    }
  };
  return (
    <React.Fragment>
      <StyledBox>
        <PrifinaLogo />
        {upload && <UploadApp row={selectedRow.current} close={closeClick} />}
        {!upload && (
          <>
            <Box mt={20} pl={"1rem"}>
              <Button
                onClick={() => {
                  history.push("/new-app");
                }}
              >
                New App
              </Button>
            </Box>
            <TableStyles>
              <div className="tableWrap">
                {data.length === 0 && <Text m={2}>"No apps..."</Text>}
                {data.length > 0 && <Table columns={Columns} data={data} />}
              </div>
            </TableStyles>
          </>
        )}
      </StyledBox>
    </React.Fragment>
  );
};
*/

const Main = ({ data, currentUser }) => {
  const history = useHistory();

  const versionStatus = [
    "init",
    "received",
    "review",
    "review",
    "review",
    "published",
  ];

  const appTypes = ["Widget", "App"];

  const Columns = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Type",
      accessor: "appType",
      className: "appType",
      Cell: cellProp => appTypes[cellProp.row.values.appType],
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Status",
      accessor: "status",
      className: "status",
      Cell: cellProp => versionStatus[cellProp.row.values.status],
    },
    {
      Header: "Version",
      accessor: "version",
      className: "version",
    },
    {
      Header: "Modified",
      accessor: "modifiedAt",
      className: "date",
    },
    {
      Header: () => null, // No header
      id: "sendApp", // It needs an ID
      Cell: cellProp => {
        //console.log("ROW ", cellProp);
        return (
          <Button
            variation={"link"}
            onClick={e => {
              console.log(cellProp.row.values);
              sendClick(cellProp.row.values);
            }}
          >
            Send
          </Button>
        );
      },
    },
  ];

  const [upload, setUpload] = useState(false);
  const selectedRow = useRef({});

  const sendClick = row => {
    selectedRow.current = row;
    setUpload(true);
  };

  const closeClick = (fileUploaded = false, version) => {
    if (fileUploaded) {
      addAppVersionMutation(GRAPHQL, {
        id: selectedRow.current.id,
        nextVersion: version,
        status: 1, //received
      }).then(res => {
        setUpload(false);
      });
    } else {
      setUpload(false);
    }
  };
  return (
    <React.Fragment>
      <StyledBox>
        <PrifinaLogo />
        {upload && <UploadApp row={selectedRow.current} close={closeClick} />}
        {!upload && (
          <>
            <Box mt={20} pl={"1rem"}>
              <Button
                onClick={() => {
                  history.push("/new-app");
                }}
              >
                New App
              </Button>
            </Box>
            <TableStyles>
              <div className="tableWrap">
                {data.length === 0 && <Text m={2}>"No apps..."</Text>}
                {data.length > 0 && <Table columns={Columns} data={data} />}
              </div>
            </TableStyles>
          </>
        )}
      </StyledBox>
    </React.Fragment>
  );
};

const Home = props => {
  const history = useHistory();
  const {
    userAuth,
    currentUser,
    isAuthenticated,
    mobileApp,
    APIConfig,
    AUTHConfig,
  } = useAppContext();

  console.log("HOME ", currentUser);

  const [initClient, setInitClient] = useState(false);

  const isMountedRef = useIsMountedRef();
  const apps = useRef([]);
  const componentProps = useRef({});
  const activeUser = useRef({});
  const notificationCount = useRef(0);
  let AppComponent = Main;

  const createClient = (endpoint, region) => {
    Auth.currentCredentials().then(c => {
      console.log("DEV USER CLIENT ", c);
    });
    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },

      disableOffline: true,
    });
    return client;
  };

  const updateNotification = useCallback(handler => {
    //notificationHandler.current = handler;
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (isMountedRef.current) {
        const currentPrifinaUser = await getPrifinaUserQuery(
          GRAPHQL,
          currentUser.prifinaID,
        );
        console.log("CURRENT USER ", currentPrifinaUser);
        let appProfile = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.appProfile,
        );
        console.log("CURRENT USER ", appProfile, appProfile.initials);

        let clientEndpoint = "";
        let clientRegion = "";

        if (!appProfile.hasOwnProperty("endpoint")) {
          const defaultProfileUpdate = await updateUserProfileMutation(
            GRAPHQL,
            currentUser.prifinaID,
          );
          console.log("PROFILE UPDATE ", defaultProfileUpdate);
          appProfile = JSON.parse(
            defaultProfileUpdate.data.updateUserProfile.appProfile,
          );
        }
        clientEndpoint = appProfile.endpoint;
        clientRegion = appProfile.region;

        const client = createClient(clientEndpoint, clientRegion);

        activeUser.current = {
          name: appProfile.name,
          uuid: currentUser.prifinaID,
          endpoint: clientEndpoint,
          region: clientRegion,
          dataConnectors: currentPrifinaUser.data.getPrifinaUser.dataSources
            ? JSON.parse(currentPrifinaUser.data.getPrifinaUser.dataSources)
            : {},
        };

        const prifinaApps = await listAppsQuery(GRAPHQL, {
          filter: { prifinaId: { eq: currentUser.prifinaID } },
        });
        console.log("APPS ", prifinaApps.data);
        apps.current = prifinaApps.data.listApps.items;

        console.log("APPS ", prifinaApps.data);
        componentProps.current = {
          data: apps.current,
          currentUser: currentUser,
        };

        //console.log("CURRENT SETTINGS 2", client);
        componentProps.current.GraphQLClient = GRAPHQL;
        componentProps.current.appSyncClient = client;
        componentProps.current.prifinaID = currentUser.prifinaID;
        componentProps.current.initials = appProfile.initials;
        componentProps.current.updateNotificationHandler = updateNotification;
        componentProps.current.activeUser = activeUser.current;

        // notificationCount...
        const notificationCountResult = await client.query({
          query: gql(getNotificationCount),
          variables: {
            filter: {
              owner: { eq: currentUser.prifinaID },
              status: { eq: 0 },
            },
          },
        });
        console.log("COUNT ", notificationCountResult);
        notificationCount.current =
          notificationCountResult.data.getNotificationCount;

        componentProps.current.notificationCount = notificationCount.current;

        console.log("COMPONENT ", componentProps);
        setInitClient(true);
      }
      return null;
    }

    fetchData();
  }, [isMountedRef.current]);

  return (
    <>
      {initClient && (
        <Content Component={AppComponent} {...componentProps.current} />
      )}
      {!initClient && (
        <div>Home {isAuthenticated ? "Authenticated" : "Unauthenticated"} </div>
      )}
    </>
  );
};

Home.displayName = "Home";

export default withUsermenu()(Home);
