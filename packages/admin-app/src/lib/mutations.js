export const updateCognitoUser = `mutation updateCognitoUser($userName: String!,$attrName: String!, $attrValue: String!) {
  updateCognitoUser( userName: $userName,attrName: $attrName, attrValue: $attrValue)
}`;

/*
updateCognitoUser(attrName: String!, attrValue: String!): Boolean
changeUserPassword(user_code: String!, password: String!): Boolean
deleteApp(id: String!): Boolean
addUserToCognitoGroup(id: String!, group: String!): Boolean

*/
