import { getRandomInt } from "./helpers";

export const adminMockups = {
  query: {
    cognitoUserCount: variables => ({ data: { getCognitoUserCount: getRandomInt(55, 9999) } }),
    cognitoMetrics: () => ({ data: { getCognitoMetrics: { result: JSON.stringify(cognitoMetricJSON) } } }),
    cognitoMetricImage: () => ({ data: { getCognitoMetricImage: { result: cognitoMetric } } }),
    cognitoUserDetails: variables => {
      // could use variables to get "filtered" user
      const detailsJSON = JSON.parse(cognitoDetails);
      // UserCreateDate and UserLastModifiedDate are very long integers and converted to exp format...
      // detailsJSON.UserCreateDate = new Date(Math.trunc(detailsJSON.UserCreateDate) * 1000).toISOString();
      // detailsJSON.UserLastModifiedDate = new Date(Math.trunc(detailsJSON.UserLastModifiedDate) * 1000).toISOString();

      const cognitoAttributes = localStorage.getItem("_mockCognitoAttributes");
      if (cognitoAttributes != null) {
        // merge existing attributes...
        const storageAttributes = JSON.parse(cognitoAttributes);
        // updates = { ...storageAttributes, ...updates };
        detailsJSON.Attributes.forEach((attr, i) => {
          if (storageAttributes?.[attr.Name]) {
            detailsJSON.Attributes[i].Value = storageAttributes[attr.Name];
          }
          /* if (attr.Name === "preferred_username" && storageAttributes?.username) {
            detailsJSON.Attributes[i].Value = storageAttributes.username;
          } */
        });
      }

      return { data: { getCognitoUserDetails: { result: JSON.stringify(detailsJSON) } } };
    },
  },
  mutation: {
    updateCognitoUser: attrs => {
      // Note does not update username level attributes, only the current mockup object userName
      // const details = JSON.parse(cognitoDetails);
      // console.log(details, attrs);
      const cognitoAttributes = localStorage.getItem("_mockCognitoAttributes");
      // console.log("LOCAL ", cognitoAttributes);
      let updates = { [attrs.attrName]: attrs.attrValue };
      if (cognitoAttributes != null) {
        // merge existing attributes...
        const storageAttributes = JSON.parse(cognitoAttributes);
        updates = { ...storageAttributes, ...updates };
      }
      localStorage.setItem("_mockCognitoAttributes", JSON.stringify(updates));
      return true;
    },
  },
};
