import React, { useState, useMemo, useCallback, useEffect } from "react";

import { Storage as S3Storage } from "aws-amplify";

import { Box, Flex, Button, Text, Input } from "@blend-ui/core";
import config from "../config";
import { useFormFields } from "@prifina-apps/utils";

import PropTypes from "prop-types";
import { NativeTypes } from "react-dnd-html5-backend";

import { useDrop } from "react-dnd";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const style = {
  border: "1px dashed lightgray",
  width: 451,
  height: 132,
  borderRadius: 4,
  background: "transparent",
  alignItems: "center",
  justifyContent: "center",
};

const UploadFile = ({ props, widgetId, type, numId }) => {
  const [droppedFiles, setDroppedFiles] = useState([]);

  const [uploaded, setUploaded] = useState("");
  console.log("PROPS ", props);

  const [appFields, handleChange] = useFormFields({
    version: "",
  });
  window.LOG_LEVEL = "DEBUG";

  console.log("log", NativeTypes);
  const TargetBox = props => {
    const { onDrop } = props;
    const [{ canDrop, isOver }, drop] = useDrop(
      () => ({
        accept: [NativeTypes.FILE],

        drop(item) {
          if (onDrop) {
            onDrop(item);
          }
        },
        canDrop(item) {
          return true;
        },
        hover(item) {},
        collect: monitor => {
          const item = monitor.getItem();
          if (item) {
          }
          return {
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
          };
        },
      }),
      [props],
    );
    const isActive = canDrop && isOver;
    return (
      <Flex style={style} ref={drop}>
        {/* <Text ref={drop}>
          {isActive ? "Release to drop" : "Drag file here"}
        </Text> */}
        {isActive ? (
          <Text>Release to drop</Text>
        ) : (
          <Flex width="167px" alignItems="center" flexDirection="column">
            <Text fontSize="xs">Upload a .zip file of your build</Text>
            <Text fontSize="xs">Drag and drop a file here or</Text>
            <Button variation="link">Click to upload</Button>
          </Flex>
        )}
      </Flex>
    );
  };

  function list(files) {
    const label = file =>
      `'${file.name}' of size '${file.size}' and type '${file.type}'`;
    return files.map(file => (
      <Text fontSize="xs" key={file.name}>
        {label(file)}
      </Text>
    ));
  }
  const FileList = ({ files }) => {
    if (files.length === 0) {
      // return <Text>Nothing to display</Text>;
      return null;
    }
    const fileList = useMemo(() => list(files), [files]);
    return <Text>{fileList}</Text>;
  };

  const handleFileDrop = useCallback(
    item => {
      if (item) {
        const files = item.files;
        setDroppedFiles(files);
      }
    },

    [setDroppedFiles],
  );

  useEffect(async () => {
    //   if (droppedFiles.length > 0) {
    try {
      const s3Key =
        "apps/uploaded/assets/" + widgetId + "-" + type + "-" + numId + ".png";

      const userRegion = config.cognito.USER_IDENTITY_POOL_ID.split(":")[0];

      const currentCredentials = JSON.parse(
        localStorage.getItem("PrifinaClientCredentials"),
      );

      //   console.log("CREDS ", currentCredentials);
      S3Storage.configure({
        bucket: `prifina-data-${config.prifinaAccountId}-${config.main_region}`,
        region: userRegion,
      });

      const s3Status = await S3Storage.put(s3Key, droppedFiles[0], {
        level: "public", // private doesn't work

        metadata: {
          created: new Date().toISOString(),
          "alt-name": droppedFiles[0].name,
        },

        progressCallback(progress) {
          setUploaded(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
        customPrefix: {},
      });
      // props.close(true, appFields.version);
      console.log("success");

      console.log(s3Status);
    } catch (e) {
      console.log("OOPS ", e);
    }
    //   }
  }, [droppedFiles]);

  console.log("droppedfiles", droppedFiles);

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <TargetBox onDrop={handleFileDrop} />
        <FileList files={droppedFiles} />
      </>
    </DndProvider>
  );
};

UploadFile.propTypes = {
  row: PropTypes.instanceOf(Array),
  close: PropTypes.func,
};

UploadFile.displayName = "UploadFile";
export default UploadFile;
