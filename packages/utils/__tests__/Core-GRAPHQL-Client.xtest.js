
import { isDeepEqual } from "./tools";

import {
  getCountryCode, getPrifinaSession, checkCognitoAttribute, getLoginUserIdentityPool, getVerification,
  checkUsername, getSystemNotificationCount, getRequestToken, getPrifinaUser, getAddressBook,
  listSystemNotificationsByDate, listDataSources, getAppVersion, listApps, listAppMarket
} from "../src/graphql/queries";
import { sendVerification, changeUserPassword, addPrifinaSession, deletePrifinaSession, updateUserProfile } from "../src/graphql/mutations";

import { countryCodes } from "../src/lib/mocks/helpers";

// replace this later with lib under tests... 
import { prifinaSession, prifinaUser, systemNotifications, dataSources, apps, widgets } from "../src/lib/mocks/coreModels";

let PrifinaClient;

(async () => {
  if (process.env.REACT_APP_MOCKUP_CLIENT === "true") {

    const {
      CoreGraphQLApi
    } = await import("../src/lib/MockClient");

    PrifinaClient = new CoreGraphQLApi();

  }
})();

describe.only('Client GRAPHQL testing...', () => {

  //it.todo('needs tests2');

  // UNAUTH queries...
  it("getCountryCode", async () => {
    //console.log("CLIENT ", PrifinaClient);
    const result = await PrifinaClient.graphql(getCountryCode, {}, "AWS_IAM");
    //console.log("RES ", countryCodes, result);
    expect(countryCodes).toContain(result.data.getCountryCode);
  })
  it("getSession", async () => {
    //console.log("CLIENT ", PrifinaClient);
    const result = await PrifinaClient.graphql(getPrifinaSession, {}, "AWS_IAM");
    //console.log("RES ", result);

    const compKeys = isDeepEqual(result.data.getSession, prifinaSession);
    //console.log("RES ", compKeys);
    expect(compKeys).toBeTruthy();
  })
  it("checkCognitoAttribute, false", async () => {
    //console.log("CLIENT ", PrifinaClient);
    PrifinaClient.setOption({ attributeExists: false })
    const result = await PrifinaClient.graphql(checkCognitoAttribute, {}, "AWS_IAM");
    //console.log("RES ", result);
    expect(result.data.checkCognitoAttribute).toBeFalsy();
  })
  it("checkCognitoAttribute, true", async () => {
    //console.log("CLIENT ", PrifinaClient);
    PrifinaClient.setOption({ attributeExists: true })
    const result = await PrifinaClient.graphql(checkCognitoAttribute, {}, "AWS_IAM");
    // console.log("RES ", result);
    expect(result.data.checkCognitoAttribute).toBeTruthy();

  })
  it("getLoginUserIdentityPool", async () => {
    //console.log("CLIENT ", PrifinaClient);
    const result = await PrifinaClient.graphql(getLoginUserIdentityPool, {}, "AWS_IAM");
    // console.log("RES ", result);

    expect(result.data.getLoginUserIdentityPool).toEqual(prifinaSession.identityPool);
  })
  it("getVerification, true", async () => {
    //console.log("CLIENT ", PrifinaClient);
    PrifinaClient.setOption({ verificationExists: true })
    const result = await PrifinaClient.graphql(getVerification, { user_code: "verification-code" }, "AWS_IAM");
    //console.log("RES ", result);
    expect(result.data.getVerification).toMatchObject({ user_code: "verification-code" }) // true
  })
  it("getVerification, false", async () => {
    //console.log("CLIENT ", PrifinaClient);
    PrifinaClient.setOption({ verificationExists: false })
    const result = await PrifinaClient.graphql(getVerification, { user_code: "verification-code" }, "AWS_IAM");
    //console.log("RES ", result);
    expect(result.data.getVerification).toBeNull()
  })
  /* Appsync resolver missing... 
  it("checkUsername, false", async () => {
    //console.log("CLIENT ", PrifinaClient);
    PrifinaClient.setOption({ userExists: false })
    const result = await PrifinaClient.graphql(checkUsername, {}, "AWS_IAM");
    //console.log("RES ", result);
    expect(result.data.checkUsername).toBeFalsy();
  })
  it("checkUsername, true", async () => {
    //console.log("CLIENT ", PrifinaClient);
    PrifinaClient.setOption({ userExists: true })
    const result = await PrifinaClient.graphql(checkUsername, {}, "AWS_IAM");
    //console.log("RES ", result);
    expect(result.data.checkUsername).toBeTruthy();
  })
  */
  // UNAUTH mutations...
  it("sendVerification", async () => {
    const result = await PrifinaClient.graphql(sendVerification, {}, "AWS_IAM");
    //console.log("RES ", result);
    expect(result.data.sendVerification).toBeTruthy()
  })
  it("changeUserPassword", async () => {
    const result = await PrifinaClient.graphql(changeUserPassword, {}, "AWS_IAM");
    // console.log("RES ", result);
    expect(result.data.changeUserPassword).toBeTruthy()
  })

  // AUTH queries... 
  it("getSystemNotificationCount", async () => {
    //console.log("CLIENT ", PrifinaClient);
    const result = await PrifinaClient.graphql(getSystemNotificationCount, {});
    //console.log("RES ", result);
    expect(result.data.getSystemNotificationCount).toBeGreaterThanOrEqual(0);
    expect(result.data.getSystemNotificationCount).toBeLessThanOrEqual(999);
  })
  it("getRequestToken", async () => {
    //console.log("CLIENT ", PrifinaClient);
    const result = await PrifinaClient.graphql(getRequestToken, {});
    //console.log("RES ", result);
    expect(result.data.getRequestToken).toMatchObject({ requestURL: expect.anything() })
  })
  it("getPrifinaUser", async () => {
    //console.log("CLIENT ", PrifinaClient);
    const result = await PrifinaClient.graphql(getPrifinaUser, {});
    //console.log("RES ", result);

    const compKeys = isDeepEqual(result.data.getPrifinaUser, prifinaUser);
    //console.log("RES ", compKeys);
    expect(compKeys).toBeTruthy();
  })
  it("getAddressBook", async () => {
    //console.log("CLIENT ", PrifinaClient);
    const result = await PrifinaClient.graphql(getAddressBook, {});
    //console.log("RES ", result);
    // no addressbook content yet...
    expect(result.data.getUserAddressBook).toMatchObject({ id: expect.anything() })
  })
  it("listSystemNotificationsByDate", async () => {

    const result = await PrifinaClient.graphql(listSystemNotificationsByDate, {});
    //console.log("RES ", result);
    const compKeys = isDeepEqual(result.data.listSystemNotificationsByDate.items[0], systemNotifications[0]);
    //console.log("RES ", compKeys);
    expect(compKeys).toBeTruthy();
  })

  it("listDataSources", async () => {

    const result = await PrifinaClient.graphql(listDataSources, {});
    //console.log("RES ", result);

    const compKeys = isDeepEqual(result.data.listDataSources.items[0], dataSources[0]);
    //console.log("RES ", compKeys);
    expect(compKeys).toBeTruthy();
  })

  it("getAppVersion, idx=3", async () => {

    PrifinaClient.setOption({ appIndex: 3 })
    const result = await PrifinaClient.graphql(getAppVersion, {}, "AWS_IAM");
    //console.log("RES ", result);

    const compKeys = isDeepEqual(result.data.getAppVersion, apps[3]);
    //console.log("RES ", compKeys);
    expect(compKeys).toBeTruthy();
  })


  it("listApps", async () => {

    const result = await PrifinaClient.graphql(listApps, {});
    //console.log("RES ", result);

    const compKeys = isDeepEqual(result.data.listApps.items[0], apps[0]);
    //console.log("RES ", compKeys);
    expect(compKeys).toBeTruthy();
  })

  it("listAppMarket", async () => {

    const result = await PrifinaClient.graphql(listAppMarket, {});
    //console.log("RES ", result);

    const compKeys = isDeepEqual(result.data.listAppMarket.items[0], widgets[0]);
    //console.log("RES ", compKeys);
    expect(compKeys).toBeTruthy();
  })

  // AUTH mutations
  //addPrifinaSessionMutation,
  //deletePrifinaSessionMutation,
  it("addPrifinaSession", async () => {
    const result = await PrifinaClient.graphql(addPrifinaSession, {});
    //console.log("RES ", result);
    expect(result.data.addSession).toBeTruthy()
  });
  it("deletePrifinaSession", async () => {
    const result = await PrifinaClient.graphql(deletePrifinaSession, {});
    // console.log("RES ", result);
    expect(result.data.deleteSession).toBeTruthy()
  })

  it("updateUserProfile", async () => {
    const result = await PrifinaClient.graphql(updateUserProfile, {});
    console.log("RES ", result);
    const compKeys = isDeepEqual(result.data.updateUserProfile, prifinaUser);
    //console.log("RES ", compKeys);
    expect(compKeys).toBeTruthy();
  })
  /*

  updateUserProfileMutation,


export const updateUserProfile = `mutation updateUserProfile($id:String!, $profile:AWSJSON) {
  updateUserProfile(id:$id,profile:$profile) {
    appProfile
    id
  }
}`;
*/
  /*
  export const addPrifinaSession = `mutation addSession($input:SessionInput) {
    addSession(input: $input)
  }`;
  
  export const deletePrifinaSession = `mutation deleteSession($tracker: String!) {
    deleteSession(tracker: $tracker) 
  }`;
  */

});

