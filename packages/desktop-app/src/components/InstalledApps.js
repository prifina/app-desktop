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
  const appIcons = apps.map(app => {
    return importComponent(app);
  });

  return (
    <React.Suspense fallback={"Loading ..."}>
      {appIcons.map((Component, i) => {
        return <Component key={"app-" + i} />;
      })}
    </React.Suspense>
  );
};

InstalledApps.propTypes = {
  apps: PropTypes.instanceOf(Array).isRequired,
};
