import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { layout } from 'styled-system'
import Image from "./Image";
import {TableInformation} from "./TableInformation";
import Button from "./Button";
import { ReactComponent as Vector4 } from '../assets/Vector-4.svg';
import { Box, Text } from "@blend-ui/core";
import colors from "../lib/colors";
import imageFile from '../assets/Adventure_icon.svg';
import i18n from "../lib/i18n";
i18n.init();


const AppDetailLeftContainer = ({ user }) => {
    const BrowseAppsBox = styled.div`     
      ${layout}
    `;    
  
  return (
    <BrowseAppsBox width="230px">
      <Text as={"h4"} fontSize={18} lineHeight={"30.36px"} color={colors.text_h4} mb="5px"><Vector4 /> {i18n.__("appBrowseApps")} </Text> 
      <Box>
        <Image 
          src={imageFile} 
          alt={"App Icon"} 
          className={[`storybook-image--app-thumbnail`]}
        />

        <Box>
          <Button
          btnType="primary"
          fullWidth={true}
          label={i18n.__("appInstall")}
          variant="solid"
          className="mt-3 mb-2"
          />
        </Box>
        <Box>
          <Button
            btnType="secondary"
            fullWidth={true}
            label={i18n.__("appReportAppIssues")}
            size="medium"
            variant="outline"
            className=" mb-2"
          />
        </Box>
        <Box>
          <Button
            btnType="secondary"
            fullWidth={true}
            label={i18n.__("appEmailSupport")}
            size="medium"
            variant="outline"
            className=" mb-4"
          />
        </Box>
        <Box>
          <Text as={"h4"} fontSize={18} lineHeight={"30.36px"} color={colors.text_h4} mb="5px">{i18n.__("appDataPermissions")}</Text>
          <Text as={"p"} mt={2} fontSize={12} lineHeight={"15px"}  color={colors.text_p}>{i18n.__("appDataPermissionsData")}</Text>
        </Box>
        <Box>
          <Text as={"h4"} fontSize={18} lineHeight={"30.36px"} color={colors.text_h4} mb="5px">{i18n.__("appCompatibility")}</Text>
          <Text as={"p"} mt={2} fontSize={12} lineHeight={"15px"} color={colors.text_p}>{i18n.__("appCompatibilityData")}</Text>
        </Box>
        <TableInformation />
      </Box>
    </BrowseAppsBox>
  )
}
AppDetailLeftContainer.propTypes = {
  user: PropTypes.shape({})
};

AppDetailLeftContainer.defaultProps = {
  user: null,
};

export default AppDetailLeftContainer;