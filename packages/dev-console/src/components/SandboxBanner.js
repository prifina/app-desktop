import React from "react";

import { Box, Flex, Text, useTheme } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";
import mdiPowerPlug from "@iconify/icons-mdi/power-plug";
import feClose from "@iconify/icons-fe/close";

const SandboxBanner = ({ closeBanner }) => {
  //<Box height={`calc(100vh - 270px)`} >
  const { colors } = useTheme();
  return <>
    <Box
      height="42px"
      textAlign="center"
      padding="10px"
      style={{ background: colors.sandboxGradient }}
    >
      <Flex flexDirection="row">
        <Flex alignContent="center" justifyContent={"center"} width={`calc(100vw - 20px)`}>
          <Box >
            <BlendIcon
              size="18px"
              iconify={mdiPowerPlug}
              className="icon"
              color={colors.textPrimary}
            />
            <Text as="span" ml={20}>
              This is a live Sandbox session you are seeing, how your
              project will render on Prifina
            </Text>

          </Box>
        </Flex>
        <Flex justifyContent={"end"} width="20px">
          <Box >
            <BlendIcon
              style={{
                cursor: "pointer",
              }}
              onClick={closeBanner}
              size="18px"
              iconify={feClose}
              className="icon"
              color={colors.textPrimary}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  </>
}

export default SandboxBanner;
