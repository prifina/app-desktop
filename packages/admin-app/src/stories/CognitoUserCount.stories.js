import React, { useEffect, useRef, useState } from "react";


import { GraphQLContext } from "../lib/GraphQLContext";

import { GraphQLClient, API } from "../lib/Client";

import { PrifinaStoreProvider, useStore } from "../stores/PrifinaStore";

import shallow from "zustand/shallow";


import Card from "../lib/UserCountCard";
// here can select mockup client instead.... :)
const PrifinaClient = new GraphQLClient();


const Wrapper = () => {
  //console.log("WRAPPER ", updateArgs);
  const { getCognitoUserCount } = useStore(
    state => ({
      getCognitoUserCount: state.getCognitoUserCount,
    }),
    shallow,
  );
  //updateArgs({ "userCount": 8 })
  const [cardProps, setCardProps] = useState({});
  const effectCalled = useRef(false);

  useEffect(() => {
    async function getCount() {
      console.log("GET COUNT ");

      effectCalled.current = true;
      const cnt = await getCognitoUserCount();
      setCardProps({ userCount: cnt.data.getCognitoUserCount });
    }
    if (!effectCalled.current) {
      getCount();
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



export const DashboardUserCountSB = Template.bind({});

DashboardUserCountSB.storyName = "UserCount";


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


/*
const activeMockupDecorator = (story, ctx) => {

  const { getCognitoUserCount } = useStore(
    state => ({
      getCognitoUserCount: state.getCognitoUserCount,
    }),
    shallow,
  );

  useEffect(() => {
    console.log("ARGS ", ctx.args);
    ctx.args['userCount'] = 7;
  }, [])


  return <>{story()}</>
}
*/


DashboardUserCountSB.decorators = [envDecorator]
