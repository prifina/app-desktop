import { getRandomInt, countryCodes } from "./helpers";

import { prifinaSession, prifinaUser, systemNotifications, dataSources, apps, widgets, prifinaApps } from "./coreModels";

const countryCode = () => {
  // console.log("CODES ", codes)
  return countryCodes[getRandomInt(0, countryCodes.length - 1)];
}


export const coreMockups = {
  query: {
    appMarketList: (variables, Options) => {

      console.log("APP MARKET ", variables);
      if (variables?.filter?.appType?.eq === 3) {
        return { data: { listAppMarket: { items: prifinaApps, nextToken: null } } }
      }
      // currently only returns widgets... "appType": 2
      return { data: { listAppMarket: { items: widgets, nextToken: null } } }
    },
    appsList: (variables, Options) => {
      return { data: { listApps: { items: apps, nextToken: null } } }
    },
    appVerion: (variables, Options) => {
      let appIdx = 0;
      if (Options.hasOwnProperty("appIndex")) {
        appIdx = Options.appIndex;
      }
      return { data: { getAppVersion: apps[appIdx] } }
    },
    listDataSources: (variables, Options) => {
      return { data: { listDataSources: { items: dataSources, nextToken: null } } }
    },
    listSystemNotificationsByDate: (variables, Options) => {
      return { data: { listSystemNotificationsByDate: { items: systemNotifications, nextToken: null } } }
    },
    addressBook: (variables, Options) => ({ data: { getUserAddressBook: { id: "xxxx", addressBook: [] } } }),
    prifinaUser: (variables, Options) => {
      const defaultPrifinaUser = prifinaUser;
      const currentData = localStorage.getItem("_mockPrifinaUser");
      if (currentData != null) {
        let mockData = {};
        if (prifinaUser?.viewSettings) {
          mockData.viewSettings = JSON.parse(prifinaUser.viewSettings);
        }
        if (prifinaUser?.installedWidgets) {
          mockData.installedWidgets = JSON.parse(prifinaUser.installedWidgets);
        }
        const currentDataJSON = JSON.parse(currentData)
        const installedWidgets = currentDataJSON[prifinaUser.id].installedWidgets;
        const viewSettings = currentDataJSON[prifinaUser.id].viewSettings;
        if (installedWidgets && installedWidgets !== null && installedWidgets.length > 0) {
          installedWidgets.forEach((w, i) => {
            const wIdx = mockData.installedWidgets.findIndex(el => el.id === w.id);
            // stored data element does not exist
            if (wIdx === -1) {
              mockData.installedWidgets.push(w)
            }
          });
        }

        defaultPrifinaUser.viewSettings = JSON.stringify(viewSettings);
        defaultPrifinaUser.installedWidgets = JSON.stringify(mockData.installedWidgets);
        //console.log("PRIFINA USER ", defaultPrifinaUser, viewSettings, currentDataJSON[prifinaUser.id]);
      }
      console.log("PRIFINA USER ", defaultPrifinaUser);
      return Promise.resolve({ data: { getPrifinaUser: defaultPrifinaUser } });
    },

    //({ data: { getPrifinaUser: prifinaUser } }),
    getRequestToken: (variables, Options) => ({ data: { getRequestToken: { requestURL: "https://xxx.xxx" } } }),
    systemNotificationCount: (variables, Options) => ({ data: { getSystemNotificationCount: getRandomInt(0, 999) } }),
    getSession: (variables, Options) => ({ data: { getSession: prifinaSession } }),
    getCountryCode: (variables, Options) => ({ data: { getCountryCode: countryCode() } }),
    checkCognitoAttribute: (variables, Options) => {
      let attributeExists = false;
      if (Options.hasOwnProperty("attributeExists")) {
        attributeExists = Options.attributeExists;
      }

      return { data: { checkCognitoAttribute: attributeExists } };
    },
    checkUsername: (variables, Options) => {
      let userExists = false;
      if (Options.hasOwnProperty("userExists")) {
        userExists = Options.userExists;
      }

      return { data: { checkUsername: userExists } };
    },

    getVerification: (variables, Options) => {
      let verification = { result: true, user_code: variables.user_code };
      if (Options.hasOwnProperty("verificationExists") && !Options.verificationExists) {
        verification = null;
      }
      console.log("GET VERIFICATION ", variables)
      return { data: { getVerification: verification } }

    },
    getLoginUserIdentityPool: (variables, Options) => ({ data: { getLoginUserIdentityPool: prifinaSession.identityPool } }),
  },
  mutation: {
    sendVerification: (variables, Options) => ({ data: { sendVerification: true } }),
    changeUserCognitoPassword: (variables, Options) => ({ data: { changeUserPassword: true } }),
    addSession: (variables, Options) => ({ data: { addSession: true } }),
    deleteSession: (variables, Options) => ({ data: { deleteSession: true } }),
    updateUserProfile: (variables, Options) => ({ data: { updateUserProfile: prifinaUser } }),
    updateCognitoUser: (variables, Options) => ({ data: { updateCognitoUser: true } }),
    addInstalledWidget: (variables, Options) => ({ data: { addInstalledWidgets: { id: "", addInstalledWidgets: [] } } }),
    updatePrifinaUser: (variables, Options) => {
      console.log("UPDATE....", variables);
      //let updates={id:variables.id,viewSettings:[],installedWidgets:[]};
      let updates = {};
      updates[variables.id] = {};
      if (variables?.viewSettings) {
        updates[variables.id].viewSettings = JSON.parse(variables.viewSettings);
      }
      // check if only view settings are updated...
      if (variables?.installedWidgets) {
        updates[variables.id].installedWidgets = JSON.parse(variables.installedWidgets);
      }
      const currentData = localStorage.getItem("_mockPrifinaUser");
      if (currentData != null) {
        const userData = JSON.parse(currentData);
        //console.log("SAVE USER DATA", userData, userData?.[variables.id]);
        if (userData?.[variables.id] && userData[variables.id]?.installedWidgets && updates[variables.id]?.installedWidgets) {
          userData[variables.id].installedWidgets.forEach((w, i) => {
            const wIdx = updates[variables.id].installedWidgets.findIndex(el => el.id === w.id);
            // stored data element does not exist
            if (wIdx === -1) {
              updates[variables.id].installedWidgets.push(w)
            }
          });

          //viewSettings should be up to date....

        } else {
          // what if there is more than one user ID ???
          // only view settings are updated...
          //console.log("UPDATE VIEW SETTINGS", userData, updates)
          updates = { ...userData, ...updates };
        }

      }
      localStorage.setItem("_mockPrifinaUser", JSON.stringify(updates));
      return Promise.resolve({ id: variables.id, ...updates[variables.id] });

    }
    /*
    {
        "id": "6145b3af07fa22f66456e20eca49e98bfe35",
        "viewSettings": "[{\"view\":{\"title\":\"TERO's home\"},\"widgets\":{\"o3CH1e2kbrLgBxjbG2iLzd\":
        {\"currentSettings\":{\"city\":\"Parikkala\",\"size\":\"300x300\",\"theme\":\"dark\"},
        \"order\":0,\"settingsExists\":true}
      }
    }]",
        "installedWidgets": "[{\"id\":\"o3CH1e2kbrLgBxjbG2iLzd\",
        \"settings\":
        [{\"field\":\"city\",\"value\":\"Parikkala\"},
        {\"field\":\"size\",\"value\":\"300x300\"},
        {\"field\":\"theme\",\"value\":\"dark\"}]}]"
    }
        */
    /*

export const updatePrifinaUser = `mutation updatePrifinaUser($input: UpdatePrifinaUserInput!) {
  updatePrifinaUser(input: $input) {
    appProfile
    dataSources
    id
    installedApps
    installedWidgets
    viewSettings
  }
}`;
    */
  }
}
/*
sendVerification(message: String!, subject: String!): Boolean
changeUserPassword(user_code: String!, password: String!): Boolean


getVerification(user_code: String!): Verification


type Verification @aws_cognito_user_pools @aws_iam {
  result: String
  user_code: String!
}

getLoginUserIdentityPool(username: String!, poolID: String!): String

*/