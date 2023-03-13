
import React, { useEffect, useState, useRef, } from "react";


import { Box, Flex, Text, Button, } from "@blend-ui/core";

import { useTranslate, useStore } from "@prifina-apps/utils";

import shallow from "zustand/shallow";


import { useNavigate } from "react-router-dom";

import Table from "./Table-v2";

import CreateProjectModal from "../components/CreateProjectModal-v2";

export const prifinaAppTypes = { "APP": 1, "WIDGET": 2 };

const Projects = ({ currentUser }) => {


  console.log("LIST PROJECTS ", currentUser)
  const navigate = useNavigate();

  const { __ } = useTranslate();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [appList, setAppList] = useState([]);

  const effectCalled = useRef(false);

  const forceReload = useRef(false);

  const { listAppsQuery, newAppVersionMutation
  } = useStore(
    state => ({
      listAppsQuery: state.listAppsQuery,
      newAppVersionMutation: state.newAppVersionMutation

    }),
    shallow,
  );
  const versionStatus = [
    "init",
    "received",
    "review-stage-1",
    "review-stage-2",
    "review-stage-3",
    "published",
  ];


  const Columns = [
    {
      Header: "Name",
      accessor: "name",
      Cell: props => {
        //console.log("props", props);

        return (
          <Text
            onClick={() => {
              //openProject(props);
            }}
          >
            {props.cell.value}
          </Text>
        );
      },
    },
    {
      Header: "App ID",
      accessor: "id",
      Cell: props => {
        return <Text>{props.cell.value}</Text>;
      },
    },
    {
      Header: "Type",
      accessor: "appType",
      className: "appType",
      Cell: props => {
        return props.cell.value === 1 ? "App" : "Widget";
      },
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
      Header: "Next Version",
      accessor: "nextVersion",
      className: "nextVersion",
    },
    {
      Header: "Modified",
      accessor: "modifiedAt",
      className: "date",
      Cell: props => {
        return <Text>{new Date(props.cell.value).toLocaleString()}</Text>;
      },
    },
    {
      Header: () => null, // No header
      id: "edit",
      Cell: props => {
        return (
          <Button
            size="xs"
            onClick={() => {
              //console.log("EDIT ", props.row.index)
              const rowIdx = props.row.index;
              //console.log("EDIT ", props.data[rowIdx])
              //navigate("/app/project/" + props.data[rowIdx].id, { replace: true });
              navigate("/projects/" + props.data[rowIdx].id);
            }}
          >
            Edit
          </Button>
        );
      },
    },
  ];
  useEffect(() => {
    async function fetchData() {
      effectCalled.current = true;
      const apps = await listAppsQuery({
        filter: { prifinaId: { eq: currentUser.uuid } },
      });
      const projectList = apps.data.listApps.items;
      setAppList(projectList);
      console.log("Project list", projectList);
    }

    if (!effectCalled.current) {
      fetchData();

    }
  }, []);


  const onDialogClose = e => {
    if (forceReload.current) {
      //console.log("FORCE RELOAD")
      location.reload();
    }
    setProjectDialogOpen(false);
    e.preventDefault();
  };

  const onDialogClick = async e => {

    if (forceReload.current) {
      //console.log("FORCE RELOAD")
      location.reload();
    }
    setProjectDialogOpen(false);
    e.preventDefault();
  };

  const createApp = (appFields) => {
    /* variables: {
      id: id,
      prifinaId: prifinaId,
      name: opts.name || null,
      title: opts.title || null,
      version: opts.version || null,
      appType: opts.appType || 1,
      identity: opts.identity || null,
      identityPool: opts.identityPool || null,
    }, */


    try {
      console.log("CLICK ", appFields, currentUser);
      forceReload.current = true;
      const newApp = {
        id: appFields.appId,
        prifinaId: currentUser.uuid,
        name: appFields.appName || null,
        title: appFields.appTitle || null,
        version: appFields.version || 1,
        appType: appFields.appType || prifinaAppTypes.WIDGET
      }
      //console.log(newApp)
      // note this should return promise.. 
      return newAppVersionMutation(newApp);

      // history.push("/");
      //location.Dereload();
    } catch (e) {
      console.log("error ", e);
    }
  };

  return (
    <>
      <Box height={"100%"}>
        {projectDialogOpen && (

          <CreateProjectModal
            onClose={onDialogClose}
            onButtonClick={onDialogClick}
            createApp={createApp}
            defaultAppType={prifinaAppTypes.WIDGET}
            prifinaAppTypes={prifinaAppTypes}
          />
        )}

        <Box>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            marginBottom="40px"
            marginTop={"20px"}
            marginRight={"25px"}
          >
            <Text textStyle="h3">{__("projects")}</Text>
            <Button
              onClick={() => {
                console.log("Open DIALOG")
                setProjectDialogOpen(true);
              }}
            >
              {__("newProject")}
            </Button>
          </Flex>
        </Box>
        <Box bg="baseMuted" marginRight={"25px"} padding={"5px"}>
          <div className="tableWrap">
            <Table columns={Columns} data={appList} />
          </div>
        </Box>

      </Box>
    </>
  );
};

export default Projects;