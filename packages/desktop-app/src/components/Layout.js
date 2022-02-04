import React from "react";
import { CssGrid, CssCell } from "@blend-ui/css-grid";
import { useTheme } from "@blend-ui/core";

import PropTypes from "prop-types";

const defaultLayout = {
  backgroundColor: "#FFFFFF",
  header: { height: "65px" },
  footer: { height: "65px" },
  sidebar: {
    left: {
      width: "230px",
    },
    right: {
      width: "230px",
    },
  },
};

const Sidebar = props => {
  const { position = "left", children, theme, ...rest } = props;

  const _shadow =
    (position === "left" ? "6px" : "-6px") + " 0px 18px rgba(0, 0, 0, 0.06)";

  return (
    <CssCell area={position} {...rest} boxShadow={_shadow}>
      {children}
    </CssCell>
  );
};

Sidebar.propTypes = {
  position: PropTypes.string,
  theme: PropTypes.instanceOf(Object),
  children: PropTypes.elementType.isRequired,
};

const Header = props => {
  const { children, theme, ...rest } = props;

  return (
    <CssCell area="header" {...rest}>
      {children}
    </CssCell>
  );
};

Header.propTypes = {
  theme: PropTypes.instanceOf(Object),
  children: PropTypes.elementType.isRequired,
};
const Footer = ({ children, theme, ...props }) => (
  <CssCell area="footer" {...props}>
    {children}
  </CssCell>
);

Footer.propTypes = {
  theme: PropTypes.instanceOf(Object),
  children: PropTypes.elementType.isRequired,
};
const Content = props => {
  const { children, theme, ...rest } = props;

  return (
    <CssCell area="content" {...rest}>
      {children}
    </CssCell>
  );
};

Content.propTypes = {
  theme: PropTypes.instanceOf(Object),
  children: PropTypes.elementType.isRequired,
};
Footer.displayName = "LayoutFooter";
Header.displayName = "LayoutHeader";
Sidebar.displayName = "LayoutSidebar";
Content.displayName = "LayoutContent";

const Layout = ({ children, theme: layoutTheme, ...props }) => {
  console.log("LAYOUT ", layoutTheme);

  const theme = useTheme();

  let dashboardTheme = layoutTheme || theme;
  if (typeof dashboardTheme.layout === "undefined") {
    dashboardTheme = { ...dashboardTheme, layout: defaultLayout };
  }
  console.log("THEME", dashboardTheme);

  let dashboardCols = [];
  let dashboardRows = [];
  React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      if (child.type.displayName === "LayoutHeader") {
        dashboardRows.push("HEADER");
      }
      if (child.type.displayName === "LayoutFooter") {
        dashboardRows.push("FOOTER");
      }
      if (child.type.displayName === "LayoutContent") {
        dashboardRows.push("CONTENT");
        dashboardCols.push("CONTENT");
      }
      if (child.type.displayName === "LayoutSidebar") {
        if (
          typeof child.props !== "undefined" &&
          typeof child.props.position !== "undefined"
        ) {
          dashboardCols.push(child.props.position.toUpperCase());
        } else {
          dashboardCols.push("LEFT");
        }
      }
    }
  });

  let gridColumns = ["", "", ""];
  let gridRows = ["", "", ""];
  let gridAreas = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  dashboardCols.forEach(col => {
    if (col === "CONTENT") {
      gridColumns[1] = "1fr";
      gridAreas[1][1] = "content";
    }
    if (col === "LEFT") {
      gridColumns[0] = dashboardTheme.layout.sidebar.left.width;
      gridAreas[1][0] = "left";
    }
    if (col === "RIGHT") {
      gridColumns[2] = dashboardTheme.layout.sidebar.right.width;
      gridAreas[1][2] = "right";
    }
  });
  dashboardRows.forEach(row => {
    if (row === "CONTENT") {
      gridRows[1] = "1fr";
    }
    if (row === "HEADER") {
      gridRows[0] = dashboardTheme.layout.header.height;
      dashboardCols.forEach((col, i) => {
        gridAreas[0][i] = "header";
      });
    }
    if (row === "FOOTER") {
      gridRows[2] = dashboardTheme.layout.footer.height;
      dashboardCols.forEach((col, i) => {
        gridAreas[2][i] = "footer";
      });
    }
  });

  let _areas = [];
  dashboardRows.forEach((row, i) => {
    _areas.push(gridAreas[i].join(" ").trim());
  });

  const Items = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return;

    return React.cloneElement(child, { theme });
  });

  return (
    <CssGrid
      columns={gridColumns.join(" ").trim()}
      rows={gridRows.join(" ").trim()}
      areas={_areas}
      {...props}
    >
      {Items}
    </CssGrid>
  );
};

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Sidebar = Sidebar;
Layout.Content = Content;

Layout.propTypes = {
  theme: PropTypes.instanceOf(Object),
  children: PropTypes.elementType.isRequired,
};

export default Layout;
