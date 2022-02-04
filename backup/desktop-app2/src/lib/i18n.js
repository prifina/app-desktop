import { default as enStrings } from "./locales/en";
import { I18n } from "aws-amplify";

const i18nTranslate = {
  init: function (lng = "en") {
    I18n.putVocabularies(enStrings);
    I18n.setLanguage(lng);
  },

  __: function (phrase, values) {
    //console.log("OK ", phrase);
    let res = I18n.get(phrase);
    if (values && Object.keys(values).length > 0) {
      Object.keys(values).forEach((v) => {
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

export default { ...i18nTranslate };
