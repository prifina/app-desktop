import React from "react";

import { Box, Flex, Text } from "@blend-ui/core";

function App() {
  return (
    <React.Fragment>
      <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <Box width="200px" p={30} border="2px solid" borderRadius={4}>
          <Text textAlign="center" textStyle="h3">
            Center this
          </Text>
        </Box>
      </Flex>
    </React.Fragment>
  );
}

export default App;
