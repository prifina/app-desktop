// /* global localStorage */

import React, { useEffect, useRef, useState } from "react";

import { usePrifina } from "@prifina/hooks-v2";
import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";

import AWSAppSyncClient, { AUTH_TYPE, createAppSyncLink } from "aws-appsync";

import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
const { setContext } = require("apollo-link-context");
//import { graphqlOperation } from "aws-amplify";
import gql from "graphql-tag";
import config from "./config";

import Widget from "./Widget";

const getAthenaResults = `subscription AthenaResults($id: String!) {
  athenaResults(id: $id) {
    data
    appId
    id
  }
}`;


/*
const getHeader = `query getHeader {
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
const getCountryCode = `query getCountryCode {
  getCountryCode
}
`;
const getAddressBook = `query addressBook($id: String!) {
  getUserAddressBook(id: $id) {
    id
    addressBook
  }
}`;
*/

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    Buffer.from(base64, "base64")
      .toString("utf-8")
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const cognitoCredentials = async (idToken, userIdPool) => {

  const token = parseJwt(idToken);
  //const userIdPool = config.cognito.USER_IDENTITY_POOL_ID
  //const provider='cognito-idp.'+userPoolRegion+'.amazonaws.com/'+userPoolId;
  const provider = token["iss"].replace("https://", "");
  let identityParams = {
    IdentityPoolId: userIdPool,
    Logins: {},
  };

  identityParams.Logins[provider] = idToken;
  const cognitoClient = new CognitoIdentityClient({
    region: userIdPool.split(":")[0],
  });
  //console.log(identityParams);
  const cognitoIdentity = await cognitoClient.send(
    new GetIdCommand(identityParams),
  );
  //console.log("COGNITO IDENTITY ", cognitoIdentity);

  let credentialParams = {
    IdentityId: cognitoIdentity.IdentityId,
    Logins: {},
  };

  credentialParams.Logins[provider] = idToken;
  //console.log(credentialParams);
  const cognitoIdentityCredentials = await cognitoClient.send(
    new GetCredentialsForIdentityCommand(credentialParams),
  );
  //console.log("COGNITO IDENTITY CREDS ", cognitoIdentityCredentials);
  const clientCredentials = {
    identityId: cognitoIdentity.IdentityId,
    accessKeyId: cognitoIdentityCredentials.Credentials.AccessKeyId,
    secretAccessKey: cognitoIdentityCredentials.Credentials.SecretKey,
    sessionToken: cognitoIdentityCredentials.Credentials.SessionToken,
    expiration: cognitoIdentityCredentials.Credentials.Expiration,
    authenticated: true,
  };
  return clientCredentials;
};

const createClient = async (endpoint, region, userIdPool, idToken) => {

  const clientCredentials = await cognitoCredentials(idToken, userIdPool);
  const AppSyncConfig = {
    url: endpoint,
    region: region,
    auth: {
      type: AUTH_TYPE.AWS_IAM,
      credentials: clientCredentials,
    },
    disableOffline: true,
  };

  const client = new AWSAppSyncClient(AppSyncConfig, {
    link: new createAppSyncLink({
      ...AppSyncConfig,
      resultsFetcherLink: ApolloLink.from([
        setContext((request, previousContext) => {
          //console.log("APOLLO ", previousContext, request);
          return {
            headers: {
              ...previousContext.headers,
              "prifina-user": idToken,
            },
          };
        }),
        createHttpLink({
          uri: AppSyncConfig.url,
        }),
      ]),
    }),
  });

  return Promise.resolve(client);

};


