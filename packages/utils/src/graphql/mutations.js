export const verifyCode = `mutation verifyCode($user_code: String!) {
    verifyCode(user_code: $user_code) {
        user_code
    }
  }
  `;
export const sendVerification = `mutation sendVerification($subject: String!,$message:String!) {
    sendVerification(subject: $subject,message: $message)
  }
  `;

export const addSearchResult = `mutation searchResult($input:SearchResultInput) {
  addSearchResult(input: $input)
}`;

export const addSearchKey = `mutation searchKey($input:SearchKeyInput) {
  addSearchKey(input: $input)
}`;

export const createNotification = `mutation newNotification($input: NotificationInput!) {
  createNotification(input: $input) {
    body
    createdAt
    notificationId
    owner
    status
    type
  }
}`;

export const addNotification = `mutation addNotification($input: NotificationInput!) {
  addNotification(input: $input) {
    notificationId
    owner
  }
}`;

export const updateNotificationStatus = `mutation updateStatus($notificationId: String!,$status:Int!) {
  updateNotificationStatus(notificationId: $notificationId, status: $status) {
    body
    createdAt
    notificationId
    owner
    status
    type
    updatedAt
  }
}`;

export const updateActivity = `mutation updateUserActivity($id: String!,$activeApp: String!) {
 
  updateActivity( id: $id,activeApp: $activeApp)
}`;

export const addWaiting = `mutation newWaiting($input: WaitingInput) {
  waiting(input: $input) {
    createdAt
    endpoint
    region
    name
    senderKey
  }
}`;

export const installWidget = `mutation addInstalledWidget($id:String!,$widget:WidgetInput) {
  addInstalledWidgets(id: $id, widget: $widget) {
    id
    installedWidgets
  }
}`;

export const addPrifinaSession = `mutation addSession($input:SessionInput) {
  addSession(input: $input)
}`;

export const updateUserProfile = `mutation updateUserProfile($id:String!, $profile:AWSJSON) {
  updateUserProfile(id:$id,profile:$profile) {
    appProfile
    id
  }
}`;

export const deletePrifinaSession = `mutation deleteSession($tracker: String!) {
  deleteSession(tracker: $tracker) 
}`;

export const deleteAppVersion = `mutation deleteApp($id: String!) {
  deleteApp(id: $id) 
}`;

export const newAppVersion = `mutation newAppVersion($id:String!, $prifinaId:String!,$name:String,$title:String, $version:String,$appType:Int!,$identity:String,$identityPool:String) {
  newAppVersion(id:$id,prifinaId:$prifinaId,name:$name,title:$title,version:$version,appType:$appType,identity:$identity,identityPool:$identityPool) {
    appType
    id
    identity
    identityPool
    name
    prifinaId
  }
}`;

export const updateAppVersion = `mutation updateAppVersion($input:AppVersionInput) {
  updateAppVersion(input: $input) {
    appType
    id
    name
    version
    nextVersion  
  }
}`;

export const addSystemNotification = `mutation addSystemNotification($input: NotificationInput!) {
  addSystemNotification(input: $input) {
    notificationId
    owner
  }
}`;

export const createSystemNotification = `mutation newSystemNotification($input: NotificationInput!) {
  createSystemNotification(input: $input) {
    body
    createdAt
    notificationId
    owner
    status
    type
  }
}`;

export const updateSystemNotificationStatus = `mutation updateSystemNotificationStatus($notificationId: String!,$status:Int!) {
  updateSystemNotificationStatus(notificationId: $notificationId, status: $status) {
    body
    createdAt
    notificationId
    owner
    status
    type
    updatedAt
  }
}`;

export const updateUserActivity = `mutation updateUserActivity($id: String!,$activeApp: String!) {
 
  updateUserActivity( id: $id,activeApp: $activeApp)
}`;

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

export const addUserToCognitoGroup = `mutation addUserToCognitoGroup($id: String!,$group: String!) {
 
  addUserToCognitoGroup( id: $id,group: $group)
}`;

export const changeUserPassword = `mutation changeUserCognitoPassword($code: String!,$pass: String!) {
 
  changeUserPassword( user_code: $code,password: $pass)
}`;

export const updateCognitoUser = `mutation updateCognitoUser($attrName: String!, $attrValue: String!) {
  
  updateCognitoUser( attrName: $attrName, attrValue: $attrValue)
}`;
