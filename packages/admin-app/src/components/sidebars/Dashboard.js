import {
  List, ListDivider,
} from "@blend-ui/list-item";

import {
  i18n,
} from "@prifina-apps/utils";

import PropTypes from "prop-types";
// import { useNavigate } from "react-router";
import ListItemIconLink from "../../lib/ListItemIconLink";

i18n.init();

const DashboardSidebar = ({
  activeMenuItem = 2,
  navigate,
  ...props
}) =>
/* const navigate = props.navigate || useNavigate(); */
/* const navigate = useNavigate(); */
(
  <List {...props} spacing={3}>
    <ListItemIconLink role="users-nav" activeitem={activeMenuItem === 1 ? 1 : 0} onClick={() => navigate("/users", { replace: true })}>
      {i18n.__("Users")}
    </ListItemIconLink>
    <ListItemIconLink role="tables-nav" activeitem={activeMenuItem === 2 ? 1 : 0} onClick={() => navigate("/tables", { replace: true })}>{i18n.__("Tables")}</ListItemIconLink>
    <ListDivider />
    <ListItemIconLink role="logout-nav" activeitem={activeMenuItem === 3 ? 1 : 0} onClick={() => navigate("/logout", { replace: true })}>{i18n.__("Logout")}</ListItemIconLink>
  </List>
);

DashboardSidebar.displayName = "DashboardSidebar";

DashboardSidebar.propTypes = {

  navigate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  activeMenuItem: PropTypes.number,
};

export default DashboardSidebar;
