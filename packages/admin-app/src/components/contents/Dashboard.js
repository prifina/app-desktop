import React, { useState } from "react";

import PropTypes from "prop-types";
import UserCountCard from "../../lib/UserCountCard";
import CognitoMetricImageCard from "../../lib/CognitoMetricImageCard";
import CognitoMetricsTable from "../../lib/CognitoMetricsTable";

const Content = ({ userCount, cognitoMetricImage, metrics }) => {
  const [showDetails, setDetailsClick] = useState(false);
  // console.log("METRICS C ", metrics);
  const detailsClick = () => {
    // console.log("CLICK ");
    setDetailsClick(!showDetails);
  };
  return (
    <>
      <UserCountCard userCount={userCount} />
      <CognitoMetricImageCard cognitoMetricImage={cognitoMetricImage} detailsClick={detailsClick} />
      {showDetails && <CognitoMetricsTable data={metrics} />}
    </>
  );
};

Content.propTypes = {
  userCount: PropTypes.number,
  cognitoMetricImage: PropTypes.object,
  metrics: PropTypes.array,
};

export default Content;
