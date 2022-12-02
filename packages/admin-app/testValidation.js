const totp = require("totp-generator");

const token = totp("TUMQQC3PJJ");
console.log(token); // prints an 8-digit token

// import pkg from "@lgicc/totp";
// const pkg = require("@lgicc/totp");

// const { TOTP, generateSecret } = pkg;

// "main": "dist/esm/index.js",

// import { TOTP, generateSecret } from "@lgicc/totp";
// const { TOTP, generateSecret } = require("@lgicc/totp");

/*
const passcode = require("passcode");

const ok = passcode.totp.verify({
  secret: "TUMQQC3PJJ",
  token: process.argv[2],
  window: 1,
});

console.log("OK ", ok, process.argv[2]);
*/
// console.log(TOTP, generateSecret());
// const totp = new TOTP("TUMQQC3PJJ");
// console.log(totp.generate());
