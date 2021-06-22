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
//const countries = require("i18n-iso-countries");
//countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
const countries = require("countries-list").countries;

const convertList = {
  "democratic-republic-of-the-congo": "congo-kinshasa",
  "republic-of-the-congo": "congo-brazzaville",
  "czech-republic": "czechia",

  macao: "macau-sar-china",
  "hong-kong": "hong-kong-sar-china",
  tonga: "tonga",
  "saint-vincent-and-the-grenadines": "st-vincent-and-grenadines",
  palestine: "palestinian-territories",
  "myanmar-[burma]": "myanmar",
  "saint-helena": "st-helena",
  "u.s.-virgin-islands": "us-virgin-islands",
  "saint-lucia": "st-lucia",
  "saint-kitts-and-nevis": "st-kitts-and-nevis",
  "north-macedonia": "macedonia",
};

const iconsList = [
  "flag-for-andorra",
  "flag-for-afghanistan",
  "flag-for-albania",
  "flag-for-algeria",
  "flag-for-angola",
  "flag-for-anguilla",
  "flag-for-antigua-and-barbuda",
  "flag-for-argentina",
  "flag-for-armenia",
  "flag-for-aruba",
  "flag-for-ascension-island",
  "flag-for-australia",
  "flag-for-austria",
  "flag-for-azerbaijan",
  "flag-for-bahamas",
  "flag-for-bahrain",
  "flag-for-bangladesh",
  "flag-for-barbados",
  "flag-for-belarus",
  "flag-for-belgium",
  "flag-for-belize",
  "flag-for-benin",
  "flag-for-bermuda",
  "flag-for-bhutan",
  "flag-for-bolivia",
  "flag-for-bosnia-and-herzegovina",
  "flag-for-botswana",
  "flag-for-brazil",
  "flag-for-brunei",
  "flag-for-bulgaria",
  "flag-for-burkina-faso",
  "flag-for-burundi",
  "flag-for-cambodia",
  "flag-for-cameroon",
  "flag-for-canada",
  "flag-for-cape-verde",
  "flag-for-cayman-islands",
  "flag-for-central-african-republic",
  "flag-for-chad",
  "flag-for-chile",
  "flag-for-china",
  "flag-for-colombia",
  "flag-for-comoros",
  "flag-for-congo-brazzaville",
  "flag-for-congo-kinshasa",
  "flag-for-costa-rica",
  "flag-for-cote-divoire",
  "flag-for-croatia",
  "flag-for-crossed-flags",
  "flag-for-cuba",
  "flag-for-cyprus",
  "flag-for-czechia",
  "flag-for-denmark",
  "flag-for-djibouti",
  "flag-for-dominica",
  "flag-for-dominican-republic",
  "flag-for-ecuador",
  "flag-for-egypt",
  "flag-for-el-salvador",
  "flag-for-equatorial-guinea",
  "flag-for-eritrea",
  "flag-for-estonia",
  "flag-for-ethiopia",
  "flag-for-falkland-islands",
  "flag-for-faroe-islands",
  "flag-for-fiji",
  "flag-for-finland",
  "flag-for-france",
  "flag-for-french-polynesia",
  "flag-for-gabon",
  "flag-for-gambia",
  "flag-for-georgia",
  "flag-for-germany",
  "flag-for-ghana",
  "flag-for-gibraltar",
  "flag-for-greece",
  "flag-for-greenland",
  "flag-for-grenada",
  "flag-for-guam",
  "flag-for-guatemala",
  "flag-for-guinea-bissau",
  "flag-for-guinea",
  "flag-for-guyana",
  "flag-for-haiti",
  "flag-for-honduras",
  "flag-for-hong-kong-sar-china",
  "flag-for-hungary",
  "flag-for-iceland",
  "flag-for-india",
  "flag-for-indonesia",
  "flag-for-iran",
  "flag-for-iraq",
  "flag-for-ireland",
  "flag-for-israel",
  "flag-for-italy",
  "flag-for-jamaica",
  "flag-for-japan",
  "flag-for-jersey",
  "flag-for-jordan",
  "flag-for-kazakhstan",
  "flag-for-kenya",
  "flag-for-kiribati",
  "flag-for-kosovo",
  "flag-for-kuwait",
  "flag-for-kyrgyzstan",
  "flag-for-laos",
  "flag-for-latvia",
  "flag-for-lebanon",
  "flag-for-lesotho",
  "flag-for-liberia",
  "flag-for-libya",
  "flag-for-liechtenstein",
  "flag-for-lithuania",
  "flag-for-luxembourg",
  "flag-for-macao-sar-china",
  "flag-for-macedonia",
  "flag-for-madagascar",
  "flag-for-malawi",
  "flag-for-malaysia",
  "flag-for-maldives",
  "flag-for-mali",
  "flag-for-malta",
  "flag-for-marshall-islands",
  "flag-for-mauritania",
  "flag-for-mauritius",
  "flag-for-mexico",
  "flag-for-micronesia",
  "flag-for-moldova",
  "flag-for-monaco",
  "flag-for-mongolia",
  "flag-for-montenegro",
  "flag-for-montserrat",
  "flag-for-morocco",
  "flag-for-mozambique",
  "flag-for-myanmar",
  "flag-for-namibia",
  "flag-for-nauru",
  "flag-for-nepal",
  "flag-for-netherlands",
  "flag-for-new-caledonia",
  "flag-for-new-zealand",
  "flag-for-nicaragua",
  "flag-for-niger",
  "flag-for-nigeria",
  "flag-for-niue",
  "flag-for-north-korea",
  "flag-for-norway",
  "flag-for-oman",
  "flag-for-pakistan",
  "flag-for-palau",
  "flag-for-palestinian-territories",
  "flag-for-panama",
  "flag-for-papua-new-guinea",
  "flag-for-paraguay",
  "flag-for-peru",
  "flag-for-philippines",
  "flag-for-poland",
  "flag-for-portugal",
  "flag-for-puerto-rico",
  "flag-for-qatar",
  "flag-for-romania",
  "flag-for-russia",
  "flag-for-rwanda",
  "flag-for-samoa",
  "flag-for-san-marino",
  "flag-for-sao-tome-and-principe",
  "flag-for-saudi-arabia",
  "flag-for-senegal",
  "flag-for-serbia",
  "flag-for-seychelles",
  "flag-for-sierra-leone",
  "flag-for-singapore",
  "flag-for-slovakia",
  "flag-for-slovenia",
  "flag-for-solomon-islands",
  "flag-for-somalia",
  "flag-for-south-africa",
  "flag-for-south-korea",
  "flag-for-spain",

  "flag-for-sri-lanka",
  "flag-for-st-helena",
  "flag-for-st-kitts-and-nevis",
  "flag-for-st-lucia",
  "flag-for-st-vincent-and-grenadines",
  "flag-for-sudan",
  "flag-for-suriname",
  "flag-for-sweden",
  "flag-for-switzerland",
  "flag-for-syria",
  "flag-for-taiwan",
  "flag-for-tajikistan",
  "flag-for-tanzania",
  "flag-for-thailand",
  "flag-for-timor-leste",
  "flag-for-togo",
  "flag-for-trinidad-and-tobago",
  "flag-for-tunisia",
  "flag-for-turkey",
  "flag-for-turkmenistan",
  "flag-for-tuvalu",
  "flag-for-uganda",
  "flag-for-ukraine",
  "flag-for-united-arab-emirates",
  "flag-for-united-kingdom",
  "flag-for-united-states",
  "flag-for-uruguay",
  "flag-for-us-virgin-islands",
  "flag-for-uzbekistan",
  "flag-for-vanuatu",

  "flag-for-vatican-city",
  "flag-for-venezuela",
  "flag-for-vietnam",
  "flag-for-wallis-and-futuna",
  "flag-for-western-sahara",
  "flag-for-yemen",
  "flag-for-zambia",
  "flag-for-zimbabwe",
];

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

