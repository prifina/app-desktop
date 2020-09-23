import React from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";

import ProgressContainer from "../components/ProgressContainer";

import styled from "styled-components";

const StyledBox = styled(Box)`
  scrollbar-width: 4px;
  scrollbar-color: ${(props) =>
      props.colors ? props.colors.baseSecondary : "#00847A"}
    ${(props) =>
      props.colors ? props.colors.baseTertiary : "rgba(0, 132, 122, 0.1)"};

  overflow-y: scroll;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  ::-webkit-scrollbar:vertical {
    width: 4px;
    height: 77px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: ${(props) =>
      props.colors ? props.colors.baseTertiary : "rgba(0, 132, 122, 0.1)"};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    height: 77px;
    background-color: ${(props) =>
      props.colors ? props.colors.baseSecondary : "#00847A"};
  }
  ::-webkit-scrollbar-thumb:vertical {
    height: 77px;
  }
`;

const texts = [
  {
    title: "Agreement",
    text:
      "By using or visiting any of Prifina’s websites, or any of our products, software, or applications, you signify your agreement to these Terms.",
  },
  {
    title: "The Service",
    text: "Some of the things you can do through the Service are listed below.",
  },
  {
    title: "Accounts",
    text:
      "To access Prifina’s Services, you will need to create an account (“Account”).",
  },
  {
    title: "Your Data",
    text:
      "Your data is fully in your control. Only you can access your data and your data profiles. Third parties can access your data only with your permission.",
  },
  {
    title: "Third Party Materials",
    text:
      "Certain portions of the Service may include, display, or make available content, data, information, applications, or materials from third parties (“Third-Party Materials”).",
  },
];
const TermsOfUse = (props) => {
  console.log("Terms ", props);
  const { colors } = useTheme();
  console.log("THEME ", colors);
  return (
    <ProgressContainer title={"Prifina's Terms of Use"} progress={66}>
      <Box mt={40} height={313}>
        <StyledBox height={"100%"} colors={colors}>
          {texts.map((t, i) => (
            <React.Fragment>
              <Text textStyle={"caption"} bold>
                {t.title}
              </Text>
              <Text as={"p"} textStyle={"caption"}>
                {t.text}
              </Text>
            </React.Fragment>
          ))}
        </StyledBox>
      </Box>

      <Box mt={63} display={"inline-flex"}>
        <Flex>
          <Button variation={"outline"}>Decline</Button>
        </Flex>
        <Flex ml={99}>
          <Button disabled>Approve</Button>
        </Flex>
      </Box>
    </ProgressContainer>
  );
};

export default TermsOfUse;
