import { ThemeProvider, theme } from "@blend-ui/core";

import { addDecorator, addParameters } from "@storybook/react";

//import { BrowserRouter as Router, MemoryRouter, } from 'react-router-dom';

//import { initialize, mswDecorator } from 'msw-storybook-addon';
/*
import {
  mergeDeep
} from "@prifina-apps/utils";
import newTheme from "../src/theme";

const mergedTheme = mergeDeep(theme, newTheme);
*/

//import { theme } from "@builder/lib";

//import { BrowserRouter as Router,  MemoryRouter ,} from 'react-router-dom';
// console.log("PREV ", theme);

const themeProviderDecorator = (Story) => (
  <ThemeProvider mobileApp={false} ><Story /></ThemeProvider>
);

//<React.Fragment>{story()}</React.Fragment>
//addDecorator(themeProviderDecorator);
/*
const reactRouterLoggerDecorator = (Story) => {
  const location = useLocation();
  useEffect(() => {
    action("location")(location);
  }, [location]);

  return <Story />;
};
*/
/*
if (typeof global.process === 'undefined') {
  const { worker } = require('../src/stories/mocks/browser')
  worker.start()
}
*/


// Initialize MSW
//initialize();

// Provide the MSW addon decorator globally
//export const decorators = [mswDecorator];


export const decorators = [themeProviderDecorator];

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
/*
export const decorators = [themeProviderDecorator,
  (Story) => (
    <MemoryRouter initialEntries={["/register/c", "/register/b", "/register", "/"]}>
      <Story />
    </MemoryRouter>
  ),
];

*/