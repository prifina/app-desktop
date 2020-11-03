import { checkUsername } from "./queries";
import { verifyCode } from "./mutations";

//import Amplify, { Auth, API } from "aws-amplify";

export const verifyCodeMutation = (API, userCode) => {
  return API.graphql({
    query: verifyCode,
    variables: { user_code: userCode },
    authMode: "AMAZON_COGNITO_USER_POOLS",
  });
};

export const checkUsernameQuery = (API, userName) => {
  return API.graphql({
    query: checkUsername,
    variables: { userName: userName },
    authMode: "AWS_IAM",
  });
};
