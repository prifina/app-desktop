import React, { useEffect, useState } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";

import DeclineDialog from "../components/DeclineDialog";
import styled from "styled-components";

import { useTranslate, } from "@prifina-apps/utils";

//import { useStore } from "../stores/PrifinaStore";

import { useStore } from "../utils-v2/stores/PrifinaStore";
import PropTypes from "prop-types";

const StyledBox = styled(Box)`
  scrollbar-width: 4px;
  scrollbar-color: ${props =>
    props.theme.colors ? props.theme.colors.baseSecondary : "#00847A"}
    ${props =>
    props.theme.colors ? props.theme.colors.baseTertiary : "rgba(0, 132, 122, 0.1)"};

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
    props.theme.colors ? props.theme.colors.baseTertiary : "rgba(0, 132, 122, 0.1)"};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    height: 77px;
    background-color: ${props =>
    props.theme.colors ? props.theme.colors.baseSecondary : "#00847A"};
  }
  ::-webkit-scrollbar-thumb:vertical {
    height: 77px;
  }
`;

const TermsContainer = styled(Box)`
border-radius:20px;
width:421px;
min-height:437px;
background-color:${props => props.theme.colors.baseWhite};
padding-left:29px;
padding-right:28px;
padding-bottom:15px;
margin-top:20px;
`;
const TermsOfUse = ({ declineTerms, approveTerms }) => {


  const setActiveIndex = useStore(state => state.setActiveIndex);

  const { __ } = useTranslate();

  const texts = [
    {
      title: __("introductionTitle"),
      text: __("introductionText"),
    },

    {
      title: __("serviceTitle"),
      subtitle: [
        { title: __("accountSubtitle"), text: __("accountText") },
        { title: __("dataCloudSubtitle"), text: __("dataCloudText") },
        { title: __("privacySubtitle"), text: __("privacyText") },
        {
          title: __("servicesAndContentSubtitle"),
          text: __("servicesAndContentText"),
        },
        {
          title: __("allServicesSubtitle"),
          text: __("allServicesText"),
        },
        {
          title: __("appStoreContentSubtitle"),
          text: __("appStoreContentText"),
        },
        {
          title: __("dataStorageSubtitle"),
          text: __("dataStorageText"),
        },
      ],
    },
    {
      title: __("yourOwnDataTitle"),
      text: __("yourOwnDataText"),
    },
    {
      title: __("appStoreTermsTitle"),

      subtitle: [
        {
          title: __("appStoreContentSubtitle"),
          text: __("appStoreContentText"),
        },
        {
          title: __("appMaintenanceSubtitle"),
          text: __("appMaintenanceText"),
        },
        {
          title: __("endUserLicenseSubtitle"),
          text: __("endUserLicenseText"),
        },
        {
          title: __("scopeOfLicenseSubtitle"),
          text: __("scopeOfLicenseText"),
        },
        {
          title: __("useOfDataSubtitle"),
          text: __("useOfDataText"),
        },
        {
          title: __("terminationSubtitle"),
          text: __("terminationText"),
        },
        {
          title: __("externalServicesSubtitle"),
          text: __("externalServicesText"),
        },
        {
          title: __("noWarrantySubtitle"),
          text: __("noWarrantyText"),
        },
        {
          title: __("limitationOfLiabilitySubtitle"),
          text: __("limitationOfLiabilityText"),
        },
        {
          title: __("gSubtitle"),
          text: __("gText"),
        },
        {
          title: __("hSubtitle"),
          text: __("hText"),
        },
      ],
    },
    {
      title: __("miscellaneousTitle"),

      subtitle: [
        {
          title: __("definitionSubtitle"),
          text: __("definitionText"),
        },
        {
          title: __("contractChangesSubtitle"),
          text: __("contractChangesText"),
        },
        {
          title: __("thirdPartySubtitle"),
          text: __("thirdPartyText"),
        },
        {
          title: __("intellectualPropertySubtitle"),
          text: __("intellectualPropertyText"),
        },
        {
          title: __("suspensionOfServicesSubtitle"),
          text: __("suspensionOfServicesText"),
        },
        {
          title: __("warrantyDisclaimerSubtitle"),
          text: __("warrantyDisclaimerText"),
        },
        {
          title: __("waiverSubtitle"),
          text: __("waiverText"),
        },
        {
          title: __("governingLawSubtitle"),
          text: __("governingLawText"),
        },
        {
          title: __("otherProvisionsSubtitle"),
          text: __("otherProvisionsText"),
        },
      ],
    },
  ];

  const { colors } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [decline, setDecline] = useState(false);

  useEffect(() => {
    setActiveIndex(1);
  }, []);

  const _handleScroll = e => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom) {
      setScrolled(true);
    }
  };
  const declineClick = e => {
    setDecline(true);
    e.preventDefault();
  };

  const onDialogClose = (e, action) => {
    setDecline(false);
    e.preventDefault();
  };
  const onDialogClick = (e, action) => {
    setDecline(false);
    if (action === "decline") {
      declineTerms(e);
    }
    e.preventDefault();
  };

  return (
    <TermsContainer>
      {decline && (
        <DeclineDialog onClose={onDialogClose} onButtonClick={onDialogClick} />
      )}
      <Box textAlign="center">
        <Text textStyle={"h3"} bold>
          {__("termsTitle")}
        </Text>
      </Box>

      <Box textAlign="center">
        <Text textStyle={"caption"} bold>
          {__("termsLastUpdated")}
        </Text>
      </Box>
      <Box mt={10}>
        <Text textStyle={"caption"} bold>
          {__("termsText")}
        </Text>
      </Box>
      <Box mt={22} height={313}>
        <StyledBox height={"100%"} onScroll={_handleScroll}>
          {/* {texts.map((t, i) => (
              <React.Fragment key={"text-" + i}>
                <Text textStyle={"h6"}>{t.title}</Text>
                <Text as={"p"} textStyle={"caption"}>
                  {t.text}
                </Text>
              </React.Fragment>
            ))} */}
          {texts.map((t, i) => (
            <React.Fragment key={"text-" + i}>
              <>
                <Text textStyle={"h6"} mt={5}>
                  {t.title}
                </Text>
                <Text as={"p"} textStyle={"caption"} mt={3}>
                  {t.text}
                </Text>
              </>
              {t.subtitle != undefined &&
                t.subtitle.map((c, e) => (
                  <div key={"sub-" + e}>
                    <Text textStyle={"h6"} mt={5}>
                      {c.title}
                    </Text>
                    <Text as={"p"} textStyle={"caption"} mt={3}>
                      {c.text}
                    </Text>
                  </div>
                ))}
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
              onClick={declineClick}
            >
              {__("declineButton")}
            </Button>
          </Flex>

          <Flex ml={99}>
            <Button disabled={!scrolled} onClick={approveTerms}>
              {__("approveButton")}
            </Button>
          </Flex>
        </React.Fragment>
      </Box>
    </TermsContainer>
  );
};

TermsOfUse.displayName = "TermsOfUse";

TermsOfUse.propTypes = {
  declineTerms: PropTypes.func.isRequired,
  approveTerms: PropTypes.func.isRequired
};

export default TermsOfUse;
