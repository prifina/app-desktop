export const CognitoMetricData = cognitoMetric => {
  const tsData = {};
  // console.log("METRIC RES ", cognitoMetric);

  for (let i = 0; i < cognitoMetric.length; i++) {
    const label = cognitoMetric[i].Label;
    // console.log("LABEL ", label)
    // console.log("TS ", label)
    for (let ts = 0; ts < cognitoMetric[i].Timestamps.length; ts++) {
      const tsVal = cognitoMetric[i].Timestamps[ts];
      if (!tsData?.[tsVal]) {
        // tsData[tsVal] = { [label]: 0 };
        tsData[tsVal] = { SignInSuccesses: 0, SignUpSuccesses: 0, TokenRefreshSuccesses: 0 };
      }
      tsData[tsVal][label] = cognitoMetric[i].Values[ts];
    }
  }
  // console.log("TS DATA ", tsData);
  const metricData = Object.keys(tsData).map(t => ({ TS: t, ...tsData[t] }));
  // console.log(metricData);
  // console.log(metricData.sort((a, b) => (a.TS > b.TS) ? -1 : 1))

  // ctx.args['data'] = metricData.sort((a, b) => (a.TS > b.TS) ? -1 : 1);
  return metricData.sort((a, b) => ((a.TS > b.TS) ? -1 : 1));
};
