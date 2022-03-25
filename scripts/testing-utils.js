const {
  DynamoDBClient,
  DeleteItemCommand,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");

const {
  CognitoIdentityProviderClient,
} = require("@aws-sdk/client-cognito-identity-provider");

const { defaultProvider } = require("@aws-sdk/credential-provider-node");

const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

const {
  GetCommand,
  UpdateCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  HeadObjectCommand,
  SelectObjectContentCommand,
  WriteGetObjectResponseCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  // DeleteBucketCommand,
} = require("@aws-sdk/client-s3");
const {
  AdminAddUserToGroupCommand,
  AdminUpdateUserAttributesCommand,
  AddCustomAttributesCommand,
  AdminRemoveUserFromGroupCommand,
  ListUsersInGroupCommand,
  ListUsersCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} = require("@aws-sdk/client-cognito-identity");

const defaultCredentials = defaultProvider();

const clientCredentials = {
  credentials: defaultCredentials,
  region: process.env.AWS_DEFAULT_REGION,
};

const cognitoClientCredentials = {
  credentials: defaultCredentials,
  region: "us-east-1",
};
const ddbClient = new DynamoDBClient(clientCredentials);

const cognitoClient = new CognitoIdentityProviderClient(
  cognitoClientCredentials,
);

// Create an Amazon S3 service client object.
const s3Client = new S3Client(clientCredentials);
const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

// Create the DynamoDB Document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

// Create an Amazon STS service client object.
const stsClient = new STSClient(clientCredentials);
/*
console.log(
  "CREDS",
  clientCredentials.credentials().then(res => {
    console.log("RES ", res);
    return true;
  }),
);
*/
/*
function deleteBucket(params) {
  return s3Client.send(new DeleteBucketCommand(params));
}

GroupName
Limit
NextToken
UserPoolId
 const params = Object.assign({}, query, {
      "UserPoolId": userPool,
      "PaginationToken": lastKey,
      "Filter":"cognito:user_status = \"UNCONFIRMED\"",
      "Limit": 20
  });

*/

function cognitoListUsersInGroup(payload) {
  const params = {
    GroupName: payload.group,
    UserPoolId: payload.pool_id,
  };
  if (
    (process.env.hasOwnProperty("DEBUG") && process.env.DEBUG) ||
    process.env.hasOwnProperty("JEST_WORKER_ID")
  ) {
    console.log("PARAMS", params);
  }
  /*
  console.log(
    cognitoClient.config.credentials().then((res) => {
      console.log("RES ", res);
    })
  );
  */
  return cognitoClient.send(new ListUsersInGroupCommand(params));
}

function cognitoRemoveUserToGroup(payload) {
  const params = {
    GroupName: payload.group,
    UserPoolId: payload.pool_id,
    Username: payload.user_id,
  };
  if (
    (process.env.hasOwnProperty("DEBUG") && process.env.DEBUG) ||
    process.env.hasOwnProperty("JEST_WORKER_ID")
  ) {
    console.log("PARAMS", params);
  }
  /*
  console.log(
    cognitoClient.config.credentials().then((res) => {
      console.log("RES ", res);
    })
  );
  */
  return cognitoClient.send(new AdminRemoveUserFromGroupCommand(params));
}
function cognitoAddUserToGroup(payload) {
  const params = {
    GroupName: payload.group,
    UserPoolId: payload.pool_id,
    Username: payload.user_id,
  };
  if (
    (process.env.hasOwnProperty("DEBUG") && process.env.DEBUG) ||
    process.env.hasOwnProperty("JEST_WORKER_ID")
  ) {
    console.log("PARAMS", params);
  }
  /*
  console.log(
    cognitoClient.config.credentials().then((res) => {
      console.log("RES ", res);
    })
  );
  */
  return cognitoClient.send(new AdminAddUserToGroupCommand(params));
}

function updateItem(params) {
  /*
    Convert the attribute JavaScript object you are updating to the required
    Amazon  DynamoDB record. The format of values specifies the datatype. The
    following list demonstrates different datatype formatting requirements:
    String: "String",
    NumAttribute: 1,
    BoolAttribute: true,
    ListAttribute: [1, "two", false],
    MapAttribute: { foo: "bar" },
    NullAttribute: null
     */
  /* 
  // Set the parameters
  const params = {
    TableName: "TABLE_NAME",
   
    Key: {
      primaryKey: "VALUE_1", // For example, 'Season': 2.
      sortKey: "VALUE_2", // For example,  'Episode': 1; (only required if table has sort key).
    },
    // Define expressions for the new or updated attributes
    UpdateExpression: "set ATTRIBUTE_NAME_1 = :t, ATTRIBUTE_NAME_2 = :s", // For example, "'set Title = :t, Subtitle = :s'"
    ExpressionAttributeValues: {
      ":t": "NEW_ATTRIBUTE_VALUE_1", // For example ':t' : 'NEW_TITLE'
      ":s": "NEW_ATTRIBUTE_VALUE_2", // For example ':s' : 'NEW_SUBTITLE'
    },
  };
  */
  return ddbDocClient.send(new UpdateCommand(params));
}

function copyObject(params) {
  return s3Client.send(new CopyObjectCommand(params));
}
function deleteObject(params) {
  return s3Client.send(new DeleteObjectCommand(params));
}
function deleteObjects(params) {
  return s3Client.send(new DeleteObjectsCommand(params));
}
function listObjects(params) {
  return s3Client.send(new ListObjectsV2Command(params));
}
function scanItems(params) {
  return ddbDocClient.send(new ScanCommand(params));
}
function getItem(params) {
  return ddbDocClient.send(new GetCommand(params));
}
function deleteItem(params) {
  return ddbDocClient.send(new DeleteCommand(params));
  //return ddbClient.send(new DeleteItemCommand(params));
}
function deleteItems(params) {
  return ddbClient.send(new BatchWriteItemCommand(params));
  //return ddbClient.send(new DeleteItemCommand(params));
}

function addItems(params) {
  return ddbClient.send(new BatchWriteItemCommand(params));
  //return ddbClient.send(new DeleteItemCommand(params));
}

function getDataSourceUsers(dataSource = null) {
  let params = {
    TableName: "DataSourceStatus",

    ProjectionExpression: "#id",
    //FilterExpression: "#dataSource = :dataSource",
    ExpressionAttributeNames: {
      "#id": "id",
    },
    ExpressionAttributeValues: {},
  };
  if (dataSource) {
    params.FilterExpression = "#dataSource = :dataSource";
    params.ExpressionAttributeNames["#dataSource"] = "dataSource";
    params.ExpressionAttributeValues[":dataSource"] = dataSource;
  }
  if (
    (process.env.hasOwnProperty("DEBUG") && process.env.DEBUG) ||
    process.env.hasOwnProperty("JEST_WORKER_ID")
  ) {
    console.log("PARAMS", params);
  }

  return scanItems(params);
}

function getUserDataSources(userID, allAttributes = false) {
  let params = {
    TableName: "DataSourceStatus",

    ProjectionExpression: "#dataSource",
    ExpressionAttributeNames: {
      "#dataSource": "dataSource",
    },
    ExpressionAttributeValues: {},
  };

  if (allAttributes) {
    params.ProjectionExpression = null;
    params.ExpressionAttributeNames = {};
  }
  params.FilterExpression = "#id = :id";
  params.ExpressionAttributeNames["#id"] = "id";
  params.ExpressionAttributeValues[":id"] = userID;
  console.log("PARAMS", params);

  return scanItems(params);
}

function listS3Objects(s3Bucket, s3Key, maxKeys) {
  let params = {
    Bucket: s3Bucket,
    Prefix: s3Key,
  };
  if (maxKeys !== null) {
    params.maxKeys = maxKeys;
  }
  console.log("PARAMS", params);

  return listObjects(params);
}

function deleteS3Objects(s3Bucket, s3Keys) {
  let params = {
    Bucket: s3Bucket,
    Delete: { Objects: [] },
  };
  s3Keys.forEach(k => {
    params.Delete.Objects.push({ Key: k });
  });

  console.log("PARAMS", params.Delete.Objects[0]);

  return deleteObjects(params);
}

function deleteS3Object(s3Bucket, s3Key) {
  let params = {
    Bucket: s3Bucket,
    Key: s3Key,
  };

  console.log("PARAMS", params);

  return deleteObject(params);
}

function deleteUserApp(appID) {
  let params = {
    TableName: "Apps",
    Key: {
      id: appID,
    },
  };

  console.log("PARAMS", params);

  return deleteItem(params);
  //return getItem(params);
}
function getUserApps(userID) {
  let params = {
    TableName: "Apps",

    ProjectionExpression: "#id",
    ExpressionAttributeNames: {
      "#id": "id",
    },
    ExpressionAttributeValues: {},
  };

  params.FilterExpression = "#prifinaId = :prifinaId";
  params.ExpressionAttributeNames["#prifinaId"] = "prifinaId";
  params.ExpressionAttributeValues[":prifinaId"] = userID;
  console.log("PARAMS", params);

  return scanItems(params);
}

function getUserNotifications(userID, allAttributes = false) {
  let params = {
    TableName: "Notifications",

    ProjectionExpression: "#id",
    //FilterExpression: "#dataSource = :dataSource",
    ExpressionAttributeNames: {
      "#id": "notificationId",
    },
    ExpressionAttributeValues: {},
  };
  if (allAttributes) {
    params.ProjectionExpression = null;
    params.ExpressionAttributeNames = {};
  }
  params.FilterExpression = "#owner = :owner";
  params.ExpressionAttributeNames["#owner"] = "owner";
  params.ExpressionAttributeValues[":owner"] = userID;

  console.log("PARAMS", params);

  return scanItems(params);
}

function deleteUserDataSourceStatus(userID, dataSource) {
  let params = {
    TableName: "DataSourceStatus",
    Key: {
      id: userID,
      dataSource: dataSource,
    },
  };

  console.log("PARAMS", params);

  return deleteItem(params);
  //return getItem(params);
}

function deleteUserNotifications(notificationList) {
  let params = {
    RequestItems: {
      Notifications: [],
    },
  };
  for (let i = 0; i < notificationList.length; i++) {
    params.RequestItems.Notifications.push({
      DeleteRequest: {
        Key: { notificationId: { S: notificationList[i].notificationId } },
      },
    });
  }
  /*
  let params = {
    RequestItems: {
      TABLE_NAME: [
        {
          PutRequest: {
            Item: {
              KEY: { N: "KEY_VALUE" },
              ATTRIBUTE_1: { S: "ATTRIBUTE_1_VALUE" },
              ATTRIBUTE_2: { N: "ATTRIBUTE_2_VALUE" },
            },
          },
        },
        {
          PutRequest: {
            Item: {
              KEY: { N: "KEY_VALUE" },
              ATTRIBUTE_1: { S: "ATTRIBUTE_1_VALUE" },
              ATTRIBUTE_2: { N: "ATTRIBUTE_2_VALUE" },
            },
          },
        },
      ],
    },
  };
*/
  console.log("PARAMS", params.RequestItems.Notifications[0].DeleteRequest);

  //return deleteItem(params);
  //return getItem(params);
  return deleteItems(params);
  //return Promise.resolve("");
}

function deleteUser(userID) {
  let params = {
    TableName: "User",
    Key: {
      id: userID,
    },
  };

  console.log("PARAMS", params);

  return deleteItem(params);
  //return getItem(params);
}

function deletePrifinaUser(userID) {
  let params = {
    TableName: "PrifinaUser",
    Key: {
      id: userID,
    },
  };

  console.log("PARAMS", params);

  return deleteItem(params);
  //return getItem(params);
}

function getAccountID() {
  return stsClient.send(new GetCallerIdentityCommand({}));
}

function getUserSessions() {
  let params = {
    TableName: "PrifinaSessions",

    ProjectionExpression: "#tracker,#tokens",
    //FilterExpression: "#dataSource = :dataSource",
    ExpressionAttributeNames: {
      "#tracker": "tracker",
      "#tokens": "tokens",
    },
  };

  console.log("PARAMS", params);

  return scanItems(params);
}

function deletePrifinaSession(tracker) {
  let params = {
    TableName: "PrifinaSessions",
    Key: {
      tracker: tracker,
    },
  };

  console.log("PARAMS", params);

  return deleteItem(params);
  //return getItem(params);
}

function newTestUser(userID, data) {
  const params = {
    TableName: "PrifinaUser",

    Key: {
      id: userID,
    },
    UpdateExpression: "set ",
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
  };

  Object.keys(data).forEach(d => {
    if (d !== "id") {
      params.UpdateExpression += `#${d} = :${d}, `;
      params.ExpressionAttributeValues[":" + d] = data[d];
      params.ExpressionAttributeNames["#" + d] = d;
    }
  });
  params.UpdateExpression = params.UpdateExpression.slice(0, -2);
  /*
  // Define expressions for the new or updated attributes
  UpdateExpression: "set ATTRIBUTE_NAME_1 = :t, ATTRIBUTE_NAME_2 = :s", // For example, "'set Title = :t, Subtitle = :s'"
  ExpressionAttributeValues: {
    ":t": "NEW_ATTRIBUTE_VALUE_1", // For example ':t' : 'NEW_TITLE'
    ":s": "NEW_ATTRIBUTE_VALUE_2", // For example ':s' : 'NEW_SUBTITLE'
  },
  */
  console.log("PARAMS", params);
  //return Promise.resolve(true);
  return updateItem(params);
}
function addUserNotifications(notificationList) {
  let params = {
    RequestItems: {
      Notifications: [],
    },
  };
  for (let i = 0; i < notificationList.length; i++) {
    let notification = {
      PutRequest: {
        Item: {
          //Key: { notificationId: { S: notificationList[i].notificationId } },
        },
      },
    };
    [
      "notificationId",
      "event",
      "updatedAt",
      "createdAt",
      "owner",
      "body",
      "type",
    ].forEach(dd => {
      notification.PutRequest.Item[dd] = { S: notificationList[i][dd] };
      //console.log("TYPEOF ", typeof notificationList[i][dd], dd);
    });
    ["status"].forEach(dd => {
      //console.log("STATUS ", i, typeof notificationList[i][dd]);
      notification.PutRequest.Item[dd] = {
        //N: "0",
        N: `${notificationList[i][dd]}`,
      };
    });

    params.RequestItems.Notifications.push(notification);
  }
  /*
  {
    "notificationId": {
     "S": "c9a982ffeb851dab8797904a"
    },
    "event": {
     "S": "DATA-SOURCE"
    },
    "updatedAt": {
     "S": "2022-02-23T18:12:43.981Z"
    },
    "status": {
     "N": "0"
    },
    "createdAt": {
     "S": "2022-02-23T18:12:43.981Z"
    },
    "owner": {
     "S": "4ffab59558a21401b6c1e9e560da28e3fd4a"
    },
    "body": {
     "S": "{\"service\":\"oura\",\"action\":\"sleep data processed\"}"
    },
    "type": {
     "S": "OURA-DATA-PROSESSING"
    }
   }
   */

  /*
  {
    PutRequest: {
      Item: {
        KEY: { N: "KEY_VALUE" },
        ATTRIBUTE_1: { S: "ATTRIBUTE_1_VALUE" },
        ATTRIBUTE_2: { N: "ATTRIBUTE_2_VALUE" },
      },
    },
  },
*/
  //console.log("PARAMS", params.RequestItems.Notifications[0].PutRequest);

  /*
  params.RequestItems.Notifications.forEach(n => {
    //  console.log(n);
    //console.log(n.PutRequest.Item);
  });
  */
  //console.log("SIZE ", JSON.stringify(params).length);
  //return Promise.resolve(true);
  return addItems(params);
}

function newUserDataSource(data) {
  const params = {
    TableName: "DataSourceStatus",

    Key: {
      id: data.id,
      dataSource: data.dataSource,
    },
    UpdateExpression: "set ",
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
  };

  Object.keys(data).forEach(d => {
    if (d !== "id" && d !== "dataSource") {
      params.UpdateExpression += `#${d} = :${d}, `;
      params.ExpressionAttributeValues[":" + d] = data[d];
      params.ExpressionAttributeNames["#" + d] = d;
    }
  });
  params.UpdateExpression = params.UpdateExpression.slice(0, -2);
  /*
  // Define expressions for the new or updated attributes
  UpdateExpression: "set ATTRIBUTE_NAME_1 = :t, ATTRIBUTE_NAME_2 = :s", // For example, "'set Title = :t, Subtitle = :s'"
  ExpressionAttributeValues: {
    ":t": "NEW_ATTRIBUTE_VALUE_1", // For example ':t' : 'NEW_TITLE'
    ":s": "NEW_ATTRIBUTE_VALUE_2", // For example ':s' : 'NEW_SUBTITLE'
  },
  */
  console.log("PARAMS", params);
  //return Promise.resolve(true);
  return updateItem(params);
}

// this is not recursive.... <999 objects. Check  NextContinuationToken: ....   params->ContinuationToken: 'STRING_VALUE',
async function getS3Objects(bucket, prefix, maxKeys = null) {
  let keys = [];
  const s3Objects = await listS3Objects(bucket, prefix, maxKeys);
  console.log("S3 CNT", s3Objects.KeyCount);
  if (s3Objects.KeyCount > 1) {
    for (let c = 0; c < s3Objects.Contents.length; c++) {
      const obj = s3Objects.Contents[c];
      if (obj.Size > 0) {
        //console.log("OBJ ", obj.Key);
        keys.push(obj.Key);
      }
    }
  }
  return keys;
}

async function copyS3Objects(objs) {
  // consider splitting array and add delay...
  const promises = objs.map(f => {
    return copyObject(f);
  });

  return await Promise.all(promises);
}
const timeout = ms => new Promise(res => setTimeout(res, ms));
function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

module.exports = {
  timeout,
  getDataSourceUsers,
  deleteUserDataSourceStatus,
  getUserNotifications,
  deleteUserNotifications,
  sliceIntoChunks,
  deleteUser,
  deletePrifinaUser,
  getUserDataSources,
  getAccountID,
  getUserApps,
  listS3Objects,
  deleteS3Objects,
  deleteS3Object,
  deleteUserApp,
  getUserSessions,
  deletePrifinaSession,
  getItem,
  newTestUser,
  addUserNotifications,
  newUserDataSource,
  getS3Objects,
  copyS3Objects,
  cognitoAddUserToGroup,
  cognitoRemoveUserToGroup,
  cognitoListUsersInGroup,
};
