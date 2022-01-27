//const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
//const PNF = require('google-libphonenumber').PhoneNumberFormat;
//const PNT = require('google-libphonenumber').PhoneNumberType;

import { pwList } from "./passwords";
/*
import {
  PhoneNumberUtil,
  PhoneNumberFormat,
  PhoneNumberType,
} from "google-libphonenumber";
*/

//import countries from "../countries";

import {
  getCountries,
  getCountryCallingCode,
  isValid,
  parsePhoneNumber,
} from "libphonenumber-js";
const countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

// eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function validEmail(email) {
  return emailRegex.test(String(email).toLowerCase());
}
export function lowerCaseChars(str) {
  const TestRegex = new RegExp("(?=.*[a-z])");
  return TestRegex.test(String(str));
}
export function upperCaseChars(str) {
  const TestRegex = new RegExp("(?=.*[A-Z])");
  return TestRegex.test(String(str));
}
export function digitChars(str) {
  const TestRegex = new RegExp("(?=.*[0-9])");
  return TestRegex.test(String(str));
}
export function onlyDigitChars(str) {
  const TestRegex = new RegExp("^[0-9]+$");
  return TestRegex.test(String(str));
}

export function hasSpaces(str) {
  return /\s/.test(String(str));
}

export function hasNonChars(str) {
  return /\W/.test(String(str));
}

export function checkPwList(str) {
  return pwList.some(c => {
    return String(str).indexOf(c) > -1;
  });
}

export function validUsername(username, requiredLength) {
  //console.log("CHECKING ", username, username.length);
  if (hasSpaces(username)) {
    return "SPACES";
  }
  if (username.length < requiredLength) {
    return "LENGTH";
  }
  /*
  if (username === "tero") {
    return "EXISTS";
  }
  */
  return "";
}
export function checkPassword(password, requiredLength, checkList) {
  let checkResult = [false, false, false, false, false];

  checkResult[0] = password.length >= requiredLength;

  // Is not commonly used
  checkResult[4] = checkResult[0] && !checkPwList(password);

  checkResult[1] = lowerCaseChars(password) && upperCaseChars(password);
  checkResult[2] =
    digitChars(password) && hasNonChars(password) && !hasSpaces(password);

  // Does not contain your name or email address
  const listResult = checkList.some(c => {
    return String(password).indexOf(c) > -1;
  });
  console.log(listResult, checkList, password);
  checkResult[3] = checkResult[0] && !listResult;

  return checkResult;
}

export function countryList() {
  // there are unsupported codes... https://en.wikipedia.org/wiki/List_of_country_calling_codes
  // like +1 671 –  Guam
  /*
  const phoneUtil = PhoneNumberUtil.getInstance();
  //console.log(phoneUtil.getSupportedCallingCodes());
  //console.log(phoneUtil.getRegionCodeForCountryCode(358));

  //const countryCodes = phoneUtil.getSupportedRegions();
  const countryCodes = phoneUtil.getSupportedCallingCodes();
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
    type: "region",
  });


  //console.log("COUNTRY CODES ", countryCodes);
  let countries = [];
  countryCodes.forEach((code) => {
    //return regionNamesInEnglish.of(code);
    //return phoneUtil.getCountryCodeForRegion(code);
    const regionCode = phoneUtil.getRegionCodeForCountryCode(code);
    if (regionCode !== "001") {
      const regionName = regionNamesInEnglish.of(regionCode);
      countries.push({
        countryCode: code,
        regionCode: regionCode,
        regionName: regionName,
      });
    }
  });
  */

  const countryList = getCountries();
  //console.log(countryList);

  //const staticCountryList = countries;

  //return staticCountryList;
  let unSupportedRegionCodes = [];

  let supportedCountries = [];
  countryList.forEach(c => {
    //console.log(c, countries.getName(c, "en", { select: "official" }));
    const cName = countries.getName(c, "en", { select: "official" });
    if (typeof cName !== "undefined") {
      supportedCountries.push({
        countryCode: getCountryCallingCode(c),
        regionCode: c,
        regionName: cName,
      });
    } else {
      unSupportedRegionCodes.push(c);
    }
  });
  console.log("COUNTRIES ", supportedCountries);
  console.log("UNSUPPORTED COUNTRIES ", unSupportedRegionCodes);
  return supportedCountries;
}

export function addRegionCode(region, phone) {
  let phoneNumber = phone;
  if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.substr(1);
  }
  phoneNumber = region + phoneNumber;
  return phoneNumber;
}

