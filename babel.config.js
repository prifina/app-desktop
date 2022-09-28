module.exports = {
  //plugins: ['babel-plugin-styled-components'],
  plugins: [
    [
      "babel-plugin-styled-components",
      {
        "displayName": true
      }
    ],
    "babel-plugin-react-docgen",
    //"@babel/plugin-transform-react-jsx-source"

  ],
  presets: ['@babel/preset-env', '@babel/preset-react']
};
