export const getCognitoUserCount = `query cognitoUserCount($poolID: String!) {
  getCognitoUserCount(poolID: $poolID)
}`;

export const getCognitoMetricImage = `query cognitoMetricImage {
  getCognitoMetricImage {
    result
  }
}`;

export const getCognitoMetrics = `query cognitoMetrics {
  getCognitoMetrics {
    result
  }
}`;
