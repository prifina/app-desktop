
import {
  getCountryCode, getPrifinaSession, checkCognitoAttribute, getLoginUserIdentityPool, getVerification,
  checkUsername, getSystemNotificationCount, getRequestToken, getPrifinaUser, getAddressBook,
  listSystemNotificationsByDate, listDataSources, getAppVersion, listApps, listAppMarket
} from "../src/graphql/queries";


let UserClient;

(async () => {
  if (process.env.REACT_APP_MOCKUP_CLIENT === "true") {

    const {
      AppSyncClient
    } = await import("../src/lib/MockClient");

    UserClient = new AppSyncClient();

  }
})();

describe.only('Client Appsync GRAPHQL testing...', () => {

  //it.todo('needs tests2');
  it("getPrifinaUser", async () => {
    //console.log("CLIENT ", PrifinaClient);
    const result = await UserClient.query(getPrifinaUser, {});
    console.log("RES ", result);

    //const compKeys = isDeepEqual(result.data.getPrifinaUser, prifinaUser);
    //console.log("RES ", compKeys);
    //expect(compKeys).toBeTruthy();
  })
});


/*
type Query @aws_iam {
  getMsgs(input: DataObjectInput): ObjectData
  getUnreadMsgs(input: DataObjectInput): ObjectData
  getAddressBook(input: DataObjectInput!): ObjectData
  getDataConnector(id: String!): UserDataConnector

  getDataObject(input: DataObjectInput!): ObjectData
  
  getNotificationCount(filter: TableNotificationFilterInput): Int

  getS3Object(input: S3ObjectInput!): S3ObjectData

  getUserAddressBook(id: String!): UserAddressBook
  listNotifications(
    filter: TableNotificationFilterInput
    limit: Int
    nextToken: String
    sortDirection: String
  ): NotificationsConnection
  listNotificationsByDate(
    filter: TableNotificationByDateFilterInput
    limit: Int
    nextToken: String
    owner: String!
    sortDirection: String
  ): NotificationsConnection
  listUnreadMessages(
    limit: Int
    nextToken: String
    receiver: String!
  ): MessagesConnection
}


type Mutation @aws_iam @aws_cognito_user_pools {
  createDataMessage(input: MessageInput!): MsgObjectData
  athenaData(id: String!, appId: String!, data: String): AthenaData
  addUserMetaData(input: UserMetaDataInput): UserMetaData
  addNotification(input: NotificationInput!): NotificationItem
  addSearchKey(input: SearchKeyInput): Boolean
  addSearchResult(input: SearchResultInput): Boolean
  createMessage(input: MessageInput!): MsgObjectData
  createNotification(input: NotificationInput!): Notification
  updateActivity(activeApp: String!, id: String!): Boolean
  updateMessageStatus(input: DataObjectInput): Boolean
  updateNotificationStatus(notificationId: String!, status: Int!): Notification
}

*/