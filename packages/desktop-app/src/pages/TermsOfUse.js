import React, { useState } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";

import DeclineDialog from "../components/DeclineDialog";
import styled from "styled-components";

import { i18n, useAccountContext } from "@prifina-apps/utils";

i18n.init();

const Container = styled(Flex)`
  flex-direction: column;
  height: 534px;
  width: 354px;
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
    title: i18n.__("introductionTitle"),
    text: i18n.__("introductionText"),
  },

  {
    title: i18n.__("serviceTitle"),
    subtitle: [
      { title: i18n.__("accountSubtitle"), text: i18n.__("accountText") },
      { title: i18n.__("dataCloudSubtitle"), text: i18n.__("dataCloudText") },
      { title: i18n.__("privacySubtitle"), text: i18n.__("privacyText") },
      {
        title: i18n.__("servicesAndContentSubtitle"),
        text: i18n.__("servicesAndContentText"),
      },
      {
        title: i18n.__("allServicesSubtitle"),
        text: i18n.__("allServicesText"),
      },
      {
        title: i18n.__("appStoreContentSubtitle"),
        text: i18n.__("appStoreContentText"),
      },
      {
        title: i18n.__("dataStorageSubtitle"),
        text: i18n.__("dataStorageText"),
      },
    ],
  },
  {
    title: i18n.__("yourOwnDataTitle"),
    text: i18n.__("yourOwnDataText"),
  },
  {
    title: i18n.__("appStoreTermsTitle"),

    subtitle: [
      {
        title: i18n.__("appStoreContentSubtitle"),
        text: i18n.__("appStoreContentText"),
      },
      {
        title: i18n.__("appMaintenanceSubtitle"),
        text: i18n.__("appMaintenanceText"),
      },
      {
        title: i18n.__("endUserLicenseSubtitle"),
        text: i18n.__("endUserLicenseText"),
      },
      {
        title: i18n.__("scopeOfLicenseSubtitle"),
        text: i18n.__("scopeOfLicenseText"),
      },
      {
        title: i18n.__("useOfDataSubtitle"),
        text: i18n.__("useOfDataText"),
      },
      {
        title: i18n.__("terminationSubtitle"),
        text: i18n.__("terminationText"),
      },
      {
        title: i18n.__("externalServicesSubtitle"),
        text: i18n.__("externalServicesText"),
      },
      {
        title: i18n.__("noWarrantySubtitle"),
        text: i18n.__("noWarrantyText"),
      },
      {
        title: i18n.__("limitationOfLiabilitySubtitle"),
        text: i18n.__("limitationOfLiabilityText"),
      },
      {
        title: i18n.__("gSubtitle"),
        text: i18n.__("gText"),
      },
      {
        title: i18n.__("hSubtitle"),
        text: i18n.__("hText"),
      },
    ],
  },
  {
    title: i18n.__("miscellaneousTitle"),

    subtitle: [
      {
        title: i18n.__("definitionSubtitle"),
        text: i18n.__("definitionText"),
      },
      {
        title: i18n.__("contractChangesSubtitle"),
        text: i18n.__("contractChangesText"),
      },
      {
        title: i18n.__("thirdPartySubtitle"),
        text: i18n.__("thirdPartyText"),
      },
      {
        title: i18n.__("intellectualPropertySubtitle"),
        text: i18n.__("intellectualPropertyText"),
      },
      {
        title: i18n.__("suspensionOfServicesSubtitle"),
        text: i18n.__("suspensionOfServicesText"),
      },
      {
        title: i18n.__("warrantyDisclaimerSubtitle"),
        text: i18n.__("warrantyDisclaimerText"),
      },
      {
        title: i18n.__("waiverSubtitle"),
        text: i18n.__("waiverText"),
      },
      {
        title: i18n.__("governingLawSubtitle"),
        text: i18n.__("governingLawText"),
      },
      {
        title: i18n.__("otherProvisionsSubtitle"),
        text: i18n.__("otherProvisionsText"),
      },
    ],
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
        <Box textAlign="left" mb={10}>
          <Text textStyle={"caption"}>{i18n.__("termsLastUpdated")}</Text>
        </Box>
        <Box mb={22}>
          <Text textStyle={"caption"} bold>
            {i18n.__("termsText")}
          </Text>
        </Box>
        <Box mb={8} height={313}>
          <StyledBox
            height={"100%"}
            colors={colors}
            //  onScroll={_handleScroll}
          >
            {texts.map((t, i) => (
              <div key={i}>
                <React.Fragment key={"text-" + i}>
                  <Text textStyle={"h6"} mt={5}>
                    {t.title}
                  </Text>
                  <Text as={"p"} textStyle={"caption"} mt={3}>
                    {t.text}
                  </Text>
                </React.Fragment>

                {t.subtitle != undefined &&
                  t.subtitle.map((c, e) => (
                    <div key={e}>
                      <Text textStyle={"h6"} mt={5}>
                        {c.title}
                      </Text>
                      <Text as={"p"} textStyle={"caption"} mt={3}>
                        {c.text}
                      </Text>
                    </div>
                  ))}
              </div>
            ))}
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

        <Box display={"inline-flex"}>
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
      </Container>
    </React.Fragment>
  );
};

export default TermsOfUse;
