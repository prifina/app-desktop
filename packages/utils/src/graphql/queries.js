export const getPrifinaUser = `query prifinaUser($id:String!){
        getPrifinaUser(id: $id) {
          dataSources
          installedApps
          installedWidgets
          appProfile
          id

        }
      }`;

export const getPrifinaWidgets = `query prifinaWidgets {
        getPrifinaApp(id: "WIDGETS") {
          widgets
        }
      }`;

export const getPrifinaApps = `query prifinaApps {
  getPrifinaApp(id: "APPS") {
    apps
  }
}`;

export const getInstalledApps = `query getPrifinaUser($id: String!) {
  getPrifinaUser(id: $id) {
    installedApps
  }
}
`;

export const checkUsername = `query checkUsername($userName: String!) {
  checkUsername(userName: $userName)
}
`;
export const checkCognitoAttribute = `query checkCognitoAttribute($attrName: String!,$attrValue: String!,$poolID: String!) {
  checkCognitoAttribute(attrName: $attrName,attrValue: $attrValue,poolID: $poolID)
}
`;

export const getVerification = `query getVerification($user_code: String!) {
  getVerification(user_code: $user_code) {
    user_code
  }
}
`;

export const getCountryCode = `query getCountryCode {
  getCountryCode
}
`;
export const getHeader = `query getHeader {
  getHeader {
    country
    desktop
    language
    smarttv
    mobile
    tablet
  }
}
`;

export const listNotifications = `query notificationList($filter: TableNotificationFilterInput,$sortDirection:String,$limit:Int,$nextToken:String) {
  listNotifications(filter: $filter,sortDirection:$sortDirection,limit:$limit,nextToken:$nextToken}) {
    items {
      body
      createdAt
      notificationId
      owner
      status
      type
    }
    nextToken
  }
}`;

export const getNotificationCount = `query notificationCount($filter:TableNotificationFilterInput){
  getNotificationCount(filter: $filter)
}`;

export const getAddressBook = `query addressBook($id: String!) {
  getUserAddressBook(id: $id) {
    id
    addressBook
  }
}`;

export const listNotificationsByDate = `query listNotifications($owner: String!,$filter:TableNotificationByDateFilterInput,$sortDirection:String,$limit:Int,$nextToken:String) {
  listNotificationsByDate(owner: $owner, filter: $filter,sortDirection:$sortDirection,limit:$limit,nextToken:$nextToken) {
    items {
      body
      createdAt
      notificationId
      owner
      status
      type
      updatedAt
      sender
    }
  }
}`;

export const listWaiting = `query waitingList($filter:TableWaitingFilterInput,$sortDirection:String,$limit:Int,$nextToken:String) {
  listWaiting(filter: $filter, limit: $limit, nextToken: $nextToken,sortDirection:$sortDirection) {
    items {
      createdAt
      endpoint
      name
      senderKey
    }
    nextToken
  }
}`;

export const getPrifinaSession = `query getSession($tracker: String!) {
  getSession(tracker: $tracker) {
    tokens
    expire
    identityPool
  }
}`;

export const listAppMarket = `query appMarketList($filter:TableAppMarketFilterInput,$sortDirection:String,$limit:Int,$nextToken:String) {
  listAppMarket(filter: $filter, limit: $limit, nextToken: $nextToken,sortDirection:$sortDirection) {
    items {
      id
      name
      title
      modifiedAt
      createdAt
      appType
      version
      manifest
      route
      dataSources
      settings {
        value
        field
        label
        type
      }
    }
    nextToken
  }
}`;

export const listDataSources = `query listDataSources($filter:TableDataSourceFilterInput,$sortDirection:String,$limit:Int,$nextToken:String) {
  listDataSources(filter: $filter, limit: $limit, nextToken: $nextToken,sortDirection:$sortDirection) {
    items {
      module
      sourceType
      name
      route
      description
    }
    nextToken
  }
}`;

export const getLoginUserIdentityPool = `query getLoginUserIdentityPool($username: String!,$poolID: String!) {
  getLoginUserIdentityPool(username: $username,poolID:$poolID)
}
`;

export const listApps = `query appsList($filter:TableAppsFilterInput,$sortDirection:String,$limit:Int,$nextToken:String) {
  listApps(filter: $filter, limit: $limit, nextToken: $nextToken,sortDirection:$sortDirection) {
    items {
      id
      name
      title
      nextVersion
      modifiedAt
      createdAt
      status
      appType
      version
    }
    nextToken
  }
}`;

/*

query MyQuery {
  getCountryCode
}

query MyQuery {
  getVerification(user_code: "55186bcc-4728-4512-aab1-a8f5f8db9b21##email#177143") {
    user_code
  }
}

export const getSchemaTypes = `query listTypesBySchema($schemaId: ID!, $nextToken: String) {
  listTypesBySchema(schemaId: $schemaId, nextToken: $nextToken) {
    items {
      id
      name
      alternateName
      description
      alternateDescription
      type
      lockName
      fields
    }
    nextToken
  }
}
`;

export const getAllDataModels = `query listDataModels($filter:TableDataModelsFilterInput) {
    listDataModels(filter:$filter) {
      items {
        uuid
        name
        description
        creator
        owner
        created
        modified
        status
        versions
        imported
      }
    }
  }
  `;

export const getDataModel = `query getDataModels($uuid: String!) {
    getDataModels(uuid: $uuid) {
        uuid
        name
        description
        creator
        owner
        created
        modified
        status
        major
        minor
        organization
        draftTypes
        versions
        imported
    }
  }
  `;
export const getDraftDataModel = `query getDataModels($uuid: String!) {
    getDataModels(uuid: $uuid) {
        uuid
        draftTypes
    }
  }
  `;
 */
/*
query getDataModels {
  getDataModels(uuid:"unique-id") {
      uuid
      name
      description
      creator
      owner
      created
      modified
      status
      organization
  }
}    
*/
/*
export const getAlbum = `
  query GetAlbum($id: ID!) {
    getAlbum(id: $id) {
      id
      name
      photos {
        items {
          id
          albumId
          bucket
          owner
        }
        nextToken
      }
      owner
    }
  }
`;
*/
/*
const modelfilter={
    "filter":{
      "owner":{"eq":"TERO"}
    }
  }
*/
