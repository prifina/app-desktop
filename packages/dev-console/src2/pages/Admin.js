/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
/* global localStorage */

import React, { useEffect, useReducer, useState, useRef } from "react";
//import { useTheme } from "@blend-ui/core";
import { Box, Flex, Text } from "@blend-ui/core";

import {
  useAppContext,
  listAppsQuery,
  useIsMountedRef,
} from "@prifina-apps/utils";
//import { useIsMountedRef } from "../lib/componentUtils";

//import { useAppContext } from "../lib/contextLib";
import { API, Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";

//import { listAppsQuery } from "../graphql/api";

import styled from "styled-components";
import { useTable } from "react-table";

import PropTypes from "prop-types";

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

  table td.status,table td.date,table td.version {
    text-align: center
`;

const versionStatus = [
  "init",
  "received",
  "review",
  "review",
  "review",
  "published",
];

const Columns = [
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "Type",
    accessor: "appType",
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
    accessor: "nextVersion",
    className: "version",
  },
  {
    Header: "Modified",
    accessor: "modifiedAt",
    className: "date",
  },
];

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

const Content = ({ data }) => {
  //console.log("CURRENT USER ", currentUser);

  //console.log("TABLE DATA ", data, Object.keys(data));

  return (
    <React.Fragment>
      <div>ADMIN...</div>
      <TableStyles>
        <div className="tableWrap">
          {data.length === 0 && <Text m={2}>"No apps..."</Text>}
          {data.length > 0 && <Table columns={Columns} data={data} />}
        </div>
      </TableStyles>
    </React.Fragment>
  );
};

const Admin = props => {
  const history = useHistory();
  const { userAuth, currentUser, isAuthenticated, mobileApp } = useAppContext();

  console.log("ADMIN ", currentUser);

  const userData = useRef(null);

  const [initClient, setInitClient] = useState(false);
  const activeUser = useRef({});

  const apps = useRef([]);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    async function fetchData() {
      if (isMountedRef.current) {
        const prifinaApps = await listAppsQuery(API, {});
        console.log("APPS ", prifinaApps.data);
        apps.current = prifinaApps.data.listApps.items;
        /*
        await newAppVersionMutation(API, "testing", "prifinaID", {
          name: "name",
          version: "0.0.0",
        });
        */
        console.log("APPS ", prifinaApps.data);

        setInitClient(true);
      }
      return null;
    }

    fetchData();
  }, [isMountedRef.current]);

  return (
    <>
      {initClient && <Content data={apps.current} />}
      {!initClient && (
        <div>
          Admin {isAuthenticated ? "Authenticated" : "Unauthenticated"}{" "}
        </div>
      )}
    </>
  );
};

Admin.displayName = "Admin";

export default Admin;
