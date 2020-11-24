// MyComponent.stories.js

import React from 'react';
import styled from "styled-components";
import { Box, Text, useTheme } from "@blend-ui/core";
import i18n from "../lib/i18n";
i18n.init();


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
      <Text as={"h5"} fontSize={14} lineHeight={"20.36px"}>{i18n.__("appInformation")}</Text>
       
      <InformationList >

        <InformationListBody>

          <InformationListItem>
            <InformationListHead>{i18n.__("appDeveloper")}</InformationListHead>
            <InformationListItembody>{i18n.__("prifina")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>{i18n.__("appLastUpdated")}</InformationListHead>
            <InformationListItembody>{i18n.__("appLastUpdatedData")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>{i18n.__("appCategory")}</InformationListHead>
            <InformationListItembody>{i18n.__("appData")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>{i18n.__("appApproximateSize")}</InformationListHead>
            <InformationListItembody>{i18n.__("appTBD")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>{i18n.__("appLanguagesupport")}</InformationListHead>
            <InformationListItembody>{i18n.__("appLanguagesupportData")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>{i18n.__("appAge")}</InformationListHead>
            <InformationListItembody>18+</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>{i18n.__("appCompatibility")}</InformationListHead>
            <InformationListItembody>Win 10, MacOS</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead>{i18n.__("appInstallation")}</InformationListHead>            
            <InformationListHead></InformationListHead>    
          </InformationListItem>

          <InformationListItem>                    
            <InformationListItembody colSpan={2}>{i18n.__("appInstallationData")}</InformationListItembody>
          </InformationListItem>

        </InformationListBody>
        
      </InformationList>
    </TableInformationBox>
  );
}

