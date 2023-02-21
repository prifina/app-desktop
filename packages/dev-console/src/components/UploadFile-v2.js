import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";

import { Flex, Button, Text, useTheme } from "@blend-ui/core";
import config from "../config";

import { useToast } from "@blend-ui/toast";

import styled from "styled-components";

import PropTypes from "prop-types";
import { NativeTypes } from "react-dnd-html5-backend";

import { useDrop } from "react-dnd";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const style = {
  border: "1px dashed #969595",
  width: 451,
  height: 132,
  borderRadius: 4,
  background: "transparent",
  alignItems: "center",
  justifyContent: "center",
};

const StyledButton = styled(Button)`
  &:hover {
    color: ${props => props.theme.colors.baseHover}!important;
    background-color: transparent !important;
    border: 0 !important;
  }
`;

const list = (files) => {
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

FileList.propTypes = {
  files: PropTypes.array,
}

const TargetBox = ({ onDrop, colors, widgetId, S3Storage, updateUploaded }) => {

  const toast = useToast();

  //const [uploaded, setUploaded] = useState("");
  const uploaded = useRef("");

  const buttonUploadFile = async e => {

    console.log("UPLOAD CLICK...")
    try {
      //check file info
      const file = e.target.files[0];
      console.log("Upload ", file);

      const userRegion = config.cognito.USER_IDENTITY_POOL_ID.split(":")[0];

      const s3Key = widgetId + "/packages/" + widgetId + ".zip";

      S3Storage.configure({
        bucket: `prifina-data-${config.prifinaAccountId}-${config.main_region}`,
        region: userRegion,
      });
      console.log("S3 KEY ", s3Key);

      const s3Status = await S3Storage.put(s3Key, file, {
        level: "public", // private doesn't work
        metadata: { created: new Date().toISOString(), "alt-name": file.name },

        progressCallback(progress) {
          console.log("PROGRESS 2 ", progress)
          const loaded = `${Math.floor(100 * progress.loaded / progress.total)}%`;
          updateUploaded(loaded);
          uploaded.current = loaded;
          //setUploaded(`${Math.floor(progress.loaded / progress.total)}%`);
        },
        customPrefix: {
          public: "uploads/",
        },
      });

      console.log("success ");
      toast.success(`Package uploaded - Progress: ${uploaded.current}`, {});

      console.log(s3Status);
    } catch (e) {
      console.log("OOPS ", e);
      toast.error("Upload failed", {});
    }
  };

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
      hover(item) { },
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
    [],
  );

  const isActive = canDrop && isOver;
  return (
    <Flex style={style} ref={drop}>
      {/* <Text ref={drop}>
        {isActive ? "Release to drop" : "Drag file here"}
      </Text> */}
      {isActive ? (
        <Text color={colors.textMuted}>Release to drop</Text>
      ) : (
        <Flex width="167px" alignItems="center" flexDirection="column">
          <Text fontSize="xs" color={colors.textMuted}>
            Upload a .zip file of your build
          </Text>
          <Text fontSize="xs" color={colors.textMuted}>
            Drag and drop a file here or
          </Text>
          <StyledButton
            accept={".zip"}
            onChange={buttonUploadFile}
            variation={"file"}
          >
            Click to upload
          </StyledButton>
        </Flex>
      )}
    </Flex>
  );
};

TargetBox.propTypes = {
  onDrop: PropTypes.func,
  colors: PropTypes.object,
  widgetId: PropTypes.string,
  S3Storage: PropTypes.object,
  updateUploaded: PropTypes.func,
}

const UploadFile = ({ widgetId, S3Storage, updateUploaded }) => {

  console.log("S3 ", S3Storage)
  const { colors } = useTheme();

  const toast = useToast();

  const [droppedFiles, setDroppedFiles] = useState([]);

  const uploaded = useRef("");
  //const [uploaded, setUploaded] = useState("");
  //console.log("PROPS ", props);

  window.LOG_LEVEL = "DEBUG";

  console.log("log", NativeTypes);

  console.log("UPLOAD FILE ", widgetId);

  const handleFileDrop = useCallback(
    item => {
      if (item) {
        const files = item.files;
        setDroppedFiles(files);
      }
    },

    [setDroppedFiles],
  );

  const s3Key = widgetId + "/packages/" + widgetId + ".zip";

  const userRegion = config.cognito.USER_IDENTITY_POOL_ID.split(":")[0];

  /*
  const currentCredentials = JSON.parse(
    localStorage.getItem("PrifinaClientCredentials"),
  );

  console.log("CREDS ", currentCredentials);
  */

  const uploadFile = async e => {
    try {
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
          console.log("PROGRESS 1 ", progress)
          const loaded = `${Math.floor(100 * progress.loaded / progress.total)}%`;
          updateUploaded(loaded);
          uploaded.current = loaded;
          //setUploaded(`${Math.floor(progress.loaded / progress.total)}%`);
        },
        customPrefix: {
          public: "uploads/",
        },
      });
      // props.close(true, appFields.version);
      console.log("success");
      toast.success(`Package uploaded - Progress: ${uploaded.current}`, {});
      console.log(s3Status);
    } catch (e) {
      console.log("OOPS ", e);
      {
        uploaded.current !== "" ? toast.error("Upload failed", {}) : null;
      }
    }
  };

  useEffect(() => {
    if (droppedFiles.length > 0) {
      uploadFile();
    }
    //   }
  }, [droppedFiles]);

  console.log("droppedfiles", droppedFiles);

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <TargetBox onDrop={handleFileDrop} colors={colors} widgetId={widgetId} S3Storage={S3Storage} updateUploaded={updateUploaded} />
        <FileList files={droppedFiles} />
        {/* 
        {uploaded !== "" ? (
          <Text fontSize="xs" color={colors.baseSuccess}>
            Progress: {uploaded}
          </Text>
        ) : null}
        */}
      </>
    </DndProvider>
  );
};

UploadFile.propTypes = {
  widgetId: PropTypes.string,
  S3Storage: PropTypes.object,
  updateUploaded: PropTypes.func,

};

UploadFile.displayName = "UploadFile";
export default UploadFile;
