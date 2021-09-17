module.exports = ({ config }) => {
  /*
  // for some reason default storybook webpack doesn't include images... 
  const fileLoaderRule = config.module.rules.find(
    rule => rule.test && rule.test.test(".svg"),
  );
  //console.log("RES ", fileLoaderRule, config.module.rules);
  fileLoaderRule.exclude = /\.svg$/;
*/
  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack", "url-loader"],
  });
  return config;
};

/*
module.exports = ({ config }) => {
  const assetRule = config.module.rules.find(({ test }) => test.test(".svg"));

  const assetLoader = {
    loader: assetRule.loader,
    options: assetRule.options || assetRule.query,
  };

  // Merge our rule with existing assetLoader rules
  config.module.rules.unshift({
    test: /\.svg$/,
    use: ["@svgr/webpack", assetLoader],
  });
  return config;
};
*/
/*
module.exports = ({ config }) => {
  const fileLoaderRule = config.module.rules.find(
    rule => !Array.isArray(rule.test) && rule.test.test(".svg"),
  );
  fileLoaderRule.exclude = /\.svg$/;
  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack", "url-loader"],
  });
  return config;
};
*/

/*
  const assetRule = config.module.rules.find(({ test }) => test.test(".svg"));

const assetLoader = {
  loader: assetRule.loader,
  options: assetRule.options || assetRule.query,
};

// Merge our rule with existing assetLoader rules
config.module.rules.unshift({
  test: /\.svg$/,
  use: ["@svgr/webpack", assetLoader],
});

*/
