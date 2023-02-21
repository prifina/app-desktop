import React from "react";

import { Box, Flex, Text, Select, useTheme } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";

import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";

import bxSun from "@iconify/icons-bx/sun";
import bxMoon from "@iconify/icons-bx/moon";

import styled, { keyframes } from "styled-components";

const breatheAnimation = keyframes`
0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
50% {opacity: 1.0;}
100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;}
webkit-animation: pulsate 0.03 ease-out;
webkit-animation-iteration-count: infinite; 
`;
const Circle = styled.div`
width: 9px;
height: 9px;
background-color: #62bd19;
border-radius: 50%;
position: absolute;

}
`;

const Ring = styled.div`
border: 3px solid #62bd19;
-webkit-border-radius: 30px;
height: 25px;
width: 25px;
position: absolute;
left: -8px;
top: -8px;
-webkit-animation: pulsate 2s ease-out;
-webkit-animation-iteration-count: infinite; 
opacity: 0.0
}
animation-name: ${breatheAnimation};
`;

const Container = styled.div`
  position: relative;
  margin-bottom: 5px;
  margin-left: 10px;
`;

const Breathe = () => {
  return (
    <Container>
      <Circle />
      <Ring />
    </Container>
  );
};

const TypeBadge = styled.span`
  height: 18px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 8px;
  padding-left: 8px;
  font-size: 10px;
  border: 1px solid ${props => (props.type === 2 ? "#FC62C1" : "#CB8E12")};
  color: ${props => (props.type === 2 ? "#FC62C1" : "#CB8E12")};
`;

const IconContainer = styled(Flex)`
  border-radius: 2px;
  padding: 4px;
  background: ${props => (props.disabled === true ? "#4B484A" : "gray")};
  height: 32px;
  width: 32px;
  cursor: pointer;
  border:${props => props.activeTheme ? "1px solid red" : "none"};
  :active {
    background: ${props => (props.disabled === true ? null : "lightgray")};
  }
`;

const IconButton = ({ icon, onClick, disabled, activeTheme }) => {
  return (
    <IconContainer onClick={onClick} disabled={disabled} activeTheme={activeTheme}>
      <BlendIcon iconify={icon} color="white" width="24px" />
    </IconContainer>
  );
};

const SandboxHeader = ({ appData, sandboxTheme, setSandboxTheme, setContainerSize }) => {
  //<Box height={`calc(100vh - 270px)`} >
  const { colors } = useTheme();

  const validUrl = true;
  const validSizes = ['300x300', '600x600', '300x600', '600x300'];
  return <>
    <Box>
      <Flex
        height="64px"
        bg="baseMuted"
        alignItems="center"
        justifyContent="space-between"
        padding="0px 24px 0px 24px"
      >
        <Flex alignItems="center">
          <BlendIcon
            size="18px"
            iconify={mdiArrowLeft}
            className="icon"
            color={colors.textPrimary}
            style={{ cursor: "pointer" }}
            onClick={() => {
              //history.goBack();
              //navigate(-1);
            }}
          />
          <Text ml={16} mr={100}>
            {appData.appName}
          </Text>
          <TypeBadge type={appData.appType}>
            {appData.appType === 1 ? "APPLICATION" : "WIDGET"}
          </TypeBadge>
          <Text ml={16} mr={8}>
            Remote Link Status
          </Text>
          {validUrl ? (
            <Breathe />
          ) : (
            <RedStatusCircle />
          )}
        </Flex>

        {appData.appType === 2 &&
          <Flex>
            <Text as="span" style={{ width: "205px" }} >Container Size:</Text>
            <Select

              size={"sm"}
              id={"container-size"}
              name={"container-size"}
              defaultValue={appData.selectedSize}
              onChange={(e) => {
                setContainerSize(e.target.value);
              }}
            >
              {validSizes.map((size, i) => {
                return <option key={"size-option-" + i} value={size}>{size}</option>
              })}

            </Select>
          </Flex>
        }
        <Flex>
          <IconButton activeTheme={sandboxTheme === 'light'} icon={bxSun} onClick={() => {
            setSandboxTheme("light")
          }
          } />

          <div style={{ marginLeft: 8 }}>
            <IconButton
              activeTheme={sandboxTheme === 'dark'}
              icon={bxMoon}
              onClick={() => {
                setSandboxTheme("dark")
              }}
            />
          </div>
        </Flex>

      </Flex>
    </Box>

  </>
}

export default SandboxHeader;