import { default as enStrings } from "./locales/en";
import { I18n } from "aws-amplify";
import create from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";


const useTranslate = create(set => ({
  initLanguage: (lng = "en") => {
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
}));

if (process.env.NODE_ENV === "development") {
  //if (process.env.STORYBOOK_STATES) {
  mountStoreDevtool("Store", useTranslate);
}

export default useTranslate;