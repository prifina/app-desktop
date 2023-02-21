import React, { useState } from "react";

import {
  Box,

  Text,
  Button,
} from "@blend-ui/core";

import { useToast } from "@blend-ui/toast";

import ConfirmDialog from "./ConfirmDialog";

import { ActionContainer, CustomShape } from "../pages/ProjectDetails-v2";
import PropTypes from "prop-types";


const PublishProject = ({ publishApp, appData }) => {

  const toast = useToast();
  const [openDialog, setOpenDialog] = useState(false);

  const dialogTexts = {
    title: "Confirm Publish Project",
    body: "You are publishing project \"" + appData.name + "\"",
    leftButton: "Cancel",
    rightButton: "Publish"
  }
  const onDialogClick = (e, selected) => {
    console.log("SELECTED ", e, selected);
    setOpenDialog(false);
    if (selected === "right") {
      toast.success("Your project has been published", {});
      publishApp();
    }
  }
  const onDialogClose = (e, action) => {
    console.log("ON CLOSE ", e, action);
  }

  return <>

    {openDialog && (
      <ConfirmDialog onClose={onDialogClose} onButtonClick={onDialogClick} texts={dialogTexts} />
    )}

    <ActionContainer mb={32} justifyContent="space-between">
      <CustomShape bg="baseError" />
      <Box width="530px">
        <Text>PUBLISH PROJECT</Text>
        <Text mt={5} fontSize="xs">
          Your App Status is -{" "}
          {appData.status === 1 ? "Published" : "Not Published"}
        </Text>
      </Box>
      <Button
        onClick={() => {
          setOpenDialog(true);
        }}
        disabled={appData.status === 1 ? true : false}
      >
        Publish
      </Button>
    </ActionContainer>
  </>
}


PublishProject.propTypes = {
  publishApp: PropTypes.func.isRequired,
  appData: PropTypes.object.isRequired
};
export default PublishProject;

