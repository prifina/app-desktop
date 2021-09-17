/* eslint-disable react/forbid-prop-types */
import React from "react";

import PropTypes from "prop-types";

const importComponent = name => {
  console.log("IMPORT ", name);
  return React.lazy(() =>
    import(`${name}`).catch(err => {
      console.log("ERR ", err);
    }),
  );
};

export const InstalledApps = ({ apps, ...props }) => {
  //const recentApps = ["./AppMarketIcon", "./NewsMuzzlerIcon"];
  const appIcons = apps.map(app => {
    return importComponent(app);
  });

  //const apps = [AppMarketIcon, NewsMuzzlerIcon];

  return (
    <React.Suspense fallback={"Loading ..."}>
      {appIcons.map((Component, i) => {
        return <Component key={"app-" + i} />;
      })}
    </React.Suspense>
  );
};

InstalledApps.propTypes = {
  apps: PropTypes.array.isRequired,
};
