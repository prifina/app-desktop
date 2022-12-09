import React from "react";
import { ThemeProvider, theme } from "@blend-ui/core";

//import { addDecorator, addParameters } from "@storybook/react";

import { BrowserRouter as Router, MemoryRouter, } from 'react-router-dom';

import "./normalize.css";

import {
  mergeDeep
} from "@prifina-apps/utils";
import newTheme from "../src/theme";

const mergedTheme = mergeDeep(theme, newTheme);

//import { theme } from "@builder/lib";

//import { BrowserRouter as Router,  MemoryRouter ,} from 'react-router-dom';
// console.log("PREV ", theme);

const withTheme = (StoryFn) => {
  return (
    <ThemeProvider theme={mergedTheme}>
      <StoryFn />
    </ThemeProvider>
  );
};

/*
export const withTheme = (StoryFn) => {
  return (
    <ThemeProvider theme={theme}>
      <StoryFn />
    </ThemeProvider>
  );
};

export const decorators = [withTheme];
*/

/*
const themeProviderDecorator = (story) => (
  <ThemeProvider mobileApp={false} theme={mergedTheme}>{story()}</ThemeProvider>
);
*/
//<React.Fragment>{story()}</React.Fragment>
//addDecorator(themeProviderDecorator);

export const parameters = {
  /* 
   chakra: {
     theme: theme,
   },
   */

  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
export const decorators = [withTheme,
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];
/*
export const decorators = [
  (Story) => (
    <React.StrictMode>
      <MemoryRouter initialEntries={["/"]}>
        <Story />
      </MemoryRouter>
    </React.StrictMode>
  ),
];
*/

/*
export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/home","/post/test","/visualisation/mfeApp2"]}>
      <Story />
    </MemoryRouter>
  ),
];
*/