export function countryList(continentList = {}, popularList = []) {
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
  /*
  "continents": {
    "AF": "Africa",
    "AN": "Antarctica",
    "AS": "Asia",
    "EU": "Europe",
    "NA": "North America",
    "OC": "Oceania",
    "SA": "South America"
  },
*/
  let countryNames = {};
  Object.keys(countries).forEach(n => {
    countryNames[n] =
      countries[n].name === countries[n].native
        ? countries[n].name
        : countries[n].name + " (" + countries[n].native + ")";
  });

  //console.log(countryList);

  //const staticCountryList = countries;

  //return staticCountryList;
  let unSupportedRegionCodes = [];

  let supportedCountries = [];
  countryList.forEach(c => {
    const cName = countryNames[c];

    if (typeof cName !== "undefined") {
      //console.log(countries[c].name);
      let flag = countries[c].name.toLowerCase().replace(/\s/g, "-");
      if (iconsList.indexOf("flag-for-" + flag) === -1) {
        if (Object.keys(convertList).indexOf(flag) === -1) {
          //console.log("NOT FOUND ", flag);
          flag = "";
        } else {
          flag = convertList[flag];
        }
      }
      supportedCountries.push({
        countryCode: getCountryCallingCode(c),
        regionCode: c,
        regionName: cName,
        continent: countries[c].continent,
        flag: flag,
      });
    } else {
      unSupportedRegionCodes.push(c);
    }
  });
  //console.log("COUNTRIES ", supportedCountries);
  console.log("UNSUPPORTED COUNTRIES ", unSupportedRegionCodes);

  let orderedList = new Array(Object.keys(continentList).length + 1);

  Object.keys(continentList).forEach(k => {
    orderedList[continentList[k].order] = { [k]: [] };
  });

  supportedCountries.forEach(c => {
    if (popularList.indexOf(c.regionCode) > -1) {
      orderedList[0]["XX"].push(c);
    } else if (Object.keys(continentList).indexOf(c.continent) === -1) {
      const unknownOrderIndex = continentList["ZZ"].order;
      orderedList[unknownOrderIndex].push(c);
    } else {
      orderedList[continentList[c.continent].order][c.continent].push(c);
    }
  });
  //console.log(orderedList);
  return { cList: orderedList, nList: supportedCountries };

  /*
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
  */
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
