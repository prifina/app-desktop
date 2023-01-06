export const newNotification = `subscription UserNotification($owner:String!) {
    newNotification(owner: $owner) {
      notificationId
      owner
    }
  }`;

export const newWaiting = `subscription addWaiting($key:String!) {
  Messaging(key: $key) {
    createdAt
    endpoint
    name
    senderKey
  }
}`;

export const newSystemNotification = `subscription systemNotification($owner:String!) {
  newSystemNotification(owner: $owner) {
    notificationId
    owner
  }
}`;

export const newConnectNotification = `subscription connectStatusNotification($id:String!) {
  connectStatusNotification(id: $id) {
    data
    id
  }
}`;

export const getAthenaResults = `subscription AthenaResults($id: String!) {
  athenaResults(id: $id) {
    data
    appId
    id
  }
}`;
