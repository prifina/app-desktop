
import React from 'react';

import { GraphQLClient } from "../lib/Client";
//console.log(theme)
const client = new GraphQLClient();
console.log(client);
console.log(client.query().then(() => { console.log("OK") }));
export default { title: "Client" };


export const testClient = () => {

  return <div>Testing</div>
};


testClient.storyName = "Client";
