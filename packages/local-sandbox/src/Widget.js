
import React, { useEffect, useRef, useState } from "react";
import { usePrifina, Op } from "@prifina/hooks-v2";
import Oura from "@prifina/oura";


const APP_ID = "XXXX-APP-ID";
const Widget = () => {

  const { check, stage, onUpdate, API, registerDataConnector } = usePrifina();

  const effectCalled = useRef(false);

  const [data, setData] = useState([])

  const dataUpdate = (payload) => {
    console.log("UPDATE ", payload);
    setData(payload);

  }
  const toIsoDate = (date) => {
    return [date.getFullYear(), (date.getMonth() + 1).toString().padStart(2, "0"), date.getDate().toString().padStart(2, "0")].join("-")
  }
  useEffect(() => {
    async function init() {
      effectCalled.current = true;
      console.log("CONNECTORS ", Oura);

      console.log("STAGE ", stage);
      console.log("CHECK ", check());


      // init callback function for background updates/notifications
      onUpdate(APP_ID, dataUpdate);
      // register datasource modules
      registerDataConnector(APP_ID, [Oura]);

      const d = new Date();

      const dd = d.setDate(d.getDate() - 14);
      //const dateStr = new Date(dd).toISOString().split("T")[0];
      const dateStr = toIsoDate(new Date(dd));

      const filter = {
        ["s3::date"]: {
          [Op.gte]: dateStr,
        },
      };

      const activityResult = await API[APP_ID].Oura.queryActivitySummariesAsync({
        filter: filter,
        fields: "day_start,class_5min",
      });
      console.log(activityResult);
      if (stage === "dev") {
        //processData(activityResult.data.getDataObject.content[1]);
      }


    }
    if (!effectCalled.current) {
      init();
    }

  }, []);

  return <>
    {JSON.stringify(data)}
  </>
}

export default Widget;