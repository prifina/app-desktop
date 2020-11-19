// MyComponent.stories.js

import React from 'react';
import styled from "styled-components";
import { Box, Text, useTheme } from "@blend-ui/core";
export default {
  title: 'Table View',
};


export const TableInformation = () => {
  const TableInformationBox = styled.div`
    h5{        
      color: #383838;
      font-size: 18px ;
      margin-bottom: 10px;
    }
  `;    
  const InformationList = styled.table`    
    margin-bottom: 20px;
  `;   
  const InformationListHeader = styled.thead`    
  `;   
  const InformationListHead = styled.th`
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    border-bottom: 1px solid #EDEDED;
    width:50%;
    font-weight: bold;
    color: #383838;
    padding-bottom: 6px;
  `;
  const InformationListBody = styled.tbody`
  `;   
  const InformationListItem = styled.tr`    
    &:last-child{
      th{
        border-bottom: 0px solid #EDEDED;
      }
      td{
        border-bottom: 0px solid #EDEDED;
        text-align: left;
      }
    }
  `;     
  const InformationListItembody = styled.td`
    text-align: right;
    font-size: 12px;
    font-weight: 400;
    border-bottom: 1px solid #EDEDED;    
  `;

  return (
    <TableInformationBox>
      <Text as={"h5"} fontSize={14} lineHeight={"20.36px"}>Information</Text>
       
      <InformationList >

        <InformationListBody>

          <InformationListItem>
            <InformationListHead>Developer</InformationListHead>
            <InformationListItembody>Prifina</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>Last Updated</InformationListHead>
            <InformationListItembody>03/05/2020</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>Category</InformationListHead>
            <InformationListItembody>Data</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>Approximate Size</InformationListHead>
            <InformationListItembody>TBD</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>Language support</InformationListHead>
            <InformationListItembody>English (U.S.)</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>Age</InformationListHead>
            <InformationListItembody>18+</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>Compatibility</InformationListHead>
            <InformationListItembody>Win 10, MacOS</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>Installation</InformationListHead>            
            <InformationListHead></InformationListHead>    
          </InformationListItem>

          <InformationListItem>                    
            <InformationListItembody colSpan={2}> Download this app while signed into your Prifina account </InformationListItembody>
          </InformationListItem>

        </InformationListBody>
        
      </InformationList>
    </TableInformationBox>
  );
}

