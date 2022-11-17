/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { loadComponent } from "./loadComponent";

//import Loading from "./Loading";
// github raw does not have proper content type (javascript), https://raw.githubusercontent.com/prifina/widgets/master/packages/weather/dist/main.bundle.js
// use other service like jsdeliver ... cdn.jsdelivr.net.... 
export const Remote = forwardRef((props, ref) => {
  const {
    system,
    system: { remote, url, module },
    componentProps,
    Loading
  } = props;

  if (!system || !remote || !url || !module) {
    console.log("SYSTEM ", system)
    console.log("REMOTE ", remote,)
    console.log("URL ", url,)
    console.log("MODULE ", module)
    return <h2>No system specified</h2>;
  }

  // remote =>name (webpack name),sharedScope,module (shared component),url
  const Component = React.lazy(loadComponent(remote, "default", module, url));
  const Fallback = Loading || "Loading...";
  return (
    <React.Suspense fallback={Fallback} >
      <div ref={ref} style={{ width: "100%", height: "100%" }}>
        <Component {...componentProps} />
      </div>

    </React.Suspense>
  );
});

Remote.propTypes = {
  system: PropTypes.object.isRequired,
  componentProps: PropTypes.object,
  Loading: PropTypes.node
};
