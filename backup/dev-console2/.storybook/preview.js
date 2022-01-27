import React from "react";
//import { addDecorator } from '@storybook/react';
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { addDecorator, addParameters } from "@storybook/react";
import { ThemeProvider } from "@blend-ui/core";

//import { PrifinaProvider } from "@prifina/hooks";

const themeProviderDecorator = (story) => (
  <ThemeProvider mobileApp={false}>{story()}</ThemeProvider>
);
//<React.Fragment>{story()}</React.Fragment>
addDecorator(themeProviderDecorator);
/*
<ThemeProvider mobileApp={false}>
    <PrifinaProvider>{story()}</PrifinaProvider>
  </ThemeProvider>
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
