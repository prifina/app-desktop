import styled from "styled-components";

import {
  Box,
} from "@blend-ui/core";

const CardContainer = styled(Box)`
border-radius:20px;
min-width:200px;
background-color:${props => props.theme.colors.baseWhite};
padding:20px;
text-align:center;
`;

export default CardContainer;
