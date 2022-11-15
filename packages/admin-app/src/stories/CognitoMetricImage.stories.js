import React, { useEffect, useRef, useState } from "react";


import { GraphQLContext } from "../lib/GraphQLContext";

import { GraphQLClient, API } from "../lib/Client";

import { PrifinaStoreProvider, useStore } from "../stores/PrifinaStore";

import shallow from "zustand/shallow";
import Card from "../lib/CognitoMetricImageCard";

// here can select mockup client instead.... :)
const PrifinaClient = new GraphQLClient();



const Wrapper = () => {
  //console.log("WRAPPER ", updateArgs);
  const { getCognitoMetricImage } = useStore(
    state => ({
      getCognitoMetricImage: state.getCognitoMetricImage,
    }),
    shallow,
  );
  //updateArgs({ "userCount": 8 })
  const [cardProps, setCardProps] = useState({});
  const effectCalled = useRef(false);

  useEffect(() => {
    async function getImage() {
      console.log("GET IMAGE ");

      effectCalled.current = true;
      const image = await getCognitoMetricImage();
      setCardProps({ cognitoMetricImage: image });
    }
    if (!effectCalled.current) {
      getImage();
    }

  }, [])


  return <>
    {Object.keys(cardProps).length > 0 && <Card {...cardProps} />}
    {Object.keys(cardProps).length === 0 && null}
  </>
}

export default {
  title: "Components Dashboard/SB",
  component: Wrapper,
  args: {}

  // argTypes: {
  //   navigate: { action: "navigation action" },
  // },
  //excludeStories: ["Template",'PlayTest',"VersionPlayTest"]
};
const Template = args => <Wrapper {...args} />



export const DashboardCognitoMetricImageSB = Template.bind({});

DashboardCognitoMetricImageSB.storyName = "CognitoMetricImage";


const envDecorator = (story, ctx) => {
  //const [_, updateArgs] = useArgs();

  // console.log(useArgs());
  // console.log("DECO ", updateArgs);
  return <GraphQLContext.Provider value={{ client: PrifinaClient, GRAPHQL: API }}>
    <PrifinaStoreProvider>
      {story()}
    </PrifinaStoreProvider>
  </GraphQLContext.Provider>
}



DashboardCognitoMetricImageSB.decorators = [envDecorator]
