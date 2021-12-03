import React, { useState } from "react";
import useFetch from "../hooks/UseFetch";
//import { ReactSVG } from "react-svg";

import { ReactComponent as AppMarket } from "../assets/third-party-app.svg";

export const appIcon3 = () => (
  <div>
    <AppMarket />
  </div>
);
appIcon3.story = {
  name: "AppIcon",
};

/*
import { ReactComponent as AppMarket } from "../assets/app-market.svg";

import AppIcon from "../components/AppIcon";
import AppMarketIcon from "../components/AppMarketIcon";
*/
export default { title: "App icons2" };

export const appIcon2 = () => {
  const { data, error, isLoading, setUrl } = useFetch();
  const [SvgImageComponent, setSvgImage] = useState(null);
  //https://prifina-app.s3.amazonaws.com/assets/app-market.svg
  /*
  let header = new Headers({
    'Access-Control-Allow-Origin': '*',
    });
    let options = {
    mode: 'no-cors',
    header: header,
    };

     
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.setRequestHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
      );
      xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
    
  */

  const getContent = () => {
    if (error) return <h2>Error when fetching: {error}</h2>;
    if (!data && isLoading) return <h2>LOADING...</h2>;
    if (!data) return null;
    const localBlob = URL.createObjectURL(data);
    console.log(localBlob);

    /*
    return (
      <ReactSVG
        src={localBlob}
        beforeInjection={(svg) => {
          Object.assign(svg.style, { height: "200px", width: "200px" });
        }}
      />
    );
    */
    return <img src={localBlob} style={{ width: "100px", height: "100px" }} />;
    //const Component = data;
    //return <Component />;
  };

  return (
    <div>
      <div>
        Testing{" "}
        <button
          onClick={() => {
            setUrl({
              type: "svg",
              source:
                "https://prifina-app.s3.amazonaws.com/assets/third-party-app.svg",
            });
          }}
        >
          GET SVG
        </button>
      </div>
      {getContent()}
    </div>
  );
};
appIcon2.story = {
  name: "AppIcon S3 component",
};

/*
export const appIcon = () => (
  <div>
    <AppMarket />
  </div>
);
appIcon.story = {
  name: "AppIcon",
};

export const appIcon2 = () => (
  <div>
    <AppIcon title={"App Market"} icon={AppMarket} />
  </div>
);
appIcon2.story = {
  name: "AppIcon component",
};

export const appIcon3 = () => <AppMarketIcon />;
appIcon3.story = {
  name: "AppMarketIcon",
};
*/
