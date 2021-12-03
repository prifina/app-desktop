/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React, { useRef, useState, useEffect } from "react";

import Amplify, { Auth, API as GRAPHQL, Storage } from "aws-amplify";
import config from "../config";

import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync";

import { getPrifinaUserQuery } from "../graphql/api";

//import { default as DefaultApp } from "../pages/AppMarket";

import { useFormFields } from "../lib/formFields";

import gql from "graphql-tag";

const APIConfig = {
  aws_appsync_graphqlEndpoint: config.appSync.aws_appsync_graphqlEndpoint,
  aws_appsync_region: config.main_region,
  aws_appsync_authenticationType: config.appSync.aws_appsync_authenticationType,
};

const AUTHConfig = {
  // To get the aws credentials, you need to configure
  // the Auth module with your Cognito Federated Identity Pool
  mandatorySignIn: false,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  region: config.main_region,
};

const S3Config = {
  AWSS3: {
    bucket: config.S3.bucket, //REQUIRED -  Amazon S3 bucket name
    region: config.S3.region, //OPTIONAL -  Amazon service region
  },
};

const s3Notification = `subscription Notification($id:String!) {
  s3Results(id: $id) {
   data
   id
  }
}`;

export default { title: "Emails" };

export const emailsApp = props => {
  console.log("COMPONENT ---> ", props);
  console.log("CONFIG ", config);
  const [settingsReady, setSettingsReady] = useState(false);
  const clientHandler = useRef(null);

  const prifinaID = useRef("");
  const s3Results = useRef(null);
  const [login, setLogin] = useState(true);
  const [images, setImages] = useState([]);

  const [loginFields, handleChange] = useFormFields({
    username: "",
    password: "",
  });

  Auth.configure(AUTHConfig);
  Amplify.configure(APIConfig);
  Amplify.configure(S3Config);
  console.log("AUTH CONFIG ", AUTHConfig);

  Storage.configure({
    customPrefix: {
      public: "emails/public/",
      protected: "emails/protected/",
      private: "emails/private/",
    },
  });
  console.log(Storage);

  const createClient = (endpoint, region) => {
    const client = new AWSAppSyncClient({
      url: endpoint,
      region: region,
      auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: () => Auth.currentCredentials(),
      },

      disableOffline: true,
    });
    return client;
  };

  // get user auth...
  useEffect(async () => {
    try {
      if (login) {
        const session = await Auth.currentSession();

        console.log("SESSION ", session);
        if (!session) {
          console.log("NO CURRENT SESSION FOUND");
        }
        console.log("PRIFINA-ID", session.idToken.payload["custom:prifina"]);
        prifinaID.current = session.idToken.payload["custom:prifina"];

        const cred = await Auth.currentCredentials();

        console.log("Identity Id", cred);

        const currentPrifinaUser = await getPrifinaUserQuery(
          GRAPHQL,
          prifinaID.current,
        );

        console.log("CURRENT USER ", currentPrifinaUser);

        const appProfile = JSON.parse(
          currentPrifinaUser.data.getPrifinaUser.appProfile,
        );
        console.log("CURRENT USER ", appProfile, appProfile.initials);

        let clientEndpoint =
          "https://kxsr2w4zxbb5vi5p7nbeyfzuee.appsync-api.us-east-1.amazonaws.com/graphql";
        let clientRegion = "us-east-1";
        if (appProfile.hasOwnProperty("endpoint")) {
          clientEndpoint = appProfile.endpoint;
          clientRegion = appProfile.region;
        }

        clientHandler.current = createClient(clientEndpoint, clientRegion);

        setSettingsReady(true);
      }
    } catch (e) {
      if (typeof e === "string" && e === "No current user") {
        setLogin(false);
        //const user = await Auth.signIn("tahola", "xxxx");
        //console.log("AUTH ", user);
        //console.log("APP DEBUG ", appCode);
      }

      console.log("AUTH ", e);
    }
  }, [login]);

  useEffect(() => {
    if (prifinaID.current !== "") {
      s3Results.current = GRAPHQL.graphql({
        query: s3Notification,
        variables: { id: prifinaID.current },
        authMode: "AWS_IAM",
      }).subscribe({
        next: data => {
          console.log("SUB DATA ", data);
          //console.log(JSON.parse(data.value.data.s3Results.data));
          const { s3 } = JSON.parse(data.value.data.s3Results.data);
          console.log("S3 NOTIFICATION ", s3);
          const fname = s3.key.split("/").pop();
          let file = "";
          if (s3.key.indexOf("attachments") > -1) {
            file = prifinaID.current + "/attachments/" + fname;

            if (s3.size > 0) {
              console.log("GET IMAGE ", file);
              Storage.get(file, { level: "private" }).then(url => {
                console.log("IMAGE URL ", url);
                const image = (
                  <div key={fname} style={{ width: "200px", margin: "10px" }}>
                    <img src={url} style={{ width: "100%" }} />
                  </div>
                );
                //setImages([...images, image]);
                setImages(oldArray => [...oldArray, image]);
              });
            }
          }
        },
        error: err => {
          console.log("SUB ERROR ", err);
        },
      });
      console.log("SUBSCRIBE ", s3Results.current);

      Storage.list(prifinaID.current + "/attachments", { level: "private" })
        .then(result => {
          console.log(result);
          if (result.length > 0) {
            let existingImages = [];
            result.forEach(i => {
              if (i.size > 0)
                existingImages.push(Storage.get(i.key, { level: "private" }));
            });

            Promise.all(existingImages).then(imageUrls => {
              const imageObjects = imageUrls.map((image, i) => {
                console.log("IMAGE ", image);

                return (
                  <div
                    key={"image-" + i}
                    style={{ width: "200px", margin: "10px" }}
                  >
                    <img src={image} style={{ width: "100%" }} />
                  </div>
                );
              });
              setImages(imageObjects);
            });
          }
        })
        .catch(err => console.log(err));
    }
    return () => {
      // unsubscribe...
      console.log("RETURN ", s3Results.current);
      if (s3Results.current) s3Results.current.unsubscribe();
    };
  }, [prifinaID.current]);

  return (
    <>
      {!login && (
        <div>
          <div>
            Username:
            <input id={"username"} name={"username"} onChange={handleChange} />
          </div>
          <div>
            Password:
            <input id={"password"} name={"password"} onChange={handleChange} />
          </div>
          <div>
            <button
              onClick={e => {
                //console.log(loginFields);
                Auth.signIn(loginFields.username, loginFields.password).then(
                  () => {
                    setLogin(true);
                  },
                );
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
      {login && settingsReady && (
        <>
          <div style={{ display: "flex", marginTop: "20px" }}>{images}</div>
        </>
      )}
      {!settingsReady && <div />}
    </>
  );
};

emailsApp.story = {
  name: "Emails App",
};

emailsApp.story = {
  name: "Emails",
  /*
  decorators: [
    Story => {
      //console.log("PROVIDER ", PrifinaProvider);
      return (
        <PrifinaProvider
          stage={"alpha"}
          Context={PrifinaContext}
          activeUser={{
            name: "Active user tero",
            uuid: "13625638c207ed2fcd5a7b7cfb2364a04661",
          }}
        >
          <Story />
        </PrifinaProvider>
      );
    },
  ],
  */
};
