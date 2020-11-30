// MyComponent.stories.js

import React from 'react';
import styled from "styled-components";
import { Text } from "@blend-ui/core";
import { space, color, layout, flexbox , typography, border, position} from 'styled-system'
import colors from "../lib/colors";
import i18n from "../lib/i18n";
i18n.init();


export default {
  title: 'Table View',
};


export const TableInformation = () => {
  const TableInformationBox = styled.div`
    ${space}
  `;    
  const InformationList = styled.table`    
    ${space}
  `;   
  const InformationListHead = styled.th`
    ${space}
    ${color}
    ${layout}
    ${flexbox}
    ${typography}
    ${border}
    ${position}
    
  `;
  const InformationListBody = styled.tbody`
  `;   
  const InformationListItem = styled.tr`    
    &:last-child{
      th{
        border-bottom: 0px solid ${colors.table_bd};
      }
      td{
        border-bottom: 0px solid ${colors.table_bd};
        text-align: left;
      }
    }
  `;     
  const InformationListItembody = styled.td`
    ${space}
    ${color}
    ${layout}
    ${flexbox}
    ${typography}
    ${border}
    ${position}
     
  `;

  return (
    <TableInformationBox>
      <Text as={"h5"} fontSize={18} mb="10px" color={colors.text_h4} lineHeight={"20.36px"}>{i18n.__("appInformation")}</Text>
       
      <InformationList mb="20px">

        <InformationListBody>

          <InformationListItem>
            <InformationListHead 
              textAlign='left'
              fontSize='12px'
              fontWeight='bold'
              borderBottom={"1px solid " +colors.table_bd}
              width="50%"
              color={colors.text_h4}
              pb="6px"
            >
            {i18n.__("appDeveloper")}</InformationListHead>
            <InformationListItembody
              textAlign='right'
              fontSize='12px'
              fontWeight='400'
              borderBottom={"1px solid " +colors.table_bd} 
            >
            {i18n.__("prifina")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead 
              textAlign='left'
              fontSize='12px'
              fontWeight='bold'
              borderBottom={"1px solid " +colors.table_bd}
              width="50%"
              color={colors.text_h4}
              pb="6px"
            >{i18n.__("appLastUpdated")}</InformationListHead>
            <InformationListItembody
              textAlign='right'
              fontSize='12px'
              fontWeight='400'
              borderBottom={"1px solid " +colors.table_bd} 
            >
            {i18n.__("appLastUpdatedData")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead 
              textAlign='left'
              fontSize='12px'
              fontWeight='bold'
              borderBottom={"1px solid " +colors.table_bd}
              width="50%"
              color={colors.text_h4}
              pb="6px"
            >{i18n.__("appCategory")}</InformationListHead>
            <InformationListItembody
              textAlign='right'
              fontSize='12px'
              fontWeight='400'
              borderBottom={"1px solid " +colors.table_bd} 
            >
            {i18n.__("appData")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead 
              textAlign='left'
              fontSize='12px'
              fontWeight='bold'
              borderBottom={"1px solid " +colors.table_bd}
              width="50%"
              color={colors.text_h4}
              pb="6px"
            >{i18n.__("appApproximateSize")}</InformationListHead>
            <InformationListItembody
              textAlign='right'
              fontSize='12px'
              fontWeight='400'
              borderBottom={"1px solid " +colors.table_bd} 
            >
            {i18n.__("appTBD")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead 
              textAlign='left'
              fontSize='12px'
              fontWeight='bold'
              borderBottom={"1px solid " +colors.table_bd}
              width="50%"
              color={colors.text_h4}
              pb="6px"
            >{i18n.__("appLanguagesupport")}</InformationListHead>
            <InformationListItembody
              textAlign='right'
              fontSize='12px'
              fontWeight='400'
              borderBottom={"1px solid " +colors.table_bd} 
            >
            {i18n.__("appLanguagesupportData")}</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead 
              textAlign='left'
              fontSize='12px'
              fontWeight='bold'
              borderBottom={"1px solid " +colors.table_bd}
              width="50%"
              color={colors.text_h4}
              pb="6px"
            >{i18n.__("appAge")}</InformationListHead>
            <InformationListItembody
              textAlign='right'
              fontSize='12px'
              fontWeight='400'
              borderBottom={"1px solid " +colors.table_bd} 
            >
            18+</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead 
              textAlign='left'
              fontSize='12px'
              fontWeight='bold'
              borderBottom={"1px solid " +colors.table_bd}
              width="50%"
              color={colors.text_h4}
              pb="6px"
            >{i18n.__("appCompatibility")}</InformationListHead>
            <InformationListItembody
              textAlign='right'
              fontSize='12px'
              fontWeight='400'
              borderBottom={"1px solid " +colors.table_bd} 
            >
            Win 10, MacOS</InformationListItembody>
          </InformationListItem>

          <InformationListItem>
            <InformationListHead 
              textAlign='left'
              fontSize='12px'
              fontWeight='bold'
              borderBottom={"1px solid " +colors.table_bd}
              width="50%"
              color={colors.text_h4}
              pb="6px"
            >{i18n.__("appInstallation")}</InformationListHead>            
            <InformationListHead 
       
            ></InformationListHead>    
          </InformationListItem>

          <InformationListItem>                    
            <InformationListItembody colSpan={2}>{i18n.__("appInstallationData")}</InformationListItembody>
          </InformationListItem>

        </InformationListBody>
        
      </InformationList>
    </TableInformationBox>
  );
}

