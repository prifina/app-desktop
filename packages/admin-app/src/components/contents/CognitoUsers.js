/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import React, { useState, useRef } from "react";

import {
  Input, Select, Flex, Button, Box,
} from "@blend-ui/core";
import styled from "styled-components";
// import PropTypes from "prop-types";
import shallow from "zustand/shallow";
import { useStore } from "../../stores/PrifinaStore";

const StyledInput = styled(Input)`
height:25px;
padding-bottom:0px;
padding-top:0px;
margin-left:10px;
margin-right:10px;
`;
const StyledJSON = styled(Box)`
margin-top:15px;
margin-bottom:15px;
height: 350px;
width: 550px;
overflow-y: scroll;
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background-color: #9993 !important;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  height: 77px;
  background-color: #9999 !important;
}


::-webkit-scrollbar-thumb:vertical {
  height: 77px;
}
`;

const Content = () => {
  const { getCognitoUserDetails, updateCognitoUserDetails } = useStore(
    state => ({
      getCognitoUserDetails: state.getCognitoUserDetails,
      updateCognitoUserDetails: state.updateCognitoUserDetails,
    }),
    shallow,
  );

  const inputs = useRef({});
  const [cognitoDetails, setCognitoDetails] = useState(null);

  const formattedJSON = jsonObj => {
    if (jsonObj === null) {
      return "<span />";
    }

    jsonObj.UserCreateDate = jsonObj.UserCreateDate.replace(/:/g, "#");
    jsonObj.UserLastModifiedDate = jsonObj.UserLastModifiedDate.replace(/:/g, "#");

    // console.log("FORMAT ", jsonObj);
    const JSONString = JSON.stringify(jsonObj).replace(/custom:/g, "custom_");

    let regexString = "";
    // for tracking matches, in particular the curly braces
    const brace = {
      brace: 0,
    };

    regexString = JSONString.replace(
      /({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g,
      (m, p1) => {
        const returnFunction = () =>
          `<div style="text-indent: ${brace.brace * 20}px;">${p1}</div>`;
        let returnString = 0;
        if (p1.lastIndexOf("{") === p1.length - 1) {
          returnString = returnFunction();
          brace.brace += 1;
        } else if (p1.indexOf("}") === 0) {
          brace.brace -= 1;
          returnString = returnFunction();
        } else {
          returnString = returnFunction();
        }
        return returnString;
      },
    );

    // console.log(regexString);
    // regexString.replace(/custom_/g, "custom:");
    regexString = regexString.replace(/#/g, ":");

    return regexString.replace(/custom_/g, "custom:");
  };

  const getAttrValue = (attr, details) => {
    let matchAttr = attr;
    if (attr === "username") {
      matchAttr = "preferred_username";
    }
    const attrValue = details.Attributes.filter(m => (m.Name === matchAttr));
    // console.log("ATTR ", attrValue);
    return attrValue[0].Value;
  };
  return (
    <>
      <Box m="20px">
        <Flex>
          <Flex>
            <Select
              size="sm"
              ref={ref => {
                if (ref) {
                  inputs.current.select = ref;
                }
              }}
            >
              <option value="username">Username</option><option value="email">Email</option><option value="phone_number">Phone number</option>
            </Select>
          </Flex>
          <Flex>
            <StyledInput
              ref={ref => {
                if (ref) {
                  inputs.current.search = ref;
                }
              }}
            />
          </Flex>
          <Flex>
            <Button
              size="xs"
              onClick={async () => {
                if (inputs.current.search.value !== "") {
                  // console.log("GET ", inputs.current.select.value);
                  // console.log("GET ", inputs.current.search.value);
                  const details = await getCognitoUserDetails({ attrName: inputs.current.select.value, attrValue: inputs.current.search.value });
                  // console.log("DETAILS ", details);
                  const detailsJSON = JSON.parse(details.data.getCognitoUserDetails.result);
                  // UserCreateDate and UserLastModifiedDate are very long integers and converted to exp format...
                  detailsJSON.UserCreateDate = new Date(Math.trunc(detailsJSON.UserCreateDate) * 1000).toISOString();
                  detailsJSON.UserLastModifiedDate = new Date(Math.trunc(detailsJSON.UserLastModifiedDate) * 1000).toISOString();
                  // console.log("DETAILS ", detailsJSON);
                  if (inputs.current?.username) {
                    inputs.current.username.value = getAttrValue("username", detailsJSON);
                    inputs.current.email.value = getAttrValue("email", detailsJSON);
                    inputs.current.phone.value = getAttrValue("phone_number", detailsJSON);
                  }
                  setCognitoDetails(detailsJSON);

                  // console.log("DETAILS ", typeof details, details);
                }
              }}
            >Get
            </Button>
          </Flex>
        </Flex>
      </Box>
      {cognitoDetails !== null && (
        <Box>
          <StyledJSON>
            <pre style={{ width: "100%" }}>
              <span dangerouslySetInnerHTML={{ __html: formattedJSON(cognitoDetails) }} />
            </pre>
          </StyledJSON>
          <Box style={{ marginTop: "15px" }}>
            <Flex>
              <Flex>
                <StyledInput
                  defaultValue={getAttrValue("username", cognitoDetails)}
                  ref={ref => {
                    if (ref) {
                      inputs.current.username = ref;
                    }
                  }}
                />
              </Flex>
              <Flex>
                <Button
                  size="xs"
                  onClick={async () => {
                    if (inputs.current.username.value !== "") {
                      await updateCognitoUserDetails({ userName: cognitoDetails.Username, attrName: "preferred_username", attrValue: inputs.current.username.value });
                    }
                  }}
                >Update
                </Button>
              </Flex>
            </Flex>
          </Box>
          <Box style={{ marginTop: "5px" }}>
            <Flex>
              <Flex>
                <StyledInput
                  defaultValue={getAttrValue("email", cognitoDetails)}
                  ref={ref => {
                    if (ref) {
                      inputs.current.email = ref;
                    }
                  }}
                />
              </Flex>
              <Flex>
                <Button
                  size="xs"
                  onClick={async () => {
                    if (inputs.current.email.value !== "") {
                      await updateCognitoUserDetails({ userName: cognitoDetails.Username, attrName: "email", attrValue: inputs.current.email.value });
                    }
                  }}
                >Update
                </Button>
              </Flex>
            </Flex>
          </Box>
          <Box style={{ marginTop: "5px" }}>
            <Flex>
              <Flex>
                <StyledInput
                  defaultValue={getAttrValue("phone_number", cognitoDetails)}
                  ref={ref => {
                    if (ref) {
                      inputs.current.phone = ref;
                    }
                  }}
                />
              </Flex>
              <Flex>
                <Button
                  size="xs"
                  onClick={async () => {
                    if (inputs.current.phone.value !== "") {
                      await updateCognitoUserDetails({ userName: cognitoDetails.Username, attrName: "phone_number", attrValue: inputs.current.phone.value });
                    }
                  }}
                >Update
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Box>
      )}

    </>
  );
};

/*
Content.propTypes = {
  userCount: PropTypes.number,
  cognitoMetricImage: PropTypes.object,
  metrics: PropTypes.array,
};
*/
Content.displayName = "CognitoUsers";

export default Content;
