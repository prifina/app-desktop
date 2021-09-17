// npm install --save-dev @iconify/react @iconify-icons/emojione-v1
//import { Icon, InlineIcon } from '@iconify/react';
//import flagForFinland from '@iconify-icons/emojione-v1/"flag-for-finland';
import React, { useState, useEffect } from "react";
import { countryList } from "../lib/utils";
//import * as flagIcons from "@iconify-icons/emojione-v1";

import { Icon } from "@iconify/react";

const convertList = {
  "brunei-darussalam": "flag-for-brunei",
  "congo,-the-democratic-republic-of-the": "flag-for-congo-kinshasa",
  congo: "flag-for-congo-brazzaville",
  "cote-d'ivoire": "flag-for-cote-divoire",
  "czech-republic": "flag-for-czechia",
  "falkland-islands-(malvinas)": "flag-for-falkland-islands",
  "micronesia,-federated-states-of": "flag-for-micronesia",
  "hong-kong": "flag-for-hong-kong-sar-china",
  "iran,-islamic-republic-of": "flag-for-iran",
  "saint-kitts-and-nevis": "flag-for-st-kitts-and-nevis",
  "lao-people's-democratic-republic": "flag-for-laos",
  "moldova,-republic-of": "flag-for-moldova",
  "north-macedonia,-republic-of": "flag-for-macedonia",
  "state-of-palestine": "flag-for-palestinian-territories",
  "russian-federation": "flag-for-russia",
  "syrian-arab-republic": "flag-for-syria",
  tonga: "flag-for-tonga",
  "taiwan,-province-of-china": "flag-for-taiwan",
  "tanzania,-united-republic-of": "flag-for-tanzania",
  "united-states-of-america": "flag-for-united-states",
  "virgin-islands,-u.s.": "flag-for-us-virgin-islands",
  "saint-vincent-and-the-grenadines": "flag-for-st-vincent-and-grenadines",
  "saint-helena": "flag-for-st-helena",
  macao: "flag-for-macau-sar-china",
  "saint-lucia": "flag-for-st-lucia",
  "holy-see-(vatican-city-state": "flag-for-vatican-city",
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
  "flag-for-north-macedonia",
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

const importComponent = name => {
  console.log("IMPORT ", name);
  return React.lazy(() =>
    import(`${name}`).catch(err => {
      console.log("ERR ", err);
    }),
  );
};
const FlagIcons = () => {
  //console.log(countryList());
  const regionList = countryList();
  const [icons, setIcons] = useState([]);
  //let icons = {};
  //icons = Object.assign(icons, flagIcons);
  //console.log("ICONS ", icons);
  //icons = Object.assign(icons, mdiIcons);
  //const returnedTarget = Object.assign(target, source);
  // console.log(icons);
  for (let i = 0; i < regionList.length; i++) {
    const regionName = regionList[i].regionName
      .toLowerCase()
      .replace(/\s/g, "-");
    /*
    console.log(
      "REGION ",
      regionName,
      iconsList.indexOf("flag-for-" + regionName + ".js"),
    );

    return (
        <Icon
          icon={Component}
          title={title || name}
          width={_width}
          color={_color}
          {...rest}
        />
      );
    */
    if (iconsList.indexOf("flag-for-" + regionName + ".js") === -1) {
      if (Object.keys(convertList).indexOf(regionName) === -1) {
        console.log("REGION ", regionName);
      }
    }
  }
  /*
  useEffect(() => {
    //console.log("SCHEMAJSON ", state.schemaJson);
    const ComponentName = "@iconify-icons/emojione-v1/flag-for-finland";
    import(`${ComponentName}`).then(icon => {
      //console.log("EXPORT COMP ", ExportComponent);
      console.log("IMPORT ICON ", icon);
      setIcons(<Icon icon={icon} />);
    });
    
  }, []);
*/

  return <React.Suspense fallback={"Loading ..."}>{icons}</React.Suspense>;
};

export default FlagIcons;
