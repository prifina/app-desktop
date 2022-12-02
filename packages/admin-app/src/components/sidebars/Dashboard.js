import {
  List, ListDivider,
} from "@blend-ui/list-item";

import { useTranslate } from "@prifina-apps/utils";
import PropTypes from "prop-types";
// import { useNavigate } from "react-router";
import ListItemIconLink from "../../lib/ListItemIconLink";

const DashboardSidebar = ({
  activeMenuItem = 1,
  navigate,
  ...props
}) => {
  const { __ } = useTranslate();
  console.log("SIDEBAR ", activeMenuItem);
  /* const navigate = props.navigate || useNavigate(); */
  /* const navigate = useNavigate(); */
  return (
    <List {...props} spacing={3}>
      <ListItemIconLink role="dashboard-nav" activeitem={activeMenuItem === 1 ? 1 : 0} onClick={() => navigate("/dashboard", { replace: true })}>
        {__("Dashboard")}
      </ListItemIconLink>
      <ListItemIconLink role="users-nav" activeitem={activeMenuItem === 2 ? 1 : 0} onClick={() => navigate("/users", { replace: true })}>
        {__("Users")}
      </ListItemIconLink>
      <ListItemIconLink role="tables-nav" activeitem={activeMenuItem === 3 ? 1 : 0} onClick={() => navigate("/tables", { replace: true })}>{__("Tables")}</ListItemIconLink>
      <ListDivider />
      <ListItemIconLink role="logout-nav" activeitem={activeMenuItem === 4 ? 1 : 0} onClick={() => navigate("/logout", { replace: true })}>{__("Logout")}</ListItemIconLink>
    </List>
  );
};
DashboardSidebar.displayName = "DashboardSidebar";

DashboardSidebar.propTypes = {

  navigate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  activeMenuItem: PropTypes.number,
};

export default DashboardSidebar;
