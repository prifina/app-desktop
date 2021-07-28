//const countryList = require("../src/lib/utils").countryList;
/*
import {
    getCountries,
    getCountryCallingCode,
    isValid,
    parsePhoneNumber,
  } from "libphonenumber-js";
*/
const fs = require("fs");
const path = require("path");

const getCountries = require("libphonenumber-js").getCountries;
const getCountryCallingCode = require("libphonenumber-js")
  .getCountryCallingCode;

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
  /*

  "brunei-darussalam": "flag-for-brunei",
 
  "cote-d'ivoire": "flag-for-cote-divoire",
  "falkland-islands-(malvinas)": "flag-for-falkland-islands",
  "micronesia,-federated-states-of": "flag-for-micronesia",
  "iran,-islamic-republic-of": "flag-for-iran",
  "lao-people's-democratic-republic": "flag-for-laos",
  "moldova,-republic-of": "flag-for-moldova",
  "north-macedonia,-republic-of": "flag-for-macedonia",
  "russian-federation": "flag-for-russia",
  "syrian-arab-republic": "flag-for-syria",
  "tanzania,-united-republic-of": "flag-for-tanzania",
  
  
  "holy-see-(vatican-city-state": "flag-for-vatican-city",
  */
};

/*
NOT FOUND  american-samoa
NOT FOUND  åland
NOT FOUND  saint-barthélemy
NOT FOUND  bonaire
NOT FOUND  cocos-[keeling]-islands
NOT FOUND  ivory-coast
NOT FOUND  cook-islands
NOT FOUND  curacao
NOT FOUND  christmas-island
NOT FOUND  french-guiana
NOT FOUND  guernsey
NOT FOUND  guadeloupe
NOT FOUND  isle-of-man
NOT FOUND  british-indian-ocean-territory
NOT FOUND  saint-martin
NOT FOUND  northern-mariana-islands
NOT FOUND  martinique
NOT FOUND  norfolk-island
NOT FOUND  saint-pierre-and-miquelon
NOT FOUND  réunion
NOT FOUND  svalbard-and-jan-mayen
NOT FOUND  south-sudan
NOT FOUND  são-tomé-and-príncipe
NOT FOUND  sint-maarten
NOT FOUND  swaziland
NOT FOUND  turks-and-caicos-islands
NOT FOUND  tokelau
NOT FOUND  east-timor
NOT FOUND  british-virgin-islands
NOT FOUND  mayotte
*/

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

function countryList() {
  // there are unsupported codes... https://en.wikipedia.org/wiki/List_of_country_calling_codes
  // like +1 671 –  Guam

  const countryList = getCountries();
  let unSupportedRegionCodes = [];

  let supportedCountries = [];
  //console.log(Object.keys(countries));
  //console.log(Object.keys(countries["FI"]), countries["FI"].name);
  let countryNames = {};
  Object.keys(countries).forEach(n => {
    countryNames[n] =
      countries[n].name === countries[n].native
        ? countries[n].name
        : countries[n].name + " (" + countries[n].native + ")";
  });
  //console.log("COUNTRY ", countryNames);
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
  countryList.forEach(c => {
    const cName = countryNames[c];

    if (typeof cName !== "undefined") {
      //console.log(countries[c].name);
      let flag = countries[c].name.toLowerCase().replace(/\s/g, "-");
      if (iconsList.indexOf("flag-for-" + flag) === -1) {
        if (Object.keys(convertList).indexOf(flag) === -1) {
          console.log("NOT FOUND ", flag);
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
  return supportedCountries;
}

function camelCase(s) {
  //return s.match(/[a-z]+/gi)
  const pascalCase = s
    .match(/[a-zA-Z0-9]+/gi)
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    .join("");

  return (
    (pascalCase.charAt(0).match(/[0-9]+/g) ? "_" : "") +
    pascalCase.charAt(0).toLowerCase() +
    pascalCase.substr(1)
  );
}

//import flagForFinland from '@iconify-icons/emojione-v1/"flag-for-finland';

/*
const templateBx = iconNames => {
    const iconsToExport = iconNames.map(
      name =>
        `export { default as ${
          camelCase(name) + "Icon"
        } } from '@iconify/icons-bx/${name}'`,
    );
*/
const flagsTemplate = iconNames => {
  const iconsToImport = iconNames.map(
    n =>
      `export {default as ${
        camelCase(n.flag) + "Icon"
      }} from '@iconify-icons/emojione-v1/flag-for-${n.flag}';`,
  );

  return iconsToImport.join("\n");
};

async function main() {
  try {
    //console.log(countryList());
    const cList = countryList();
    const iconNames = cList.filter(n => {
      return n.flag !== "";
    });
    //console.log(iconNames);
    const content = flagsTemplate(iconNames);
    console.log(content);

    const flagIcons = path.join(__dirname, "../src/hooks/FlagIcons.js");

    fs.writeFileSync(flagIcons, content);
  } catch (e) {
    console.log("ERR ", e);
  }
  return;
}

main().catch(e => {
  console.error(e);
});
