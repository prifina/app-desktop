const deps = require("./package.json").dependencies;
// const { dependencies } = require("./package.json");
/*
module.exports = {
  name: 'host',
  remotes: {
    remote: 'remote@http://localhost:3002/remoteEntry.js',
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies['react'],
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
    },
  },
};
*/

module.exports = {
  name: "host",
  shared: {
    react: { singleton: true, requiredVersion: deps.react },
    "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
    "@prifina/hooks-v2": {
      import: "@prifina/hooks-v2",
    },
    // react:{requiredVersion: deps.react},
    // "react-dom":{requiredVersion: deps["react-dom"]}
    /*
    react: {
      singleton: true,
      // requiredVersion: dependencies.react,
    },
    "react-dom": { singleton: true, // requiredVersion: dependencies["react-dom"]
    },
    */
  },

};
