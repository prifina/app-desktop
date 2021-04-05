//var Intl = require("Intl");

//console.log(Intl);
//console.log(Intl.DisplayNames);

/*
const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
  type: "region",
});

console.log(regionNamesInEnglish.of("FI"));
*/

var lib = require("libphonenumber-js");

var countries = require("i18n-iso-countries");

const countryList = lib.getCountries();
console.log(countryList);

//console.log(lib);
countryList.map(c => {
  console.log(
    lib.getCountryCallingCode(c) +
      " => " +
      countries.getName(c, "en", { select: "official" }),
  );
});
/*
console.log(
  "US (Alpha-2) => " + countries.getName("US", "en", { select: "official" }),
);
*/
/*
const countries = [
    { countryCode: 1, regionCode: "US", regionName: "United States" },
*/
