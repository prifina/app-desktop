import { graphqlOperation } from "aws-amplify";
import gql from "graphql-tag";
import { Amplify, API, Auth, Storage } from "aws-amplify";

//AppSync and Apollo libraries
import AWSAppSyncClient, { AUTH_TYPE, createAppSyncLink } from "aws-appsync";

/*
 https://aws-amplify.github.io/amplify-js/api/classes/authclass.html

changePassword
completeNewPassword
configure
confirmSignIn
confirmSignUp
currentAuthenticatedUser
currentCredentials
currentSession
currentUserCredentials
currentUserInfo
currentUserPoolUser
deleteUser
deleteUserAttributes
disableSMS
enableSMS
essentialCredentials
federatedSignIn
fetchDevices
forgetDevice
forgotPassword
forgotPasswordSubmit
getMFAOptions
getModuleName
getPreferredMFA
rememberDevice
resendSignUp
sendCustomChallengeAnswer
setPreferredMFA
setupTOTP
signIn
signOut
signUp
updateUserAttributes
userAttributes
userSession
verifiedContact
verifyCurrentUserAttribute
verifyCurrentUserAttributeSubmit
verifyTotpToken
verifyUserAttribute
verifyUserAttributeSubmit
wrapRefreshSessionCallback
*/

import config from "../config";
/*
const qlMockups = {
  query: { ...coreMockups.query },
  mutation: { ...coreMockups.mutation }
}

const appsyncMockups = {
  query: { ...userMockups.query },
  mutation: { ...userMockups.mutation }
}
*/

const shortId = () => {
  // this is unique enough...
  return Math.random().toString(36).slice(-10);
}

//Auth.configure(AUTHConfig);
//API.configure(APIConfig);

// Auth Client...
class AUTHClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;
    this.Client = Auth;
    this.AuthConfig = cnf?.AuthConfig || {}
    this.Client.configure(this.AuthConfig);
    this.Options = cnf?.Options || {}
    this.Authenticated = undefined;
  }

  AUTHConfigure(cnf) {
    this.AuthConfig = { ...this.AuthConfig, ...cnf };
    this.Client.configure(this.AuthConfig);
    return this.AuthConfig;
  }
  setAuthenticated(status) {
    this.Authenticated = status;
  }
  getAuthenticated() {
    return this.Authenticated;
  }
  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  signOut() {
    return this.Client.signOut();
  }
  signUp(user) {
    return this.Client.signUp(user);
  }
  signIn(uname, passwd) {
    return this.Client.signIn(uname, passwd);
  }

  sendCustomChallengeAnswer(user, answer) {
    return this.Client.sendCustomChallengeAnswer(user, answer);
  }
  setPreferredMFA(user, mfaMethod) {
    //mfaMethod: "TOTP" | "SMS" | "NOMFA" | "SMS_MFA" | "SOFTWARE_TOKEN_MFA"
    return this.Client.setPreferredMFA(user, mfaMethod);
  }

  currentCredentials() {
    return this.Client.currentCredentials();
  }

  currentSession() {
    return this.Client.currentSession();
  }

  confirmSignIn(user, code, mfaMethod = "SMS_MFA") {
    return this.Client.confirmSignIn(
      user,
      code,
      mfaMethod
    );
  }

  currentAuthenticatedUser() {
    return this.Client.currentAuthenticatedUser();
  }

  changePassword(user, oldPwd, newPwd) {
    return this.Client.changePassword(
      user,
      oldPwd,
      newPwd
    );
  }

}

const CreateClient = () => {
  return Auth.currentSession();
  /*
  export const getClient = async () => {
    return new AWSAppSyncClient({
      url: API_URL,
      region: process.env.aws_s3_region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },
      complexObjectsCredentials: () => Auth.currentCredentials(),
      disableOffline: true,
    })
  }
  */
}

