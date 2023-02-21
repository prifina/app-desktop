export const countryCodes = ["FI", "US"];
export const mfaMethods = ["TOTP", "SMS", "NOMFA", "SMS_MFA", "SOFTWARE_TOKEN_MFA"];

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const timeout = (ms) => new Promise((res) => setTimeout(res, ms));