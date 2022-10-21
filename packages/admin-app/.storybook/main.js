//const CopyPlugin = require("copy-webpack-plugin");
const {
  withStorybookModuleFederation,
} = require('storybook-module-federation');

const deps = require("../package.json").dependencies;

const storybookConfig = {
  stories: [
    "../src/stories/*.stories.mdx",
    "../src/stories/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app"
  ],

  features: {
    emotionAlias: false,
    interactionsDebugger: true,
  },

  framework: "@storybook/react",
  core: {
    //builder: "@storybook/builder-webpack5",
    builder: 'webpack5',
  },
  /* refs: {
    '@chakra-ui/react': { disable: true }
  }, */
  /* 
  * 👇 The `config` argument contains all the other existing environment variables.
  * Either configured in an `.env` file or configured on the command line.
 */
  /*
    env: (config) => ({
     ...config,
     STORYBOOK_ENV: true,
     STORYBOOK_STATES: true,
   }),
   */

};

const moduleFederationConfig = {
  name: 'host',
  shared: {
    react: { singleton: true, requiredVersion: deps.react },
    'react-dom': { singleton: true, requiredVersion: deps.react },
  },

};

const CustomWebpack = {
  ...storybookConfig,
  /*
  webpackFinal: async (config) => {
    config.plugins.push(new CopyPlugin({
      patterns: [
        { from: "../../../plugins/packages/json-view/dist", to: "dist" },
      ],
    }))
    return config;
  },
  */
}


module.exports = withStorybookModuleFederation(moduleFederationConfig)(
  //storybookConfig
  CustomWebpack
);
