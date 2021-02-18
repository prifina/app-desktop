import React from "react";
//import { addDecorator } from '@storybook/react';
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { addDecorator, addParameters } from "@storybook/react";
import { ThemeProvider } from "@blend-ui/core";

const themeProviderDecorator = (story) => (
  <ThemeProvider mobileApp={true}>
    <React.Fragment>{story()}</React.Fragment>
  </ThemeProvider>
);

addDecorator(themeProviderDecorator);
/*
const customViewports = {
  iPhoneX: {
    name: "iPhone X",
    styles: {
      width: "375px",
      height: "812px",
    },
  },
};
*/
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      /* ...customViewports, */
    },
  },
};
