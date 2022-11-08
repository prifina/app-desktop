import React from "react";

import * as OTPAuth from "otpauth";
import CryptoJS from 'crypto-js'

import { Auth } from "aws-amplify";

import config from "../config";
//import { TOTP } from '@lgicc/totp';

let AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.auth_region,
  identityPoolRegion: config.main_region,
  //region: config.main_region,
  authenticationFlowType: 'CUSTOM_AUTH'
};
export default { title: "TOTP" };

function randomString() {
  return Math.random()
    .toString(36)
    .slice(2).toUpperCase();
}

const generateSecretASCII = (length = 32, symbols = true) => {
  //const bytes = crypto.randomBytes(length || 32)
  const wordArray = CryptoJS.lib.WordArray.random(length)

  const bytes = CryptoJS.enc.Base64.stringify(wordArray);
  //.toString(CryptoJS.enc.Utf8);
  console.log("BYTES ", bytes)
  let set = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"
  if (symbols) {
    set += "!@#$%^&*()<>?/[]{},.:;"
  }

  let output = ""
  for (let i = 0, l = bytes.length; i < l; i++) {
    output += set[Math.floor((bytes[i] / 255.0) * (set.length - 1))]
  }
  return output

}


const totpVerifyDelta = (options) => {
  // shadow options
  options = Object.create(options);
  // verify secret and token exist
  var secret = options.secret;
  var token = options.token;
  if (secret === null || typeof secret === 'undefined') throw new Error('Speakeasy - totp.verifyDelta - Missing secret');
  if (token === null || typeof token === 'undefined') throw new Error('Speakeasy - totp.verifyDelta - Missing token');

  // unpack options
  var window = parseInt(options.window, 10) || 0;

  // calculate default counter value
  if (options.counter == null) options.counter = exports._counter(options);

  // adjust for two-sided window
  options.counter -= window;
  options.window += window;

  // pass to hotp.verifyDelta
  var delta = exports.hotp.verifyDelta(options);

  // adjust for two-sided window
  if (delta) {
    delta.delta -= window;
  }

  return delta;
};


export const totp = () => {
  //console.log("SECRET ", generateSecretASCII());
  //console.log("SECRET ", randomString());
  //otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30
  //const key = randomString();
  const key = "TUMQQC3PJJ";
  console.log("SECRET ", key);
  //  TUMQQC3PJJ

  const companyName = "Prifina";
  const userAccount = "xxxx-zzzz-wwww";
  const otpauth = 'otpauth://totp/' + encodeURI(companyName) + ':' + encodeURI(userAccount) + '?secret=' + key.replace(/\s+/g, '').toUpperCase();

  let totp = new OTPAuth.TOTP({
    issuer: companyName,
    label: userAccount,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: key, // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
  });


  // Generate a token.
  let token = totp.generate();
  console.log("TOKEN ", token);
  // Validate a token.
  let delta = totp.validate({
    token: token,
    window: 1,
  });

  console.log("DELTA ", delta);

  /*
  let token = "855 714";
  console.log("TOKEN ", token);
  // Validate a token.
  let delta = totp.validate({
    token: token,
    window: 1,
  });
  
  console.log("DELTA ", delta);
  */
  // Convert to Google Authenticator key URI:
  //   otpauth://totp/ACME:AzureDiamond?issuer=ACME&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30
  let uri = totp.toString();
  console.log("URI ", uri);
  let parsedTotp = OTPAuth.URI.parse(uri);
  console.log("PARSED ", parsedTotp);
  const src = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(uri);

  Auth.configure(AUTHConfig);
  let user = undefined;
  return <>
    <div>Testing</div>
    <img src={src} />
    <div><input id="token" /></div>
    <button onClick={async () => {
      const token = document.getElementById("token").value;
      let delta = totp.validate({
        token: token,
        window: 1,
      });

      console.log("DELTA ", delta);
      const result = await verify({ token, secret: key });
      console.log(key, result);

    }}>CHECK</button>
    <button onClick={async () => {
      user = await Auth.signIn("test-user");
      console.log("LOGIN", user);
      //const result = await generateToken({ secret: key });
      //console.log(result)


    }}>SIGN IN </button>
    <button onClick={async () => {
      //let user = await Auth.signIn("test-user");

      const result = await Auth.sendCustomChallengeAnswer(user, "123456");
      //const result = await generateToken({ secret: key });
      console.log(result)


    }}>VALIDATE </button>

  </>
};

totp.storyName = "TOTP";

/*
  var otpauth = 'otpauth://totp/'
    + encodeURI(companyName) + ':' + encodeURI(userAccount)
    + '?secret=' + key.replace(/\s+/g, '').toUpperCase()
    ;
  */
//var src = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpauth);


/*
Authenticator.verifyToken(key, token).then(function (result) {
  var msg;
  if (result) {
    msg = 'Correct!';
  } else {
    msg = 'FAIL!';
  }

  console.info('verify', msg);
  window.alert(msg);
}, function (err) {
  window.alert('[ERROR]:' + err.message);
  window.alert('[ERROR]:' + err.stack);

  console.error('ERROR');
  console.error(err);
});
});

*/