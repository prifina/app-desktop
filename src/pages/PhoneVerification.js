import React from "react";
import { Box, Flex, Button, Text, Input, IconField } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";
import bxKey from "@iconify/icons-bx/bx-key";
import { ReactComponent as Phone } from "../assets/phone.svg";

import ProgressContainer from "../components/ProgressContainer";

const PhoneVerification = (props) => {
  console.log("Phone ", props);
  //const { colors } = useTheme();
  //console.log("THEME ", colors);
  return (
    <ProgressContainer
      title={"Setup your 2-step verification method"}
      progress={100}
    >
      <Box mt={50}>
        <Box display={"inline-flex"}>
          <Box>
            <Phone height={"135px"} width={"68px"} />
          </Box>
          <Box ml={61}>
            <Box>
              <Text textStyle={"h6"}>Setup your phone verification</Text>
            </Box>
            <Box mt={5}>
              <Text textStyle={"caption"} as={"p"}>
                In order to keep your personal data safe and secure you have to
                provide your email and phone details
              </Text>
            </Box>
            <Box mt={15}>
              <IconField width={"200px"}>
                <BlendIcon
                  iconify={bxKey}
                  color={"componentPrimary"}
                  size={"17"}
                />
                <Input placeholder={"Enter the code here"} />
              </IconField>
            </Box>
            <Box mt={3} display={"inline-flex"}>
              <Flex alignItems={"center"}>
                <Text textStyle={"caption"}>Didn't receive a code?</Text>
                <Button variation={"link"}>Send again</Button>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt={76} display={"inline-flex"}>
        <Flex>
          <Button variation={"outline"}>Back</Button>
        </Flex>
        <Flex ml={99}>
          <Button disabled>Verify</Button>
        </Flex>
      </Box>
    </ProgressContainer>
  );
};

export default PhoneVerification;
