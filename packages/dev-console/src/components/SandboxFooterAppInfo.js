import React, { useState, useRef } from "react";


import { Box, Flex, Text, Button, Input, useTheme } from "@blend-ui/core";
import {
  checkUrl,
} from "@prifina-apps/utils";

import { useToast } from "@blend-ui/toast";

const isValidUrl = urlString => {
  try {
    return urlString.startsWith("https://") && Boolean(new URL(urlString));
  }
  catch (e) {
    return false;
  }
}

const SandboxFooterAppInfo = ({ updateRemoteUrl, appID, remoteUrl }) => {

  const { colors } = useTheme();
  const toast = useToast();

  const [validUrl, setValidUrl] = useState(() => {
    return remoteUrl !== ""
  });

  let inputRef = {};

  const checkEntry = (e) => {
    console.log("URL CHECK ", inputRef.value)
    if (isValidUrl(inputRef.value)) {
      checkUrl(inputRef.value).then(res => {
        if (res) {
          setValidUrl(true);
        } else {
          setValidUrl(false);
        }
      }, (err) => {
        console.log("URL CHECK ERROR ", err);
        setValidUrl(false);
      });
    } else {
      setValidUrl(false);
    }

  }


  return <>
    <Box>
      <Box mb={16}>

        <Text fontSize="sm" mb={5}>
          App ID
        </Text>
        <Input
          disabled
          width="661px"
          label="text"
          value={appID}
          color={colors.textMuted}
          style={{ background: "transparent" }}
        />
        <Text
          fontSize="xs"
          mt={5}
          color={colors.textMuted}
        >
          Unique Prifina project identifier
        </Text>

      </Box>
      <Box mb={16}>

        <Text fontSize="sm" mb={5}>
          Remote link. <i style={{ fontSize: "x-small" }}>Note, most CDN-service have cache settings, which doesn't allow realtime updates.</i>
        </Text>
        <Input
          width="661px"
          label="text"
          defaultValue={remoteUrl}
          color={colors.textPrimary}
          style={{ background: "transparent" }}
          ref={(ref) => {
            if (ref) {
              inputRef = ref;
            }
          }}
          onBlur={checkEntry}
          onKeyDown={e => {
            if (e.key === "Enter") {
              checkEntry(e);
            }
          }}
        />
        {!validUrl &&
          <Text mt={5} fontSize="xxs" color="red">
            Your remote link is not valid
          </Text>
        }
        {validUrl &&
          <Text
            fontSize="xs"
            mt={5}
            color={colors.textSecondary}
          >
            Link to your build
          </Text>
        }
      </Box>

      <Flex>
        <Button
          disabled={!validUrl}
          onClick={async (e) => {
            await updateRemoteUrl(inputRef.value);
            toast.info("Remote Url updated", {});
            e.preventDefault();
          }}
        >
          Update
        </Button>
        <Button
          ml={25}

          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Flex>
    </Box>
  </>
}

export default SandboxFooterAppInfo;