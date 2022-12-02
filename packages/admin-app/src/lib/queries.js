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
export const getCognitoUserDetails = `query cognitoUserDetails($attrName: String!, $attrValue: String!) {
  getCognitoUserDetails(attrName: $attrName, attrValue: $attrValue) {
    result
  }
}`;

/*
export const checkCognitoAttribute = `query
checkCognitoAttribute($attrName: String!,$attrValue: String!,$poolID: String!) {
  checkCognitoAttribute(attrName: $attrName,attrValue: $attrValue,poolID: $poolID)
}
`; */