// AppSync ...
class xAppSyncClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;

    this.config = cnf?.AppSyncConfig || {}
    console.log("AppSyncClient ", this.config);
    /*
    const appSync = {
      ...this.config,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        // Get the currently logged in users credential.
        jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
      },
      // Amplify uses Amazon IAM to authorize calls to Amazon S3. This provides the relevant IAM credentials.
      complexObjectsCredentials: () => Auth.currentCredentials(),
      disableOffline: true,
    }
    console.log("AppSyncClient ", appSync);
    CreateClient().then(client => {
      console.log("Create Client ", client);
    });
    */
    /*
    // AppSync client instantiation
    this.Client = new AWSAppSyncClient({
      ...this.config,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        // Get the currently logged in users credential.
        jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
      },
      // Amplify uses Amazon IAM to authorize calls to Amazon S3. This provides the relevant IAM credentials.
      complexObjectsCredentials: () => Auth.currentCredentials()
    });
    */
    // AppSync client instantiation
    this.Client = undefined;


    this.Options = cnf?.Options || {}
    this.subscriptions = {};
    this.callback = undefined;
  }

  AppSyncConfigure(cnf) {
    this.config = { ...this.config, ...cnf };
    // this changes Amplify graphQL client config.... 
    //Amplify.configure(this.config);
    return this.config;
  }
  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  setCallback(fn) {
    this.callback = fn;
  }
  // APPSYNC client Mutation
  mutation(rq, vars) {
    return this.Client.mutate({ mutation: gql(rq), variables: vars });
  }
  // APPSYNC client Query
  query(rq, vars = {}) {
    return this.Client.query({ query: gql(rq), variables: vars });
  }
  unsubscribe(subscriptionID) {
    // Stop receiving data updates from the subscription
    this.subscriptions[subscriptionID].unsubscribe();
  }
  subscribe(rq, vars) {

    const subscriptionID = shortId();
    const subscription = this.Client.subscribe({ query: gql(rq), variables: vars }).subscribe({
      next: res => this.callback(res),
      error: error => {
        console.error(error);
        // update({ ERROR: JSON.stringify(error) });
        // handle this error ???
        ///message: "Connection failed: com.amazon.coral.service#ExpiredTokenException"
      }
    });

    this.subscriptions[subscriptionID] = subscription;
    return subscriptionID;
  }
}


// AppSync ...
class AppSyncClient {
  constructor(cnf) {
    // this.config = cnf || AppSyncConfig;
    //  this.Authconfig = AUTHConfig;

    this.config = cnf?.AppSyncConfig || {}
    console.log("AppSyncClient ", this.config);

    this.Client = API;

    this.Client.configure(this.config);
    this.Options = cnf?.Options || {}
    this.subscriptions = {};
    this.callback = undefined;
  }

  AppSyncConfigure(cnf) {
    this.config = { ...this.config, ...cnf };
    // this changes Amplify graphQL client config.... 
    //Amplify.configure(this.config);
    //identityPoolRegion: 'XX-XXXX-X',
    //graphql_endpoint_iam_region: 'us-east-1' 
    this.config.aws_appsync_authenticationType = AUTH_TYPE.AWS_IAM;
    this.config.API = {
      graphql_headers: async () => ({
        'prifina-user': (await Auth.currentSession()).getIdToken().getJwtToken()
      })
    }
    /*
    this.config.API.graphql_headers = async () => ({
      'My-Custom-Header': 'my value' // Set Custom Request Headers for non-AppSync GraphQL APIs
    })
    */
    /*
    {
      jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken(),
    }
    */
    /*
    API: {
      graphql_endpoint: 'https:/www.example.com/my-graphql-endpoint',
      graphql_headers: async () => ({
        'My-Custom-Header': 'my value' // Set Custom Request Headers for non-AppSync GraphQL APIs
      })
    }
    */
    this.Client.configure(this.config);
    return this.config;
  }
  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  setCallback(fn) {
    this.callback = fn;
  }

  unsubscribe(subscriptionID) {
    // Stop receiving data updates from the subscription
    this.subscriptions[subscriptionID].unsubscribe();
  }

  subscribe(rq, vars) {
    console.log("USER graphql subscription ", rq);
    const subscriptionID = shortId();
    // this.Client.configure(this.config);
    console.log("USER APPSYNC CONFIG ", this.config);
    this.Client.configure(this.config);
    console.log("USER APPSYNC CLIENT ", this.Client);
    let subscription = undefined;
    if (vars === undefined && rq?.query !== undefined && rq?.variables !== undefined) {
      //return this.Client.graphql({ query: rq.query, variables: rq.variables });
      console.log("USER SUBS OK ");
      return this.Client.graphql({ query: rq.query, variables: rq.variables });
    } else {
      subscription = this.Client.graphql({ query: rq, variables: vars }).subscribe({
        next: ({ provider, value }) => { this.callback(provider, value) },
        error: error => {
          console.error(error);
          // do we need to throw exception here ???
        }
      });
    }
    /*
    const subscription = this.Client.graphql(graphqlOperation(rq, vars)).subscribe({
      next: ({ provider, value }) => { this.callback(provider, value) },
      error: error => {
        console.error(error);
        // do we need to throw exception here ???
      }
    });
    */

    this.subscriptions[subscriptionID] = subscription;

    return subscriptionID;
  }



  /*
  graphql(
    query = undefined,
    variables = {},
    authMode = "AWS_IAM",
  ) {
    console.log("CORE graphql ", query);
    console.log("CORE graphql ", this.Client);
    return this.Client.graphql({ query, variables, authMode });
  }
  */

