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

export const addAppVersion = `mutation addAppVersion($input:AppVersionInput) {
  addAppVersion(input: $input) {
    appType
    id
    name
    version
    nextVersion  
  }
}`;
