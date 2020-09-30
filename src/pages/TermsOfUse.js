import React, { useState } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";

import ProgressContainer from "../components/ProgressContainer";
import styled from "styled-components";
import i18n from "../lib/i18n";
i18n.init();

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
    title: i18n.__("agreeementTitle"),
    text: i18n.__("agreementText"),
  },
  {
    title: i18n.__("serviceTitle"),
    text: i18n.__("serviceText"),
  },
  {
    title: i18n.__("accountsTitle"),
    text: i18n.__("accountsText"),
  },
  {
    title: i18n.__("dataTitle"),
    text: i18n.__("dataText"),
  },
  {
    title: i18n.__("materialsTitle"),
    text: i18n.__("materialsText"),
  },
];
const TermsOfUse = (props) => {
  console.log("Terms ", props);
  const { colors } = useTheme();
  //console.log("THEME ", colors);
  const [scrolled, setScrolled] = useState(false);
  const _handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    //console.log(e.target);
    //console.log(bottom);
    if (bottom) {
      setScrolled(true);
    }
  };
  return (
    <ProgressContainer title={i18n.__("termsTitle")} progress={66}>
      <Box mt={40} height={313}>
        <StyledBox height={"100%"} colors={colors} onScroll={_handleScroll}>
          {texts.map((t, i) => (
            <React.Fragment key={"text-" + i}>
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
          <Button variation={"outline"}>{i18n.__("Decline")}</Button>
        </Flex>
        <Flex ml={99}>
          <Button disabled={!scrolled}>{i18n.__("Approve")}</Button>
        </Flex>
      </Box>
    </ProgressContainer>
  );
};

export default TermsOfUse;
