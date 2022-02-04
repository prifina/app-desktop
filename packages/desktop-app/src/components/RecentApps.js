/* global localStorage */

import React from "react";

const importComponent = name => {
  console.log("IMPORT ", name);
  return React.lazy(() =>
    import(`${name}`).catch(err => {
      console.log("ERR ", err);
    }),
  );
};

export const RecentApps = () => {
  let recentApps = JSON.parse(localStorage.getItem("PrifinaRecentApps"));
  if (recentApps === null) {
    recentApps = ["./AppMarketIcon", "./NewsMuzzlerIcon"];
    localStorage.setItem("PrifinaRecentApps", JSON.stringify(recentApps));
  }

  const apps = recentApps.map(app => {
    return importComponent(app);
  });

  return (
    <React.Suspense fallback={"Loading ..."}>
      {apps.map((Component, i) => {
        return <Component key={"app-" + i} />;
      })}
    </React.Suspense>
  );
};
