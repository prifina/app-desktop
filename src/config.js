const prod = {
  passwordLength: 10,
  usernameLength: 6,
};
const dev = {
  passwordLength: 10,
  usernameLength: 6,
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  support: "anybody@anywhere.org",
  ...config,
};
