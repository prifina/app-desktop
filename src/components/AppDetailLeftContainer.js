import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import {ThumbnailImage} from "./Image";
import {TableInformation} from "./TableInformation";
import Button from "./Button";
import { ReactComponent as Vector4 } from '../assets/Vector-4.svg';
import { Box, Text, useTheme } from "@blend-ui/core";


const AppDetailLeftContainer = ({ user }) => {
  const { colors } = useTheme(); {
    const BrowseAppsBox = styled.div`     
      width:230px;
      h4{        
        color: #383838;
        margin-bottom: 5px;
      }
      p{
        color: #565656;
      }
    `;    
  
  return (
    <BrowseAppsBox>
      <Text as={"h4"} fontSize={18} lineHeight={"30.36px"}><Vector4 /> Browse Apps </Text> 
      <Box>
        <ThumbnailImage />

        <Box>
          <Button
          btnType="primary"
          fullWidth={true}
          label="Install"
          variant="solid"
          className="mt-3 mb-2"
          />
        </Box>
        <Box>
          <Button
            btnType="secondary"
            fullWidth={true}
            label="Report App Issues"
            size="medium"
            variant="outline"
            className=" mb-2"
          />
        </Box>
        <Box>
          <Button
            btnType="secondary"
            fullWidth={true}
            label="Email Support"
            size="medium"
            variant="outline"
            className=" mb-4"
          />
        </Box>
        <Box>
          <Text as={"h4"} mb={0} fontSize={18} lineHeight={"30.36px"}>Data Permissions</Text>
          <Text as={"p"} mt={2} fontSize={12} lineHeight={"15px"}>This data will only use data locally and no data will be shared out side of your data cloud.</Text>
        </Box>
        <Box>
          <Text as={"h4"}  mb={0} fontSize={18} lineHeight={"30.36px"}>Compatibility</Text>
          <Text as={"p"} mt={2} fontSize={12} lineHeight={"15px"}>This app shares the following profiles [Profile 1] [Profile 2] with third parties (Bank of America) and (Shazam) in order to provide the apps services.</Text>
        </Box>
        <TableInformation />
      </Box>
    </BrowseAppsBox>
  )
}
}
AppDetailLeftContainer.propTypes = {
  user: PropTypes.shape({})
};

AppDetailLeftContainer.defaultProps = {
  user: null,
};

export default AppDetailLeftContainer;