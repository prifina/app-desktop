
import React from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, } from "react-router-dom";



import { GraphQLContext } from "../lib/GraphQLContext";

import { GraphQLClient, API } from "../lib/Client";
import { PrifinaStoreProvider } from "../stores/PrifinaStore";

import Dashboard from '../pages/Dashboard';

const PrifinaClient = new GraphQLClient();
//console.log(theme)


/*
// StrictMode didn't work in decorator... 
const Wrapper = (props) => {

  return <React.StrictMode>
    <Dashboard {...props} />
  </React.StrictMode>

}
*/

const UsersPage = () => <div>Users</div>;

const UsersPage2 = () => <div>Users2</div>;
const TablesPage = () => <div>Tables</div>;

const Routing = (props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  console.log("ROUTE ", pathname, id);
  //const setActiveIndex = useStore(state => state.setActiveIndex);
  //console.log("HIST ", window.history)
  return <>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Dashboard {...props} />} />
        <Route path="/dashboard" element={<Dashboard {...props} />} />
        <Route path="/users/*" element={<Dashboard {...props} />} />
      </Routes>
    </React.StrictMode>
  </>

}


export default { title: "Pages /SB" };



const Template = args => <Routing {...args} />


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
