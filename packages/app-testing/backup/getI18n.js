const fs = require("fs");

const I18n = require("aws-amplify").I18n;

//console.log(I18n);

const f = "./en.js";

//const f = "./test.tro";

const fl = fs.readFileSync(f).toString();
/*
console.log(
  fl.substring(fl.indexOf("{"), fl.indexOf("};") + 2).replace(/\n/g, "")
);
*/
let json_string = fl
  .substring(fl.indexOf("{"), fl.indexOf("};") + 1)
  .replace(/\\n/g, "\\n")
  .replace(/\\'/g, "\\'")
  .replace(/\\"/g, '\\"')
  .replace(/\\&/g, "\\&")
  .replace(/\\r/g, "\\r")
  .replace(/\\t/g, "\\t")
  .replace(/\\b/g, "\\b")
  .replace(/\\f/g, "\\f");

while (json_string.indexOf("/*") > -1) {
  json_string = json_string.replace(
    json_string.substring(
      json_string.indexOf("/*"),
      json_string.indexOf("*/") + 2,
    ),
    "",
  );
  //console.log(json_string);
}

json_string = json_string.replace(
  /(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g,
  '$1"$3":',
); // add missing quotes...

//console.log("MISSIN QIOTES ", json_string);
json_string = json_string.replace(
  /(?<=(true|false|null|["\d}\]])\s*)\s*,(?=\s*[}\]])/g,
  "",
); // strip trailing commas

//console.log("TRAILING COMMAS ", json_string);

//console.log(JSON.parse(json_string));

const i18nTranslate = {
  init: function (lng = "en") {
    I18n.putVocabularies(JSON.parse(json_string));
    I18n.setLanguage(lng);
  },

  __: function (phrase, values) {
    //console.log("OK ", phrase);
    let res = I18n.get(phrase);
    if (values && Object.keys(values).length > 0) {
      Object.keys(values).forEach(v => {
        //console.log("REPLACE ", v);
        const r = new RegExp("{{" + v + "}}", "g");
        //console.log(r);
        res = res.replace(r, values[v]);
      });
      //console.log("REPLACE ", res);
    }
    return res;
  },
};

exports.init = i18nTranslate.init;

exports.__ = i18nTranslate.__;
