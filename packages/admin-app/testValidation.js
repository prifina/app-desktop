import { TOTP } from "@lgicc/totp";

/*
const passcode = require("passcode");

const ok = passcode.totp.verify({
  secret: "TUMQQC3PJJ",
  token: process.argv[2],
  window: 1,
});

console.log("OK ", ok, process.argv[2]);
*/

const totp = new TOTP("TUMQQC3PJJ");
console.log(totp.generate());