//27 core mutations, 25 left
//27 core queries, 20 left

// 11 user queries
// 11 user mutations... 

/*


type Query @aws_cognito_user_pools @aws_iam {
 
 

type Query @aws_cognito_user_pools @aws_iam {
  
  listSystemNotifications(
    filter: TableNotificationFilterInput
    limit: Int
    nextToken: String
    sortDirection: String
  ): NotificationsConnection
  


  
  listPrifinaUsers(
    filter: TablePrifinaUserFilterInput
    limit: Int
    nextToken: String
  ): PrifinaUserConnection
  

  getAppVersion(id: String!): AppVersion

  listApps(
    filter: TableAppsFilterInput
    limit: Int
    nextToken: String
    sortDirection: String
  ): AppsConnection
  listAppMarket(
    filter: TableAppMarketFilterInput
    limit: Int
    nextToken: String
    sortDirection: String
  ): AppMarketConnection

  listDataSources(
    filter: TableDataSourceFilterInput
    limit: Int
    nextToken: String
    sortDirection: String
  ): DataSourcesConnection
}
*/
/*




  const prifinaWidgets = await listAppMarketQuery(GRAPHQL, {
    filter: { appType: { eq: 2 } },
  });

  const prifinaDataSources = await listDataSourcesQuery(GRAPHQL, {});
  console.log("DATA SOURCES ", prifinaDataSources);
  let dataSources = {};
  prifinaDataSources.data.listDataSources.items.forEach(item => {
    dataSources[item.source] = {
      modules: item.modules,
      sourceType: item.sourceType,
    };
  });

  let widgetData = {};
  prifinaWidgets.data.listAppMarket.items.forEach(item => {
    console.log("APPMARKET ITEM ", item);

        
  
        const result = await getAppVersionQuery(GRAPHQL, appID);
        const currentApp = result.data.getAppVersion;      

*/
/*

installWidgetMutation(GraphQLClient, prifinaID, {
  id: id,
  settings: settings,
  index: -1,
}).then(res => {
  console.log("INSTALL ", res);

  widgets.current[id].installed = true;

  setInstalledWidgets(...installedWidgets, id);
});


const defaultProfileUpdate = await updateUserProfileMutation(
  GRAPHQL,
  currentUser.prifinaID,
);

deletePrifinaSessionMutation(API, tracker).then(() => {
  Auth.signOut().then(() => {
    setState({ isAuthenticated: auth });
    //history.replace("/");
    navigate("/", { replace: true })

  });
});

await newAppVersionMutation(API, appFields.appId, currentUser.prifinaID, {
  name: appFields.name,
  title: appFields.title,
  identity: currentUser.identity,
  identityPool: currentUser.identityPool,
  version: appFields.version,
  appType: appType,
});

updateAppVersionMutation(GRAPHQL, {
  id: id,
  appType: newAppType,
  name: newName,
  nextVersion: newVersion,
  publisher: newPublisher,
  category: newCategory,
  deviceSupport: newDeviceSupport,
  languages: newLanguages,
  age: newAge,
  keyFeatures: newKeyFeatures,
  shortDescription: newShortDescription,
  longDescription: newLongDescription,
  userHeld: newUserHeld,
  userGenerated: newUserGenerated,
  public: newPublic,
  icon: newIcon,
  remoteUrl: newRemoteUrl,
  dataSources: JSON.stringify(newDataSources),
}).then(res => {
  console.log("SUCCESS", res);
  toast.success("Project details updated", {});
  // location.reload();
  //   setStep(2);
});
};


return updatePrifinaUserMutation(GRAPHQL, {
  id: uuid,
  viewSettings: JSON.stringify(viewSettings),
});


addUserToCognitoGroupMutation(GRAPHQL, prifinaID, newGroup)
        .then(res => {
          window.location.href = "/home"; // browser-back is /core/dev-console
        })
        .catch(err => {
          console.log("ADD GROUP ERROR ", err);
        });


        deleteAppVersionMutation(GRAPHQL, allValues.id).then(res => {
          console.log("SUCCESS", res);
          // location.reload();
          toast.success("Deleted project", {});
        });
        
        
        changeUserPasswordMutation(
          API,
          loginFields.username +
            "#" +
            getClientID +
            "#both#" +
            loginFields.confirmationCode,
    
          loginFields.passwordConfirm,
        ).then(res => {
          alerts.success(i18n.__("success"), {});
    
          console.log("SUCCESS", res);
        });

        updateCognitoUserMutation(API, "email", state.email.value).then(res => {
          alerts.success("Email changed", {});
          console.log("SUCCESS", res);
        });


await client.mutate({
  mutation: gql(updateActivity),
  variables: {
    id: prifinaID,
    activeApp: coreApp,
  },
});

*/