  // APPSYNC client Mutation from provider..
  mutate(rq, vars) {
    //graphqlOperation(queries.getTodo, { id: 'some id' })
    console.log("USER graphql mutation ", rq);
    this.Client.configure(this.config);
    return this.Client.graphql({ query: rq.mutation, variables: rq.variables });

  }
  // APPSYNC client Mutation
  mutation(rq, vars) {
    //graphqlOperation(queries.getTodo, { id: 'some id' })
    console.log("USER graphql mutation2 ", rq);
    this.Client.configure(this.config);
    if (vars === undefined && rq?.query !== undefined && rq?.variables !== undefined && rq.variables.input !== undefined) {
      return this.Client.graphql({ query: rq.query, variables: rq.variables });
    }
    return this.Client.graphql({ query: rq, variables: vars });
    //return this.Client.graphql(graphqlOperation(rq, vars));
    //return this.Client.mutate({ mutation: gql(rq), variables: vars });
  }
  // APPSYNC client Query
  query(rq, vars) {
    console.log("USER graphql query ", rq);
    console.log("USER graphql query config ", this.config);
    this.Client.configure(this.config);

    if (vars === undefined && rq?.query !== undefined && rq?.variables !== undefined && rq.variables.input !== undefined) {
      //console.log("PROVIDER QUERY ", rq.variables);

      return this.Client.graphql({ query: rq.query, variables: rq.variables });
    }

    return this.Client.graphql({ query: rq, variables: vars });
    //return this.Client.graphql(graphqlOperation(rq, vars));

    //return this.Client.graphql({ query, variables, authMode });
    // return this.Client.query({ query: gql(rq), variables: vars });

    /*
        if (vars === undefined && rq?.query !== undefined && rq?.variables !== undefined && rq.variables.input !== undefined) {
          console.log("PROVIDER QUERY ", rq.variables);
          //console.log("SANDBOX ", SANDBOX)
          return getSandboxData(rq.variables, this.callback);
        }
        console.log("APPSYNC QUERY ", gql(rq));
        const ql = gql(rq);
        //console.log(ql.definitions[0].name)
        //console.log(ql.definitions[0])
        //console.log(JSON.stringify(ql.definitions[0].selectionSet.selections[0]))
        // const test = await appSyncClient.query({
        //   query: gql(getCognitoUserDetails),
        //   variables: {},
        // });
        //return Promise.resolve(true);
    
        return Promise.resolve(appsyncMockups["query"][ql.definitions[0].name.value](vars, this.Options));
    */
  }

}

// Amplify GRAPHQL Client API ... Authmodes  AMAZON_COGNITO_USER_POOLS | AWS_IAM
class CoreGraphQLApi {
  constructor(cnf) {

    this.Client = API;
    this.config = cnf?.config || {}
    this.Client.configure(this.config);
    this.Options = cnf?.Options || {}
    this.subscriptions = {};
    this.callback = undefined;
    this.timers = {};
  }
  configure(apiConfig) {
    this.config = { ...this.config, ...apiConfig };
    this.Client.configure(this.config);
    return this.config;
  }

  setOption(opt) {
    this.Options = { ...this.Options, ...opt };
  }
  setCallback(fn) {
    this.callback = fn;
  }

  unsubscribe(subscriptionID) {
    // Stop receiving data updates from the subscription
    this.subscriptions[subscriptionID].unsubscribe();
  }

  subscribe(rq, vars) {

    const subscriptionID = shortId();
    console.log("CORE CONFIG ", this.config);
    this.Client.configure(this.config);
    console.log("CORE CLIENT ", this.Client);
    const subscription = this.Client.graphql(graphqlOperation(rq, vars)).subscribe({
      next: ({ provider, value }) => { this.callback(provider, value) },
      error: error => {
        console.error(error);
        // Connection failed: {"errors":[{"errorType":"Unauthorized","message":"Not Authorized to access newSystemNotification on type Subscription"}]}
        // do we need to throw exception here ???
      }
    });

    this.subscriptions[subscriptionID] = subscription;

    return subscriptionID;
  }
  graphql(
    query = undefined,
    variables = {},
    authMode = "AMAZON_COGNITO_USER_POOLS",
  ) {
    console.log("CORE graphql ", query);
    this.Client.configure(this.config);
    console.log("CORE graphql ", this.Client);

    return this.Client.graphql({ query, variables, authMode });
  }
};


