import { Text, useTheme } from "@blend-ui/core";
import { ListItem } from "@blend-ui/list-item";
import styled, { css } from "styled-components";

import PropTypes from "prop-types";

/*
// emotion global styles sets svg dislay block....
const InlineListIcon = styled(InlineIcon)`
  display: inline;
`;
*/

const listTheme = props => css`
  &:hover {
    background-color: ${props.theme.colors.listItemHover};
    color: ${props.theme.colors.activeListItemColor};
    cursor: pointer;
  }
  &:active span {
    color: ${props.theme.colors.activeListItemColor};
  }
  span {
    color: ${props.activeitem === 1
    ? props.theme.colors.activeListItemColor
    : props.theme.colors.defaultColor};
    }
`;

const StyledListItem = styled(ListItem)`
/* */
${listTheme}; 

  
`;

const ListItemIconLink = ({
  children,
  icon,
  onClick,
  activeitem = 0,
  active,
  ...props
}) => {
  const theme = useTheme();
  // console.log("THEME ", theme);
  const dynProps = {
    alignItems: "center", theme, activeitem, active,
  };

  // {icon && <InlineListIcon icon={icon} size="20" /> }
  return (
    <StyledListItem {...dynProps} onClick={onClick}>
      <Text as="span" ml={icon ? "14px" : 0} fontSize="13px" {...props}>
        {children}
      </Text>
    </StyledListItem>
  );
};

ListItemIconLink.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.object,
  onClick: PropTypes.func,
  activeitem: PropTypes.number,
  active: PropTypes.bool,
};

export default ListItemIconLink;