function App() {
  const {
    stage,
    check,
    getCallbacks,
    registerClient,
    currentUser,
    onUpdate,
  } = usePrifina();

  //console.log("USER ", currentUser);

  //const token = "eyJraWQiOiJRMDE4RDBpdjdqZmZDcGN4a2VLY2h4c0RoZGVBWVI4aW9FY2hpTEN3WGRjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNTMxZjU0MS0yMjU0LTRiNGEtYjQ0YS1mNjQwYzJhMmU2YjciLCJjb2duaXRvOmdyb3VwcyI6WyJERVYiLCJVU0VSIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV93MWZERkNrdFAiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJ0ZXJvLXRlc3RpbmciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0YWhvbGEiLCJnaXZlbl9uYW1lIjoidGVybyIsIm9yaWdpbl9qdGkiOiI1MGNhNDRmYy1hYzcwLTRjMWYtOTVhZi1kOTE3YmFiMzBjMGEiLCJhdWQiOiIxaWNtYTdkZXJsOXNpZmk3dWFhZXRvdXNqYSIsImV2ZW50X2lkIjoiNmZjOTA3OTgtMDVjNy00Yjk2LTg5NTgtNDIwMmY2MTY4NDM3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2Nzg2NDM5OTQsImN1c3RvbTpzdGF0dXMiOiIxIiwiY3VzdG9tOnByaWZpbmEiOiI2MTQ1YjNhZjA3ZmEyMmY2NjQ1NmUyMGVjYTQ5ZTk4YmZlMzUiLCJwaG9uZV9udW1iZXIiOiIrMzU4NDA3MDc3MTAyIiwiZXhwIjoxNjc4NjQ3NTk0LCJpYXQiOjE2Nzg2NDM5OTQsImp0aSI6IjJiNWRhMDRiLWY4MzYtNDg3Yi04N2EwLTEyOTM2YTA5MGRjMSIsImVtYWlsIjoidHJvOTk5OSt0ZXN0M0BnbWFpbC5jb20ifQ.Q0bqAn55MnTs30o7fU_uYTgG9eX9t-0drwxjLJLI5i6oz3vbAZyPjs1RyOiZpj1-pH_oklfl0L7vp8lTr5NCDpO5Ad2kBEBFETDJmjv8JTHFv5LnICYzCZR7QEmXhxW0pTbttuMDEt1nCnLAmCH0EVBS759AuOEEnSyZeAofm26uidLr-eJuWSAONCDfguJp-ddv0xDz4xEjlGdWGgvObYoPiCqJnOT202yr7ujeiAnQca1S9MTXpqsNlGMz5YvkgI0N9ZVkWHtje94EqOjy7mU5JhtkXJBR1kl8nat_Cgkni-vFax848hn7q9Sxs1TLZqLwGOOkFmTpp1ypXhtpEQ";
  //const token = "eyJraWQiOiJRMDE4RDBpdjdqZmZDcGN4a2VLY2h4c0RoZGVBWVI4aW9FY2hpTEN3WGRjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNTMxZjU0MS0yMjU0LTRiNGEtYjQ0YS1mNjQwYzJhMmU2YjciLCJjb2duaXRvOmdyb3VwcyI6WyJERVYiLCJVU0VSIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV93MWZERkNrdFAiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJ0ZXJvLXRlc3RpbmciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0YWhvbGEiLCJnaXZlbl9uYW1lIjoidGVybyIsIm9yaWdpbl9qdGkiOiI1MGNhNDRmYy1hYzcwLTRjMWYtOTVhZi1kOTE3YmFiMzBjMGEiLCJhdWQiOiIxaWNtYTdkZXJsOXNpZmk3dWFhZXRvdXNqYSIsImV2ZW50X2lkIjoiNmZjOTA3OTgtMDVjNy00Yjk2LTg5NTgtNDIwMmY2MTY4NDM3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2Nzg2NDM5OTQsImN1c3RvbTpzdGF0dXMiOiIxIiwiY3VzdG9tOnByaWZpbmEiOiI2MTQ1YjNhZjA3ZmEyMmY2NjQ1NmUyMGVjYTQ5ZTk4YmZlMzUiLCJwaG9uZV9udW1iZXIiOiIrMzU4NDA3MDc3MTAyIiwiZXhwIjoxNjc4NjgzMTI5LCJpYXQiOjE2Nzg2Nzk1MjksImp0aSI6ImM1OTIwNDQ5LWJmOTktNGJiOS1iNjUyLWRkZjc5OTg3NjNmNiIsImVtYWlsIjoidHJvOTk5OSt0ZXN0M0BnbWFpbC5jb20ifQ.VxMLGKkBqaFs_QK7SrmMdt2YhJGhy-E1Mkh_FNo-EJBulixz3vzgTLLh8O23jMzrtyG0E1_PAKIRmMfD9mYghrNC-nOUbEvhmC-K0JQ5zNgWDv6Yq0N7OGlwRxWbd4YFnhlPzPRkTN9urJyDIYNjVDJx8hheDAa0kYj18NGBFq7g-1BPpiw4uJVIgunQK_WSFnnXJDmbaGpY5RbeJUTrstNlKKgcL0V5DQayue4_mVtTa6UIkVhjeoh4rhdTfV7XUEuSPKhC6eucdb3koltOQAYKFL1A7miSzAV_lpCIKlzh2X8lPJrQOSuubflzRfq6EdVsYxrFn65hls7tdyy61g";
  //const token = "eyJraWQiOiJRMDE4RDBpdjdqZmZDcGN4a2VLY2h4c0RoZGVBWVI4aW9FY2hpTEN3WGRjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNTMxZjU0MS0yMjU0LTRiNGEtYjQ0YS1mNjQwYzJhMmU2YjciLCJjb2duaXRvOmdyb3VwcyI6WyJERVYiLCJVU0VSIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV93MWZERkNrdFAiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJ0ZXJvLXRlc3RpbmciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0YWhvbGEiLCJnaXZlbl9uYW1lIjoidGVybyIsIm9yaWdpbl9qdGkiOiI1MGNhNDRmYy1hYzcwLTRjMWYtOTVhZi1kOTE3YmFiMzBjMGEiLCJhdWQiOiIxaWNtYTdkZXJsOXNpZmk3dWFhZXRvdXNqYSIsImV2ZW50X2lkIjoiNmZjOTA3OTgtMDVjNy00Yjk2LTg5NTgtNDIwMmY2MTY4NDM3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2Nzg2NDM5OTQsImN1c3RvbTpzdGF0dXMiOiIxIiwiY3VzdG9tOnByaWZpbmEiOiI2MTQ1YjNhZjA3ZmEyMmY2NjQ1NmUyMGVjYTQ5ZTk4YmZlMzUiLCJwaG9uZV9udW1iZXIiOiIrMzU4NDA3MDc3MTAyIiwiZXhwIjoxNjc4Njg3NzY1LCJpYXQiOjE2Nzg2ODQxNjUsImp0aSI6ImIwYzAxY2Q0LTg1OTQtNDNjMi05MjkzLTg5M2Y4Mzc0ODI3YyIsImVtYWlsIjoidHJvOTk5OSt0ZXN0M0BnbWFpbC5jb20ifQ.LYiODWzxj0qcS3S6gYKZ-3-HELvLRHTCzHJpp1gza78qu4w4OMlgwGpFknSgUU5nfNJGz3H8Rn9IVnm8X-G_L0hhEck_cps1yO2vs8YjouGc9LsLcYaqvBZJ9pg-SFBUWGuOoLNUX9T1mky5a-m89WdKaeHB1M8eV_GVv22q-x0pEpzBJEFs2K3PAUS2cg2Z4IanCG4HptdZit8EoxV1kALu3t0q85yI-lnkjzouUfCs3FsdvgDAjPSTshqu8PSWzlG-AI_IaVl8jj7v42K3pK-321NsN7Lk67g3RhHDcO3tkpPXjlED1O37wPhad1p0ubcNc8MVKEDyvP65btZ0WA";
  const token = "eyJraWQiOiJRMDE4RDBpdjdqZmZDcGN4a2VLY2h4c0RoZGVBWVI4aW9FY2hpTEN3WGRjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNTMxZjU0MS0yMjU0LTRiNGEtYjQ0YS1mNjQwYzJhMmU2YjciLCJjb2duaXRvOmdyb3VwcyI6WyJERVYiLCJVU0VSIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV93MWZERkNrdFAiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJ0ZXJvLXRlc3RpbmciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0YWhvbGEiLCJnaXZlbl9uYW1lIjoidGVybyIsIm9yaWdpbl9qdGkiOiI1MGNhNDRmYy1hYzcwLTRjMWYtOTVhZi1kOTE3YmFiMzBjMGEiLCJhdWQiOiIxaWNtYTdkZXJsOXNpZmk3dWFhZXRvdXNqYSIsImV2ZW50X2lkIjoiNmZjOTA3OTgtMDVjNy00Yjk2LTg5NTgtNDIwMmY2MTY4NDM3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2Nzg2NDM5OTQsImN1c3RvbTpzdGF0dXMiOiIxIiwiY3VzdG9tOnByaWZpbmEiOiI2MTQ1YjNhZjA3ZmEyMmY2NjQ1NmUyMGVjYTQ5ZTk4YmZlMzUiLCJwaG9uZV9udW1iZXIiOiIrMzU4NDA3MDc3MTAyIiwiZXhwIjoxNjc4NjkxNzYwLCJpYXQiOjE2Nzg2ODgxNjAsImp0aSI6IjU1ODhjYzQwLWNkOWEtNDE3OS04NDY5LWM3ODM4NThjYzNlZSIsImVtYWlsIjoidHJvOTk5OSt0ZXN0M0BnbWFpbC5jb20ifQ.b7lWbfWMPUV9RntyjYn7L06xqnMYXW_JYWOuc1pfrPg-_855SW_Obk_lxgIiEqQapesF9ZIIvsjSTqiRnhIoMD6sJOVBiuiz_UIAhTeV8PuaEZSpCD4hoOBu_Nqz6Q2mYbj1pcYkCrkQOfCSdVo5kOdH5nLqEQEEuYupIKcPD2kDfSW8Rc5XsvXRPcEVennAg6RZifmk3kK3oYHhZvSyNFzPbqVpceLnhv-9AIxJIMI7n7_FZO7hwLMcSs_os9x-JxHpTmrHy5iUA7aSA5O1tE_CfN3B6n7NrSuzDiOf9ehJG1u-Ed-1rhpflNtbMJdlR_gG1DZntP3-xBdYoNN0oQ";

  //const prifinaID = "6145b3af07fa22f66456e20eca49e98bfe35";
  const prifinaID = currentUser.uuid;
  //console.log(parseJwt(token));
  const effectCalled = useRef(false);
  const athenaSubscription = useRef(null);
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {

      effectCalled.current = true;
      // prifina endpoint region...
      // prifina identity pool 
      try {
        const CoreApiClient = await createClient(config.appSync.aws_appsync_graphqlEndpoint, config.main_region,
          config.cognito.IDENTITY_POOL_ID, token)

        console.log("CORE ", CoreApiClient);

        const UserApiClient = await createClient(config.appSync.user_graphql_endpoint, config.user_region,
          config.cognito.USER_IDENTITY_POOL_ID, token)

        console.log("USER ", UserApiClient);

        registerClient([UserApiClient, CoreApiClient, {}]);


        athenaSubscription.current = UserApiClient.subscribe({
          query: gql(getAthenaResults),
          variables: { id: prifinaID },
        })
          .subscribe({
            next: res => {
              console.log("ATHENA SUBS RESULTS ", res);

              const currentAppId = res.data.athenaResults.appId;

              const c = getCallbacks();
              console.log("CALLBACKS ", c);

              if (
                c.hasOwnProperty(currentAppId) &&
                typeof c[currentAppId][0] === "function"
              ) {
                console.log("FOUND CALLBACK ");
                c[currentAppId][0]({
                  data: JSON.parse(res.data.athenaResults.data),
                });
              }

            },
            error: error => {
              console.log("ATHENA SUBS ERROR ");

              console.error(error);
              // handle this error ???
              ///message: "Connection failed: com.amazon.coral.service#ExpiredTokenException"
            },
          })


        console.log("SUBS ", athenaSubscription);
        setReady(true);
        /* 
        const uuid = "6145b3af07fa22f66456e20eca49e98bfe35";
        const data = await UserApiClient.query({ query: gql(getAddressBook), variables: { id: uuid } });
        console.log("DATA ", data);
 */
        //unauth
        //getCountryCode",
        /*
        const data = await CoreApiClient.query({ query: gql(getCountryCode),variable:{userId:} });
        console.log("DATA ", data);

        const data2 = await CoreApiClient.query({ query: gql(getHeader) });
        console.log("DATA2 ", data2);
        */
        /*

        GetAddressBook 
          // APPSYNC client Mutation
          mutation(rq, vars) {
            return this.Client.mutate({ mutation: gql(rq), variables: vars });
          }
          // APPSYNC client Query
          query(rq, vars = {}) {
            return this.Client.query({ query: gql(rq), variables: vars });
          }
          */

      } catch (error) {
        ///NotAuthorizedException ... idToken has expired...
        console.error("ERROR :", error);

      }
      /*
      //registerClient([UserApiClient, CoreApiClient, S3Storage]);
      registerClient([UserApiClient, CoreApiClient,{}]);
 
      UserApiClient.setCallback((res) => {
        console.log("ATHENA SUBS RESULTS ", res);
 
        const currentAppId = res.data.athenaResults.appId;
        //console.log("SUBS CHECK ", currentAppId, state,widgetSettings.current);
 
        const c = getCallbacks();
        console.log("CALLBACKS ", c);
 
        if (
          c.hasOwnProperty(currentAppId) &&
          typeof c[currentAppId][0] === "function"
        ) {
          console.log("FOUND CALLBACK ");
          c[currentAppId][0]({
            data: JSON.parse(res.data.athenaResults.data),
          });
        }
      }
      )
      const subsID = UserApiClient.subscribe(getAthenaResults, { id: prifinaID });
      athenaSubscription.current = subsID;
      */
    }
    if (!effectCalled.current) {
      init();
    }
    // unsubscribe...
    if (athenaSubscription.current) {
      console.log("UNSUBS ATHENA ");
      //athenaSubscription.current.unsubscribe();
    }

  }, [])

  return <>
    <div>APP HERE</div>

    {ready && <Widget />}
  </>
}

export default App;
