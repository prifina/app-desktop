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


const DeleteProject = ({ deleteApp, appName }) => {

  const toast = useToast();
  const [openDialog, setOpenDialog] = useState(false);

  const dialogTexts = {
    title: "Confirm Delete Project",
    body: "You are deleting project \"" + appName + "\"",
    leftButton: "Cancel",
    rightButton: "Delete"
  }
  const onDialogClick = (e, selected) => {
    console.log("SELECTED ", e, selected);
    setOpenDialog(false);
    if (selected === "right") {
      toast.success("Deleted project", {});
      deleteApp();
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
        <Text>DELETE PROJECT</Text>
        <Text mt={5} fontSize="xs">
          Choose this to delete your project and all data associated with
          your account. This operation is final and all data will be
          permanently lost.
        </Text>
      </Box>
      <Button colorStyle="error" onClick={() => {
        setOpenDialog(true);
      }}>
        Delete
      </Button>
    </ActionContainer>

  </>
}

DeleteProject.propTypes = {
  deleteApp: PropTypes.func.isRequired,
  appName: PropTypes.string.isRequired
};
export default DeleteProject;
