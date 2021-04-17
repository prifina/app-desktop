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
