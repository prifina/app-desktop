// MyComponent.stories.js

import React from 'react';
import { Box, Text, useTheme } from "@blend-ui/core";
import styled from "styled-components";
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
  // console.log("props",props) 
  const TableBox = styled.table`
    width: 100%;
    margin-top: 25px;       
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
    font-size: 14px;
    text-align: center;
    padding: 10px;
    color: #383838;
    &:nth-child(2){
      text-align: left;
    }
  `;
  const TableTbodyIteam = styled.td`
    font-size: 12px;
    font-weight: 400;
    border-bottom: 1px solid #EEEFF6;
    padding: 10px;
    text-align: center;
    color: #383838;
    min-height: 53px;
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
    background: #3B5998;
    color: #fff;
  `;
  const ViewYoutubeBtn = styled.a`
    background: #CD201F;
    color: #fff;
  `;
  const ViewlinkedinBtn = styled.a`
    background: #006699;
    color: #fff;
  `;
  const ViewTwitterBtn = styled.a`
    background: #01BBF6;
    color: #fff;
  `;
  const ViewInstagramBtn = styled.a`
    background: #924AC8;
    color: #fff;
  `;

  const TypeFacebookBtn = styled.a`
    background: rgba(59, 89, 152, 0.2);
    color: #3B5998;
  `;
  const TypeYoutubeBtn = styled.a`
    background: rgba(205, 32, 31, 0.2);
    color: #CD201F;
  `;
  const TypelinkedinBtn = styled.a`
    background: rgba(0, 102, 153, 0.2);
    color: #006699;
  `;
  const TypeTwitterBtn = styled.a`
    background: rgba(1, 187, 246, 0.2);
    color: #01BBF6;
  `;
  const TypeInstagramBtn = styled.a`
    background: rgba(146, 74, 200, 0.2);
    color: #924AC8;
  `;
  return(
    <Box>
      <TableBox >
        <TableThead>

          <TableBoxIteam>
            <TableTheadIteam>{props.headTable.image}</TableTheadIteam>
            <TableTheadIteam>{props.headTable.full_name}</TableTheadIteam>
            <TableTheadIteam>{props.headTable.alias}</TableTheadIteam>
            <TableTheadIteam>{props.headTable.app}</TableTheadIteam>
            <TableTheadIteam>{props.headTable.relationship}</TableTheadIteam>
            <TableTheadIteam>{props.headTable.source}</TableTheadIteam>
            <TableTheadIteam>{props.headTable.data_connect}</TableTheadIteam>
            <TableTheadIteam>{props.headTable.latest_interaction}</TableTheadIteam>
            <TableTheadIteam>{props.headTable.action}</TableTheadIteam>
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
                <TableTbodyIteam><img src={row.image} className="listingUserProfileImage" /></TableTbodyIteam>
                <TableTbodyIteam>{row.full_name}</TableTbodyIteam>
                <TableTbodyIteam>{row.alias}</TableTbodyIteam>
                <TableTbodyIteam>
                  {app}
                </TableTbodyIteam>
                <TableTbodyIteam>{row.relationship}</TableTbodyIteam>
                <TableTbodyIteam>{row.source}</TableTbodyIteam>
                <TableTbodyIteam>{row.data_connect}</TableTbodyIteam>
                <TableTbodyIteam>{row.latest_interaction}</TableTbodyIteam>
                <TableTbodyIteam>
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