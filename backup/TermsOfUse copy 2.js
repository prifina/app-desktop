import React, { useState } from "react";
import { Box, Flex, Button, Text, useTheme } from "@blend-ui/core";
import { useAppContext } from "../lib/contextLib";
import { Auth } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

import ProgressContainer from "../components/ProgressContainer";
import DeclineDialog from "../components/DeclineDialog";
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
const TermsOfUse = ({ nextStep, fields, ...props }) => {
  console.log("Terms ", props);
  const { AUTHConfig } = useAppContext();
  Auth.configure(AUTHConfig);

  const { colors } = useTheme();
  //console.log("THEME ", colors);
  const [scrolled, setScrolled] = useState(false);
  const [decline, setDecline] = useState(false);
  const [isActive, setActive] = useState(false);
  const _handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    //console.log(e.target);
    //console.log(bottom);
    if (bottom) {
      setScrolled(true);
    }
  };
  const declineTerms = (e) => {
    setDecline(true);
    e.preventDefault();
  };
  const approveTerms = async (e) => {
    setActive(true);
    /* create account */

    const uuid = uuidv4();
    try {
      /*
      const user = {
        username: uuid,
        password: fields.password.value,
        attributes: {
          email: fields.email.value,
          phone_number: fields.regionCode + fields.phone.value,
          family_name: fields.lastName.value,
          given_name: fields.firstName.value,
          name: fields.username.value,
        },
      };
*/

      let phoneNumber = fields.phone.value;
      if (phoneNumber.startsWith("0")) {
        phoneNumber = phoneNumber.substr(1);
      }
      const { user } = await Auth.signUp({
        username: uuid,
        password: fields.password.value,
        attributes: {
          email: fields.email.value,
          phone_number: fields.regionCode + phoneNumber,
          family_name: fields.lastName.value,
          given_name: fields.firstName.value,
          /* name: fields.username.value, */
          preferred_username: fields.username.value,
        },
      });
      console.log(user);

      // initial signIn... so can verify email/phone...
      const currentUser = await Auth.signIn(
        fields.username.value,
        fields.password.value
      );
      //const mfa = await Auth.setPreferredMFA(currentUser, "SMS");
      //console.log("MFA ", mfa);
      const session = await Auth.currentSession();
      //onAction("email");
      nextStep(2, session);
    } catch (error) {
      console.log("error signing up:", error);
    }

    // e.preventDefault();
  };
  const onDialogClose = (e, action) => {
    console.log("CLOSE ", e, action);
    setDecline(false);
    e.preventDefault();
  };
  const onDialogClick = (e, action) => {
    console.log("BUTTON ", e, action);
    setDecline(false);
    if (action === "decline") {
      // back to create account page
      nextStep(1);
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

        <Box mt={63} display={isActive ? "block" : "inline-flex"}>
          {!isActive && (
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
          )}
          {isActive && (
            <Box textAlign={"center"}>
              <Button disabled={true}>{i18n.__("accountButton")}</Button>
            </Box>
          )}
        </Box>
      </ProgressContainer>
    </React.Fragment>
  );
};

export default TermsOfUse;
