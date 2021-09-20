import React, { useState } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";

import ProgressContainer from "../components/ProgressContainer";
import DeclineDialog from "../components/DeclineDialog";
import styled from "styled-components";

//import { useAccountContext } from "../lib/contextLib";
import { i18n, useAccountContext } from "@prifina-apps/utils";
//import i18n from "../lib/i18n";
i18n.init();

const StyledBox = styled(Box)`
  scrollbar-width: 4px;
  scrollbar-color: ${props =>
      props.colors ? props.colors.baseSecondary : "#00847A"}
    ${props =>
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
    background-color: ${props =>
      props.colors ? props.colors.baseTertiary : "rgba(0, 132, 122, 0.1)"};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    height: 77px;
    background-color: ${props =>
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
const TermsOfUse = props => {
  console.log("Terms ", props);
  const { nextStepAction } = useAccountContext();

  //console.log(nextStepAction);
  //console.log(ctx);

  const { colors } = useTheme();
  //console.log("THEME ", colors);
  const [scrolled, setScrolled] = useState(false);
  const [decline, setDecline] = useState(false);

  const _handleScroll = e => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    //console.log(e.target);
    //console.log(bottom);
    if (bottom) {
      setScrolled(true);
    }
  };
  const declineTerms = e => {
    setDecline(true);
    e.preventDefault();
  };
  const approveTerms = e => {
    // next step email verification ===2,... finalizing===4
    nextStepAction(2);
  };
  const onDialogClose = (e, action) => {
    //console.log("CLOSE ", e, action);
    setDecline(false);
    e.preventDefault();
  };
  const onDialogClick = (e, action) => {
    //console.log("BUTTON ", e, action);
    setDecline(false);
    if (action === "decline") {
      // back to create account page
      nextStepAction(0);
    }
    e.preventDefault();
  };
  /*
    let timer = null;
    if (isActive) {
      timer = setTimeout(() => {
        console.log("This will run after 5 second!");
        onAction("email");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isActive,onAction]);
  */

  return (
    <React.Fragment>
      {decline && (
        <DeclineDialog onClose={onDialogClose} onButtonClick={onDialogClick} />
      )}

      <ProgressContainer title={i18n.__("termsTitle")} progress={66}>
        <Box textAlign="center">
          <Text textStyle={"caption"} bold>
            {i18n.__("termsLastUpdated")}
          </Text>
        </Box>
        <Box mt={22} height={313}>
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
          <React.Fragment>
            <Flex>
              <Button
                variation={"outline"}
                colorStyle={"error"}
                onClick={declineTerms}
              >
                {i18n.__("declineButton")}
              </Button>
            </Flex>

            <Flex ml={99}>
              <Button disabled={!scrolled} onClick={approveTerms}>
                {i18n.__("approveButton")}
              </Button>
            </Flex>
          </React.Fragment>
        </Box>
      </ProgressContainer>
    </React.Fragment>
  );
};

export default TermsOfUse;
