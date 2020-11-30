// MyComponent.stories.js

import React from 'react';
import { Box, Text, useTheme } from "@blend-ui/core";
import styled from "styled-components";
import { space, color, layout, flexbox , typography, border, position} from 'styled-system'
import colors from "../lib/colors";
import PropTypes from 'prop-types';
import Ellipse61 from '../assets/Ellipse61.png';
import Ellipse62 from '../assets/Ellipse62.png';
import Ellipse63 from '../assets/Ellipse63.png';
import Ellipse64 from '../assets/Ellipse64.png';
import Ellipse65 from '../assets/Ellipse65.png';
import Ellipse66 from '../assets/Ellipse66.png';
import Ellipse67 from '../assets/Ellipse67.png';
import Ellipse68 from '../assets/Ellipse68.png';
import Button from "./Button";



const TableListing = (props) => {   
  const theme = useTheme();
  // console.log("props",props) 
  const TableBox = styled.table`
    ${space}       
    ${typography}       
  `;
  const TableThead = styled.thead`
  `;
  const TableTbody = styled.tbody`
  `;
  const TableBoxIteam = styled.tr`
    &:last-child:td{
      border-bottom: 0px solid $table-border-color;
    }
  `;
  const TableTheadIteam = styled.th`
    ${space}  
    ${typography}  
    ${color}  
    &:nth-child(2){
      text-align: left;
    }
  `;
  const TableTbodyIteam = styled.td`
    ${space}  
    ${typography}  
    ${color}  
    ${border}
    ${layout}
    
    img{ 
      height: 28px;
      object-fit: cover;
    }
    &:nth-child(1){
      padding-left: 0px;
      text-align: left;
      display: flex;
    }
    &:nth-child(2){
        text-align: left;
    }
    &:nth-child(4){
      a{
        width: 86px;
        display: flex;
        height: 28px;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        padding: 5px 15px;
        text-decoration: none;
        text-align: center;            
      }
    }
    &:last-child{
      a{
        width: 131px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 28px;
        border-radius: 3rem;
        padding: 5px 15px;
        text-decoration: none;
        text-align: center;
      }
    }        
  `;
  const ViewFacebookBtn = styled.a`
    background: ${colors.fb};
    color: ${theme.colors.textLight};
  `;
  const ViewYoutubeBtn = styled.a`
    background: ${colors.youtube};
    color: ${theme.colors.textLight};
  `;
  const ViewlinkedinBtn = styled.a`
    background: ${colors.linkedin};
    color: ${theme.colors.textLight};
  `;
  const ViewTwitterBtn = styled.a`
    background: ${colors.twitter};
    color: ${theme.colors.textLight};
  `;
  const ViewInstagramBtn = styled.a`
    background: ${colors.instgram};
    color: ${theme.colors.textLight};
  `;

  const TypeFacebookBtn = styled.a`
    background: ${colors.fb_btn};
    color: ${colors.fb};
  `;
  const TypeYoutubeBtn = styled.a`
    background: ${colors.youtube_btn};
    color: ${colors.youtube};
  `;
  const TypelinkedinBtn = styled.a`
    background: ${colors.linkedin_btn};
    color: ${colors.linkedin};
  `;
  const TypeTwitterBtn = styled.a`
    background: ${colors.twitter_btn};
    color: ${colors.twitter};
  `;
  const TypeInstagramBtn = styled.a`
    background: ${colors.instgram_btn};
    color: ${colors.instgram};
  `;
  return(
    <Box>
      <TableBox width="100%" mt="25px">
        <TableThead>

          <TableBoxIteam>
            <TableTheadIteam font-size="14px" padding="10px" textAlign="center" color={colors.text_h4}>{props.headTable.image}</TableTheadIteam>
            <TableTheadIteam font-size="14px" padding="10px" textAlign="center" color={colors.text_h4}>{props.headTable.full_name}</TableTheadIteam>
            <TableTheadIteam font-size="14px" padding="10px" textAlign="center" color={colors.text_h4}>{props.headTable.alias}</TableTheadIteam>
            <TableTheadIteam font-size="14px" padding="10px" textAlign="center" color={colors.text_h4}>{props.headTable.app}</TableTheadIteam>
            <TableTheadIteam font-size="14px" padding="10px" textAlign="center" color={colors.text_h4}>{props.headTable.relationship}</TableTheadIteam>
            <TableTheadIteam font-size="14px" padding="10px" textAlign="center" color={colors.text_h4}>{props.headTable.source}</TableTheadIteam>
            <TableTheadIteam font-size="14px" padding="10px" textAlign="center" color={colors.text_h4}>{props.headTable.data_connect}</TableTheadIteam>
            <TableTheadIteam font-size="14px" padding="10px" textAlign="center" color={colors.text_h4}>{props.headTable.latest_interaction}</TableTheadIteam>
            <TableTheadIteam font-size="14px" padding="10px" textAlign="center" color={colors.text_h4}>{props.headTable.action}</TableTheadIteam>
          </TableBoxIteam>

        </TableThead>

        <TableTbody>
          {props.dataTable.length > 0 && props.dataTable.map(row => {
            let app = <TypeInstagramBtn href="#">Facebook</TypeInstagramBtn>
            let action = <ViewInstagramBtn href="#">View in Facebook</ViewInstagramBtn>
            if(row.app === 'Facebook'){
              app = <TypeFacebookBtn href="#">Facebook</TypeFacebookBtn>
              action = <ViewFacebookBtn href="#">View in Facebook</ViewFacebookBtn>
            }else if(row.app === 'Twitter'){
              app = <TypeTwitterBtn href="#">Facebook</TypeTwitterBtn>
              action = <ViewTwitterBtn href="#">View in Facebook</ViewTwitterBtn>
            }else if(row.app === 'LinkedIn'){
              app = <TypelinkedinBtn href="#">Facebook</TypelinkedinBtn>
              action = <ViewlinkedinBtn href="#">View in Facebook</ViewlinkedinBtn>
            }else if(row.app === 'Youtube'){
              app = <TypeYoutubeBtn href="#">Facebook</TypeYoutubeBtn>
              action = <ViewYoutubeBtn href="#">View in Facebook</ViewYoutubeBtn>
            }
            return (
              <TableBoxIteam>
                <TableTbodyIteam fontSize="12px" fontWeight="400" textAlign="center" p="10px" color={colors.text_h4} borderBottom={"1px solid "+ colors.table_bd_b} minHeight="53px"><img src={row.image} className="listingUserProfileImage" /></TableTbodyIteam>
                <TableTbodyIteam fontSize="12px" fontWeight="400" textAlign="center" p="10px" color={colors.text_h4} borderBottom={"1px solid "+ colors.table_bd_b} minHeight="53px">{row.full_name}</TableTbodyIteam>
                <TableTbodyIteam fontSize="12px" fontWeight="400" textAlign="center" p="10px" color={colors.text_h4} borderBottom={"1px solid "+ colors.table_bd_b} minHeight="53px">{row.alias}</TableTbodyIteam>
                <TableTbodyIteam fontSize="12px" fontWeight="400" textAlign="center" p="10px" color={colors.text_h4} borderBottom={"1px solid "+ colors.table_bd_b} minHeight="53px">
                  {app}
                </TableTbodyIteam>
                <TableTbodyIteam fontSize="12px" fontWeight="400" textAlign="center" p="10px" color={colors.text_h4} borderBottom={"1px solid "+ colors.table_bd_b} minHeight="53px">{row.relationship}</TableTbodyIteam>
                <TableTbodyIteam fontSize="12px" fontWeight="400" textAlign="center" p="10px" color={colors.text_h4} borderBottom={"1px solid "+ colors.table_bd_b} minHeight="53px">{row.source}</TableTbodyIteam>
                <TableTbodyIteam fontSize="12px" fontWeight="400" textAlign="center" p="10px" color={colors.text_h4} borderBottom={"1px solid "+ colors.table_bd_b} minHeight="53px">{row.data_connect}</TableTbodyIteam>
                <TableTbodyIteam fontSize="12px" fontWeight="400" textAlign="center" p="10px" color={colors.text_h4} borderBottom={"1px solid "+ colors.table_bd_b} minHeight="53px">{row.latest_interaction}</TableTbodyIteam>
                <TableTbodyIteam fontSize="12px" fontWeight="400" textAlign="center" p="10px" color={colors.text_h4} borderBottom={"1px solid "+ colors.table_bd_b} minHeight="53px">
                  {action}
                </TableTbodyIteam>
              </TableBoxIteam>
            )  
          })}
        </TableTbody>

      </TableBox>
    </Box>
  );
}


TableListing.propTypes = {
  user: PropTypes.shape({})
};

TableListing.defaultProps = {
  user: null,
};

export default TableListing;