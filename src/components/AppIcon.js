import React from "react";
import { Box, Text } from "@blend-ui/core";

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

export default AppIcon;
