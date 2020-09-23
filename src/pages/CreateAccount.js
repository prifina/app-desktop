import React from "react";
import { IconField, Button, Input, Box, Flex } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";
import bxPhone from "@iconify/icons-bx/bx-phone";
import bxUser from "@iconify/icons-bx/bx-user";
import bxEnvelope from "@iconify/icons-bx/bx-envelope";
import ProgressContainer from "../components/ProgressContainer";
import PasswordField from "../components/PasswordField";

const CreateAccount = (props) => {
  console.log("Account ", props);
  //const { colors } = useTheme();
  //console.log("THEME ", colors);
  return (
    <ProgressContainer title={"Create an account"} progress={33}>
      <Box mt={40} display="inline-flex">
        <Flex width={"168px"}>
          <Input placeholder={"First Name"} />
        </Flex>
        <Flex ml={25} width={"168px"}>
          <Input placeholder={"Last Name"} />
        </Flex>
      </Box>
      <Box mt={20}>
        <IconField>
          <BlendIcon iconify={bxUser} color={"componentPrimary"} size={"17"} />
          <Input placeholder={"User Name"} />
        </IconField>
      </Box>
      <Box mt={20}>
        <IconField>
          <BlendIcon
            iconify={bxEnvelope}
            color={"componentPrimary"}
            size={"17"}
          />
          <Input placeholder={"Email"} />
        </IconField>
      </Box>
      <Box mt={20}>
        <IconField>
          <BlendIcon iconify={bxPhone} color={"componentPrimary"} size={"17"} />
          <Input placeholder={"Phone Number"} />
        </IconField>
      </Box>
      <Box mt={20}>
        <PasswordField placeholder={"Password"} />
      </Box>
      <Box mt={20}>
        <PasswordField placeholder={"Confirm Password"} />
      </Box>

      <Box mt={83} display={"inline-flex"}>
        <Flex>
          <Button variation={"outline"}>Sign In</Button>
        </Flex>
        <Flex ml={99}>
          <Button disabled>Next</Button>
        </Flex>
      </Box>
    </ProgressContainer>
  );
};

export default CreateAccount;
