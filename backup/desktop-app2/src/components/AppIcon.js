import React from "react";
import { Box, Text } from "@blend-ui/core";
import PropTypes from "prop-types";

const AppIcon = ({ title, icon, ...props }) => {
  const Component = icon;
  return (
    <Box p={1} textAlign={"center"} {...props}>
      <Component />
      <Text
        textStyle={"caption"}
        style={{ position: "relative", top: "-12px" }}
      >
        {title}
      </Text>
    </Box>
  );
};

AppIcon.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};
export default AppIcon;