class S3Storage {
  constructor(cnf) {
    this.Client = Storage;
    this.config = cnf?.S3Config || {}

    this.Client.configure(this.config);

    this.Options = cnf?.Options || {}
    this.callback = undefined;
  }
  configure(cnf) {
    this.config = { ...this.config, ...cnf };
    this.Client.configure(this.config);
    return this.config;
  }
  get(s3Key, config = {}) {
    return Storage.get(s3Key, config);

  }
  put(s3Key, fileHandler, config) {

    if (typeof fileHandler === "string") {
      return Storage.put(s3Key, fileHandler, config);
    } else {
      // Note, Storage is not handling multipart uploads.... 
      console.log("Upload Size", fileHandler.size);
      const maxPartSize = 5 * 1024 * 1024;
      if (fileHandler.size > maxPartSize) {
        // first create s3Client... 

        /*
        const createParams = {
          Bucket: `prifina-data-${config.prifinaAccountId}-${config.main_region}`,
          Key: "public/" + s3Key,
          Body: file,
        };

        const parallelUploads3 = new Upload({
          client: s3UploadClient,
          params: createParams,

          tags: [
            // doesn't work, something about bucket owner
            // { Key: "created", Value: new Date().toISOString() },
            // { Key: "alt-name", Value: file.name },
           
          ], // optional tags
          queueSize: 4, // optional concurrency configuration
          partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
          leavePartsOnError: false, // optional manually handle dropped parts
          // didn't work...
          // metadata: {
          //   created: new Date().toISOString(),
          //   "alt-name": file.name,
          // },
        });

        parallelUploads3.on("httpUploadProgress", progress => {
          console.log(progress);
          //setUploaded(`Progress: ${progress.loaded}/${progress.total}`);
          setUploaded(
            `Progress: ${Math.floor(
              (progress.loaded / progress.total) * 100,
            )}%`,
          );
        });

        const uploadResult = await parallelUploads3.done();
        console.log("UPLOAD RESULT ", uploadResult);
        // update metadata as it was not included with multipartupload
        s3UploadClient.send(
          new CopyObjectCommand({
            Metadata: {
              created: new Date().toISOString(),
              "alt-name": file.name,
            },
            MetadataDirective: "REPLACE",
            Bucket: uploadResult.Bucket,
            CopySource: "/" + uploadResult.Bucket + "/" + uploadResult.Key,
            Key: uploadResult.Key,
          }),
        );

        */
      } else {
        return Storage.put(s3Key, fileHandler, config);
      }


    }


    Storage.put("test.txt", "File content", {
      progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
      },
    });

    /*
    const s3Status = await S3Storage.put(s3Key, file, {
      level: "public", // private doesn't work

      metadata: {
        created: new Date().toISOString(),
        "alt-name": file.name,
      },

      progressCallback(progress) {
        const loaded = `${Math.floor(100 * progress.loaded / progress.total)}%`;
        updateUploaded(loaded);
        uploaded.current = loaded;

      },
      customPrefix: {
        //public: "uploads/",
        // private: "apps/",
      },
    });
    */

    console.log("FILE ", fileHandler.name, fileHandler.size, options)
    const totalSize = fileHandler.size;

    const reader = new FileReader();

    reader.readAsDataURL(fileHandler);

    reader.addEventListener('load', () => {
      //localStorage.setItem('thumbnail', reader.result);
      localStorage.setItem("_mockPrifinaS3_" + s3Key, JSON.stringify({ url: reader.result, key: s3Key, ...options }));
    });

    //options.progressCallback({ loaded: totalSize, total: totalSize });
    /*
        {
          "level": "public",
          "metadata": {
              "created": "2023-02-16T05:22:25.590Z",
              "alt-name": "project_openai_codex-main.zip"
          },
          "customPrefix": {
              "public": "uploads/"
          }
      }
      
      */
    return new Promise((resolve, reject) => {

      if (options?.progressCallback !== undefined) {
        //console.log("PROGRESS OPTION")
        let splitCnt = 0;
        let loaded = 0;
        (async function () {
          do {
            loaded = Math.floor(totalSize * (splitCnt * 20 / 100));
            if (loaded > totalSize) {
              loaded = totalSize;
            }
            splitCnt++;
            //console.log("PROGRESS OPTION ", loaded, totalSize)
            options.progressCallback({ loaded: loaded, total: totalSize })
            await timeout(500)
          } while (loaded < totalSize);

          resolve({
            ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
            ServerSideEncryption: "AES256",
            VersionId: "CG612hodqujkf8FaaNfp8U..FIhLROcp"
          })

        })()

      }
      /*
            resolve({
              ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
              ServerSideEncryption: "AES256",
              VersionId: "CG612hodqujkf8FaaNfp8U..FIhLROcp"
            })
            */

    });

  }
}
export { AUTHClient, CoreGraphQLApi, AppSyncClient, S3Storage };