export function isValidNumber(phoneNumber) {
  // note phone number checking has to support both region/country calling codes and national conventions for writing tel numbers...
  // also remember this national writing rules changes frequently...

  //https://en.wikipedia.org/wiki/List_of_country_calling_codes
  //https://en.wikipedia.org/wiki/National_conventions_for_writing_telephone_numbers

  //let isValid = false;
  let result = {};
  try {
    /*
    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber);
    console.log("PhoneUtil ", number);
    isValid = phoneUtil.isValidNumber(number);
    if (isValid) {
      //const PNF = PhoneNumberFormat.PNF;
      //const PNT = PhoneNumberType.PNT;
      result.countryCode = number.getCountryCode();
      result.regionCode = phoneUtil.getRegionCodeForNumber(number);
      result.E164 = phoneUtil.format(number, PhoneNumberFormat.E164);
      const numberType = phoneUtil.getNumberType(number);
      const possibleTypes = Object.keys(PhoneNumberType);
      for (let i = 0; i < possibleTypes.length; i++) {
        if (PhoneNumberType[possibleTypes[i]] === numberType) {
          result.numberType = possibleTypes[i];
          break;
        }
      }
    }
    */
    /*
    console.log(phoneUtil.format(number, PNF.INTERNATIONAL));
    // => +1 202-456-1414

    PhoneNumberType.FIXED_LINE
    PhoneNumberType.MOBILE
    PhoneNumberType.FIXED_LINE_OR_MOBILE
    PhoneNumberType.TOLL_FREE
    PhoneNumberType.PREMIUM_RATE
    PhoneNumberType.SHARED_COST
    PhoneNumberType.VOIP
    PhoneNumberType.PERSONAL_NUMBER
    PhoneNumberType.PAGER
    PhoneNumberType.UAN
    PhoneNumberType.VOICEMAIL
    PhoneNumberType.UNKNOWN;*/

    const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
    console.log("PHONE CHECK ", phoneNumber);
    console.log("PHONE CHECK 2 ", parsedPhoneNumber);
    if (parsedPhoneNumber.hasOwnProperty("country")) {
      result = {
        countryCode: parsedPhoneNumber.country,
        regionCode: parsedPhoneNumber.countryCallingCode,
        number: parsedPhoneNumber.number,
        nationalNumber: parsedPhoneNumber.nationalNumber,
      };
    }
  } catch (e) {
    console.log("ERR", e);
    return {};
  }

  return result;
}
/*
export function getTokens(region, appClientId, refreshToken) {
  return new Promise(function (resolve, reject) {
    fetch("https://cognito-idp." + region + ".amazonaws.com/", {
      headers: {
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "Content-Type": "application/x-amz-json-1.1",
      },
      mode: "cors",
      cache: "no-cache",
      method: "POST",
      body: JSON.stringify({
        ClientId: appClientId,
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          //SECRET_HASH: "your_secret", // In case you have configured client secret
        },
      }),
    })
      .then(res => {
        resolve(res.json()); // this will give jwt id and access tokens
      })
      .catch(error => {
        reject(error);
      });
  });
}
*/

/*
module.exports = {
    randomPass: function() {
    }
}            
*/
/*
function isValidNumber(phoneNumber) {
      let isValid=false;
      try {
          //const number = phoneUtil.parseAndKeepRawInput(phone);
          isValid=phoneUtil.isValidNumber(phoneNumber);
      } catch(e) {
          console.log('ERR',e);
          return e;
      }
  
      return isValid;
  
  }
*/

/*
            PhoneNumberType.FIXED_LINE
            PhoneNumberType.MOBILE
            PhoneNumberType.FIXED_LINE_OR_MOBILE
            PhoneNumberType.TOLL_FREE
            PhoneNumberType.PREMIUM_RATE
            PhoneNumberType.SHARED_COST
            PhoneNumberType.VOIP
            PhoneNumberType.PERSONAL_NUMBER
            PhoneNumberType.PAGER
            PhoneNumberType.UAN
            PhoneNumberType.VOICEMAIL
            PhoneNumberType.UNKNOWN;*/
/*
checkNumber: async function(phone) {
    let result={};
    try {
        const number = phoneUtil.parseAndKeepRawInput(phone);
        const isValid=isValidNumber(number);
        if (isValid) {
            result.countryCode=number.getCountryCode();
            result.regionCode=phoneUtil.getRegionCodeForNumber(number);
            result.E164=phoneUtil.format(number, PNF.E164);
            const numberType=phoneUtil.getNumberType(number);
            const possibleTypes=Object.keys(PNT);
            for (let i=0;i<possibleTypes.length;i++) {
                if (PNT[possibleTypes[i]]==numberType) {
                    result.numberType=possibleTypes[i];
                    break;
                }
            }
           

        }

    } catch(e) {
        console.log('ERR',e);
        return Promise.reject(e);
    }
    return Promise.resolve(result)
}
*/
