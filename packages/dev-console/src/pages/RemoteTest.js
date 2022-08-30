import React, { useRef,useEffect,useState  } from "react";
import {Remote} from "@prifina-apps/remote";
import  { Auth, API as GRAPHQL } from "aws-amplify";
import { PrifinaProvider, PrifinaContext,usePrifina } from "@prifina/hooks-v2";
import {
  useAppContext,
  createClient,
  getPrifinaUserQuery,
  updateUserProfileMutation,
  getAthenaResults,
} from "@prifina-apps/utils";
import gql from "graphql-tag";

const SandboxTest=({appSyncClient,prifinaID,children})=>{

  console.log("NEW SANDBOX ",prifinaID)
  
  const {onUpdate,registerClient,getCallbacks}=usePrifina();

  const athenaSubscription = useRef({});

  const updateTest = data => {
    console.log("UPDATE TEST ", data, Object.keys(data));
    const payload = Object.assign({}, data);

    if (data.hasOwnProperty("connectorFunction")) {
      console.log("QUERY UPDATE ");
    }
   
  };
  useEffect(()=>{
  //onUpdate("sandbox", updateTest);
  registerClient([appSyncClient, GRAPHQL, Storage]);


  athenaSubscription.current = appSyncClient
  .subscribe({ query: gql(getAthenaResults), variables: { id: prifinaID } })
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
      // update({ ERROR: JSON.stringify(error) });
      // handle this error ???
      ///message: "Connection failed: com.amazon.coral.service#ExpiredTokenException"
    },
  });

  return () => {
    // unsubscribe...
    if (athenaSubscription.current) {
      console.log("UNSUBS ATHENA ");
      athenaSubscription.current.unsubscribe();
    }
  };

},[]);

  return <>
  {children}
  </>
}

const RemoteTest = props => {


  const {  currentUser } = useAppContext();
  //console.log("PROVIDER ",PrifinaProvider);
  const remoteRef=useRef();
  const componentProps = useRef({});
  const [ready, setReady] = useState(false);

  useEffect( () => {
   
    async function init() {
    const session = await Auth.currentSession();
    const prifinaID = session.idToken.payload["custom:prifina"];
    const currentPrifinaUser = await getPrifinaUserQuery(GRAPHQL, prifinaID);

    console.log("CURRENT USER ", currentPrifinaUser);
    let appProfile = JSON.parse(
      currentPrifinaUser.data.getPrifinaUser.appProfile,
    );

    let clientEndpoint = "";
    let clientRegion = "";
    if (!appProfile.hasOwnProperty("endpoint")) {
      const defaultProfileUpdate = await updateUserProfileMutation(
        GRAPHQL,
        currentUser.prifinaID,
      );
      console.log("PROFILE UPDATE ", defaultProfileUpdate);
      appProfile = JSON.parse(
        defaultProfileUpdate.data.updateUserProfile.appProfile,
      );
    }
    clientEndpoint = appProfile.endpoint;
    clientRegion = appProfile.region;

    const client = await createClient(clientEndpoint, clientRegion, session);
    componentProps.current.appSyncClient = client;
    componentProps.current.prifinaID = prifinaID;
    componentProps.current.initials = appProfile.initials;

    console.log("COMPONENT PROPS....", componentProps);

      setReady(true);
   }
    init();
  }, []);

  return (
    <>
    
   <PrifinaProvider   activeUser={{ uuid: currentUser.prifinaID }} activeApp={"REMOTE"} stage={"sandbox"} Context={PrifinaContext}>
   {ready &&  
    <SandboxTest {...componentProps.current}>
   
    <Remote ref={remoteRef}
  componentProps={{}}
  system={{
    //remote: "x866fscSq5Ae7bPgUtb6ffB",
    remote:"xxxIM",
    url:"dist/remoteEntry.js",
    //url:"http://internal.prifina.com.s3-website-us-east-1.amazonaws.com/dist/remoteEntry.js",
    //url: "https://cdn.jsdelivr.net/gh/data-modelling/builder-plugins@main/packages/json-view/dist/remoteEntry.js",
    module: "./App",
  }} />

  </SandboxTest>
}
  </PrifinaProvider>
        
    </>
  )
}    


export default RemoteTest