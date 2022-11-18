
import React from 'react';

import { GraphQLContext } from "../lib/GraphQLContext";

import { GraphQLClient, API } from "../lib/Client";
import { PrifinaStoreProvider } from "../stores/PrifinaStore";

import Dashboard from '../pages/Dashboard';

const PrifinaClient = new GraphQLClient();
//console.log(theme)

// StrictMode didn't work in decorator... 
const Wrapper = (props) => {

  return <React.StrictMode>
    <Dashboard {...props} />
  </React.StrictMode>

}

export default { title: "Pages /SB" };



const Template = args => <Wrapper {...args} />


export const DashboardSB = Template.bind({});


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

DashboardSB.decorators = [envDecorator]

DashboardSB.storyName = "Dashboard";
