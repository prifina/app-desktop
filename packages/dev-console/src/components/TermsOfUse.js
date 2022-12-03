import React, { useState } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";

import DeclineDialog from "./DeclineDialog";
import styled from "styled-components";

import { i18n, useAccountContext } from "@prifina-apps/utils";

import * as C from "./components";

i18n.init();
//  width={"421px"}
// minHeight={"437px"}

const Container = styled(Flex)`
  flex-direction: column;
  height: 534px;
  width: 365px;
`;

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
    title: i18n.__("relationshipTitle"),
    text: i18n.__("relationshipText"),
  },

  {
    title: i18n.__("developerBenefitsTitle"),
    text: i18n.__("developerBenefitsText"),
  },
  {
    title: i18n.__("restrictionsTitle"),
    text: i18n.__("restrictionsText"),
  },
  {
    title: i18n.__("confidentialityTitle"),
    text: i18n.__("confidentialityText"),
  },
  {
    title: i18n.__("nondisclosureTitle"),
    text: i18n.__("nondisclosureText"),
  },
  {
    title: i18n.__("confidentialTitle"),
    text: i18n.__("confidentialText"),
  },
  {
    title: i18n.__("developerContentLicenseTitle"),
    text: i18n.__("developerContentLicenseText"),
  },
  {
    title: i18n.__("developerTechnicalSupportTitle"),
    text: i18n.__("developerTechnicalSupportText"),
  },
  { text: i18n.__("developerTechnicalSupportText2") },
  { text: i18n.__("developerTechnicalSupportText3") },
  {
    title: i18n.__("amendmentsTitle"),
    text: i18n.__("amendmentsText"),
  },
  {
    title: i18n.__("devTerminationTitle"),
    text: i18n.__("devTerminationText"),
  },
  {
    title: i18n.__("independentDevelopmentTitle"),
    text: i18n.__("independentDevelopmentText"),
  },
  {
    title: i18n.__("useOfTrademarksTitle"),
    text: i18n.__("useOfTrademarksText"),
  },
  {
    title: i18n.__("devNoWarrantyTitle"),
    text: i18n.__("devNoWarrantyText"),
  },
  { text: i18n.__("devNoWarrantyText2") },

  {
    title: i18n.__("devDisclaimerOfLiabilityTitle"),
    text: i18n.__("devDisclaimerOfLiabilityText"),
  },
  {
    title: i18n.__("devThirdPartyTitle"),
    text: i18n.__("devThirdPartyText"),
  },
  {
    title: i18n.__("exportControlTitle"),
    text: i18n.__("exportControlText"),
  },
  {
    title: i18n.__("devGoverningLawTitle"),
    text: i18n.__("devGoverningLawText"),
  },
  {
    title: i18n.__("devMiscellaneousTitle"),
    text: i18n.__("devMiscellaneousText"),
  },
];
const TermsOfUse = props => {
  console.log("Terms ", props);
  const { nextStepAction } = useAccountContext();

  const { colors } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [decline, setDecline] = useState(false);

  // const _handleScroll = e => {
  //   const bottom =
  //     e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

  //   if (bottom) {
  //     setScrolled(true);
  //   }
  // };

  const declineTerms = e => {
    setDecline(true);
    e.preventDefault();
  };
  const approveTerms = e => {
    nextStepAction(2);
  };
  const onDialogClose = (e, action) => {
    setDecline(false);
    e.preventDefault();
  };
  const onDialogClick = (e, action) => {
    setDecline(false);
    if (action === "decline") {
      nextStepAction(0);
    }
    e.preventDefault();
  };

  return (
    <React.Fragment>
      {decline && (
        <DeclineDialog onClose={onDialogClose} onButtonClick={onDialogClick} />
      )}
      <Container>
        <Box textAlign="left" mb={25} mt={4}>
          {/* <Text mb={16} textStyle="h2">
            {i18n.__("devTermsTitle")}
          </Text> */}
          <Text textStyle="h6" bold color="#ADA9AB">
            {i18n.__("devTermsLastUpdated")}
          </Text>
        </Box>
        <Box mb={20} height={350}>
          <StyledBox
            height={"100%"}
            colors={colors}
            // onScroll={_handleScroll}
          >
            <>
              <Text fontSize="xxs">{i18n.__("devTermsText1")}</Text>
              <Text fontSize="xxs">{i18n.__("devTermsText2")}</Text>
              {texts.map((t, i) => (
                <div key={i}>
                  <Text textStyle={"h6"} mt={5}>
                    {t.title}
                  </Text>
                  <Text as={"p"} textStyle={"caption"} mt={3}>
                    {t.text}
                  </Text>
                </div>
              ))}
            </>
          </StyledBox>
        </Box>
        <Flex mb={12}>
          <input
            type="checkbox"
            onChange={() => {
              setScrolled(preValue => !preValue);
            }}
          />
          <Text as={"p"} textStyle={"caption"} ml={8}>
            I have read and understood Prifinas terms
          </Text>
        </Flex>
        <Box display={"inline-flex"} justifyContent="center">
          <Flex>
            <C.OutlineButton
              variation={"outline"}
              colorStyle={"error"}
              onClick={declineTerms}
            >
              {i18n.__("declineButton")}
            </C.OutlineButton>
          </Flex>

          <Flex ml={99}>
            <Button disabled={!scrolled} onClick={approveTerms}>
              {i18n.__("approveButton")}
            </Button>
          </Flex>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default TermsOfUse;
