// MyComponent.stories.js

import React from 'react';
import { Box, Text, useTheme } from "@blend-ui/core";
import styled from "styled-components";
import Ellipse61 from '../assets/Ellipse61.png';
import Ellipse62 from '../assets/Ellipse62.png';
import Ellipse63 from '../assets/Ellipse63.png';
import Ellipse64 from '../assets/Ellipse64.png';
import Ellipse65 from '../assets/Ellipse65.png';
import Ellipse66 from '../assets/Ellipse66.png';
import Ellipse67 from '../assets/Ellipse67.png';
import Ellipse68 from '../assets/Ellipse68.png';
import Button from "./Button";



const TableListing = () => {    
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
            <TableTheadIteam></TableTheadIteam>
            <TableTheadIteam>Full Name</TableTheadIteam>
            <TableTheadIteam>Alias</TableTheadIteam>
            <TableTheadIteam>App</TableTheadIteam>
            <TableTheadIteam>Relationship</TableTheadIteam>
            <TableTheadIteam>Source</TableTheadIteam>
            <TableTheadIteam>Data Connected</TableTheadIteam>
            <TableTheadIteam>Latest Interaction</TableTheadIteam>
            <TableTheadIteam></TableTheadIteam>
          </TableBoxIteam>

        </TableThead>

        <TableTbody>

          <TableBoxIteam>
            <TableTbodyIteam><img src={Ellipse61} className="listingUserProfileImage" /></TableTbodyIteam>
            <TableTbodyIteam>Eric Chaney</TableTbodyIteam>
            <TableTbodyIteam>erCh</TableTbodyIteam>
            <TableTbodyIteam>
              <TypeFacebookBtn href="#">Facebook</TypeFacebookBtn>
            </TableTbodyIteam>
            <TableTbodyIteam>Friend</TableTbodyIteam>
            <TableTbodyIteam>EricChaney@gmail.com</TableTbodyIteam>
            <TableTbodyIteam>March 19,2020</TableTbodyIteam>
            <TableTbodyIteam>April 19,2020</TableTbodyIteam>
            <TableTbodyIteam>
              <ViewFacebookBtn href="#">View in Facebook</ViewFacebookBtn>
            </TableTbodyIteam>
          </TableBoxIteam>

          <TableBoxIteam>
            <TableTbodyIteam><img src={Ellipse62} className="listingUserProfileImage" /></TableTbodyIteam>
            <TableTbodyIteam>Janer Doe</TableTbodyIteam>
            <TableTbodyIteam>N/A</TableTbodyIteam>
            <TableTbodyIteam>
              <TypeYoutubeBtn href="#">Youtube</TypeYoutubeBtn>
            </TableTbodyIteam>
            <TableTbodyIteam>Follower</TableTbodyIteam>
            <TableTbodyIteam>N/A</TableTbodyIteam>
            <TableTbodyIteam>March 14,2020</TableTbodyIteam>
            <TableTbodyIteam>April 14,2020</TableTbodyIteam>
            <TableTbodyIteam>
              <ViewYoutubeBtn href="#">View in Youtube</ViewYoutubeBtn>
            </TableTbodyIteam>
          </TableBoxIteam>

          <TableBoxIteam>
            <TableTbodyIteam><img src={Ellipse63} className="listingUserProfileImage" /></TableTbodyIteam>
            <TableTbodyIteam>Diana Redding</TableTbodyIteam>
            <TableTbodyIteam>d.red</TableTbodyIteam>
            <TableTbodyIteam>
              <TypelinkedinBtn href="#">LinkedIn</TypelinkedinBtn>
            </TableTbodyIteam>
            <TableTbodyIteam>Connection</TableTbodyIteam>
            <TableTbodyIteam>N/A</TableTbodyIteam>
            <TableTbodyIteam>March 12,2020</TableTbodyIteam>
            <TableTbodyIteam>April 19,2020</TableTbodyIteam>
            <TableTbodyIteam>
              <ViewlinkedinBtn href="#">View in LinkedIn</ViewlinkedinBtn>
            </TableTbodyIteam>
          </TableBoxIteam>

          <TableBoxIteam>
            <TableTbodyIteam><img src={Ellipse64} className="listingUserProfileImage" /></TableTbodyIteam>
            <TableTbodyIteam>Eric Chaney</TableTbodyIteam>
            <TableTbodyIteam>N/A</TableTbodyIteam>
            <TableTbodyIteam>
              <TypeTwitterBtn href="#">Twitter</TypeTwitterBtn>
            </TableTbodyIteam>
            <TableTbodyIteam>Follower</TableTbodyIteam>
            <TableTbodyIteam>N/A</TableTbodyIteam>
            <TableTbodyIteam>March 09,2020</TableTbodyIteam>
            <TableTbodyIteam>April 14,2020</TableTbodyIteam>
            <TableTbodyIteam>              
              <ViewTwitterBtn href="#">View in Twitter</ViewTwitterBtn>            
            </TableTbodyIteam>
          </TableBoxIteam>

          <TableBoxIteam>
            <TableTbodyIteam><img src={Ellipse65} className="listingUserProfileImage" /></TableTbodyIteam>
            <TableTbodyIteam>James Rob</TableTbodyIteam>
            <TableTbodyIteam>JRob</TableTbodyIteam>
            <TableTbodyIteam>
              <TypeFacebookBtn href="#">Facebook</TypeFacebookBtn>
            </TableTbodyIteam>
            <TableTbodyIteam>Friend</TableTbodyIteam>
            <TableTbodyIteam>JamesRob@gmail.com</TableTbodyIteam>
            <TableTbodyIteam>March 07,2020</TableTbodyIteam>
            <TableTbodyIteam>April 19,2020</TableTbodyIteam>
            <TableTbodyIteam>
              <ViewFacebookBtn href="#">View in Facebook</ViewFacebookBtn>
            </TableTbodyIteam>
          </TableBoxIteam>

          <TableBoxIteam>
            <TableTbodyIteam><img src={Ellipse66} className="listingUserProfileImage" /></TableTbodyIteam>
            <TableTbodyIteam>Derek Coule</TableTbodyIteam>
            <TableTbodyIteam>N/A</TableTbodyIteam>
            <TableTbodyIteam>
              <TypeFacebookBtn href="#">Facebook</TypeFacebookBtn>
            </TableTbodyIteam>
            <TableTbodyIteam>Follower</TableTbodyIteam>
            <TableTbodyIteam>N/A</TableTbodyIteam>
            <TableTbodyIteam>March 04,2020</TableTbodyIteam>
            <TableTbodyIteam>April 14,2020</TableTbodyIteam>
            <TableTbodyIteam>
              <ViewFacebookBtn href="#">View in Facebook</ViewFacebookBtn>
            </TableTbodyIteam>
          </TableBoxIteam>

          <TableBoxIteam>
            <TableTbodyIteam><img src={Ellipse67} className="listingUserProfileImage" /></TableTbodyIteam>
            <TableTbodyIteam>Emily Johnson</TableTbodyIteam>
            <TableTbodyIteam>erCh</TableTbodyIteam>
            <TableTbodyIteam>
              <TypeInstagramBtn href="#" >Instagram</TypeInstagramBtn>
            </TableTbodyIteam>
            <TableTbodyIteam>Connection</TableTbodyIteam>
            <TableTbodyIteam>N/A</TableTbodyIteam>
            <TableTbodyIteam>March 03,2020</TableTbodyIteam>
            <TableTbodyIteam>April 19,2020</TableTbodyIteam>
            <TableTbodyIteam>
              <ViewInstagramBtn href="#">View in Instagram</ViewInstagramBtn>
            </TableTbodyIteam>
          </TableBoxIteam>

          <TableBoxIteam>
            <TableTbodyIteam><img src={Ellipse68} className="listingUserProfileImage" /></TableTbodyIteam>
            <TableTbodyIteam>Greg Rust</TableTbodyIteam>
            <TableTbodyIteam>gRust</TableTbodyIteam>
            <TableTbodyIteam>
              <TypeTwitterBtn href="#">Twitter</TypeTwitterBtn>
            </TableTbodyIteam>
            <TableTbodyIteam>Follower</TableTbodyIteam>
            <TableTbodyIteam>N/A</TableTbodyIteam>
            <TableTbodyIteam>March 01,2020</TableTbodyIteam>
            <TableTbodyIteam>April 14,2020</TableTbodyIteam>
            <TableTbodyIteam>
              <ViewTwitterBtn href="#">View in Twitter</ViewTwitterBtn>
            </TableTbodyIteam>
          </TableBoxIteam>

        </TableTbody>

      </TableBox>
    </Box>
  );
}

export default  TableListing;