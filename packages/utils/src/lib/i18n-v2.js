import React, { useState, useCallback } from "react";
import { default as enStrings } from "./locales/en";
import { I18n } from "aws-amplify";
//import create from "zustand";
//import { mountStoreDevtool } from "simple-zustand-devtools";

const useTranslate = (lng = "en") => {
  const [currentLng, setCurrentLng] = useState(lng);
  I18n.putVocabularies(enStrings);
  I18n.setLanguage(lng);

  const __ = useCallback((phrase, values) => {
    let res = I18n.get(phrase);

    //console.log("OK ", phrase, res);
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
  }, []);


  return { __, setCurrentLng };
}

/* 
const useTranslate = create((set, get) => ({
  initLanguage: (lng = "en") => {
    //console.log("INIT ", enStrings)
    console.log("LNG INIT ", lng);
    I18n.putVocabularies(enStrings);
    I18n.setLanguage(lng);
    //set({ lng: lng });
  },
  lng: "",
  __: function (phrase, values) {
    //console.log("OK ", phrase);
    const currentLng = get().lng;
    if (currentLng === "") {
      get().initLanguage();
    }
    // let res = I18n.get(phrase);
    let res = phrase;
    //console.log("OK ", phrase, res);
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
} */

export default useTranslate;