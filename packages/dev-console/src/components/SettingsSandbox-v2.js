import React, { useState } from "react";

import { Flex, Box, Button, Text, TextArea } from "@blend-ui/core";

import styled from "styled-components";

import { useToast } from "@blend-ui/toast";
import PropTypes from "prop-types";

const StyledTextArea = styled(TextArea)`
font-family: monospace;
font-size: 14px;
height:217px;
width:660px;
`
function isJsonString(str) {
  try {
    const obj = JSON.parse(str);
    if (obj && typeof obj === "object") {
      return true
    }
  } catch (e) {
    console.log("ERROR ", e)
    return false;
  }
  return false;
}
const compareArrays = (a, b) => a.length === b.length && a.every((element, index) => element === b[index]);

function validSettingFormat(settings) {
  const jsonSettings = JSON.parse(settings);
  const invalidResult = jsonSettings.some(setting => {
    //console.log(setting);
    // has to include these keys... 
    if (!compareArrays(['label', 'field', 'type', 'value'], Object.keys(setting))) {
      console.log("KEYS MISMATCH: " + JSON.stringify(setting));
      return true;
    }
  });
  //console.log(invalidResult);
  return !invalidResult;
}

const SettingsSandbox = ({ appSettings, updateSettings }) => {


  const toast = useToast();

  const [validJSON, setValidJSON] = useState(true);


  let inputRef = {};

  const checkEntry = (e) => {
    console.log("JSON CHECK ", inputRef.value)
    if (isJsonString(inputRef.value)) {
      if (validSettingFormat(inputRef.value)) {
        setValidJSON(true);
      } else {
        setValidJSON(false);
      }
    } else {
      setValidJSON(false);
    }
    e.preventDefault();
  };

  const prettySettings = JSON.stringify(appSettings, undefined, 4);

  return (
    <Box>
      <Box mb={16}>
        <Text mb={5}>Settings</Text>
      </Box>

      <StyledTextArea
        expand
        data-isvalid={validJSON}

        label="text"
        defaultValue={prettySettings}
        ref={(ref) => {
          if (ref) {
            inputRef = ref;
          }
        }}
        onBlur={checkEntry}
      />
      {validJSON &&
        <Text mt={8} mb={18} fontSize="xs">
          Add settings used in your project (json format). Note, only "type:text" is supported at the moment.
        </Text>
      }
      {!validJSON &&
        <Text mt={5} mb={18} fontSize="xs" color="red">
          Your settings format is not valid. Check JSON syntax.
        </Text>
      }
      <Button
        onClick={e => {
          checkEntry(e);
          console.log(inputRef.dataset);
          if (inputRef.dataset['isvalid'] === 'true') {
            updateSettings(JSON.parse(inputRef.value)).then(() => {
              toast.info("App settings updated", {});
            })
          }

        }}
      >
        Update
      </Button>
    </Box>
  );
};


SettingsSandbox.propTypes = {
  updateSettings: PropTypes.func,
  appSettings: PropTypes.object
}


export default SettingsSandbox;
