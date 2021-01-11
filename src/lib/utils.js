//const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
//const PNF = require('google-libphonenumber').PhoneNumberFormat;
//const PNT = require('google-libphonenumber').PhoneNumberType;

import { pwList } from "./passwords";
import {
  PhoneNumberUtil,
  PhoneNumberFormat,
  PhoneNumberType,
} from "google-libphonenumber";

import countries from "../countries";

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
  return pwList.some((c) => {
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
  const listResult = checkList.some((c) => {
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
  const staticCountryList = countries;

  return staticCountryList;
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
  /*  return new Promise(function (resolve, reject) {

    });*/
  let isValid = false;
  let result = {};
  try {
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
  } catch (e) {
    console.log("ERR", e);
    return {};
  }

  return result;
}

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
