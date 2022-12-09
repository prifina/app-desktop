import * as React from "react";
import { ThemeProvider, theme } from "@blend-ui/core";


const withTheme = (StoryFn) => {
  return (
    <ThemeProvider theme={theme}>
      <StoryFn />
    </ThemeProvider>
  );
};

export const decorators = [withTheme];
