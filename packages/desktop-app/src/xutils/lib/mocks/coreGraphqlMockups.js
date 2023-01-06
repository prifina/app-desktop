import { getRandomInt, countryCodes } from "./helpers";

import { prifinaSession, prifinaUser, systemNotifications, dataSources, apps, widgets } from "./coreModels";

const countryCode = () => {
  // console.log("CODES ", codes)
  return countryCodes[getRandomInt(0, countryCodes.length - 1)];
}


export const coreMockups = {
  query: {
    appMarketList: (variables, Options) => {
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
    listSystemNotifications: (variables, Options) => {
      return { data: { listSystemNotificationsByDate: { items: systemNotifications, nextToken: null } } }
    },
    addressBook: (variables, Options) => ({ data: { getUserAddressBook: { id: "xxxx", addressBook: [] } } }),
    prifinaUser: (variables, Options) => ({ data: { getPrifinaUser: prifinaUser } }),
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
      let verification = { result: "", user_code: variables.user_code };
      if (Options.hasOwnProperty("verificationExists") && !Options.verificationExists) {
        verification = null;
      }

      return { data: { getVerification: verification } }
      //{ data: { checkCognitoAttribute: attributeExists } };
    },


    getLoginUserIdentityPool: (variables, Options) => ({ data: { getLoginUserIdentityPool: prifinaSession.identityPool } }),
  },
  mutation: {
    sendVerification: (variables, Options) => ({ data: { sendVerification: true } }),
    changeUserCognitoPassword: (variables, Options) => ({ data: { changeUserPassword: true } }),
    addSession: (variables, Options) => ({ data: { addSession: true } }),
    deleteSession: (variables, Options) => ({ data: { deleteSession: true } }),


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