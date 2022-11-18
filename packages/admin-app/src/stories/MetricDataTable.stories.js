
import React, { useState, useEffect } from 'react';

//import './tableTest.css'
import { cognitoMetricJSON } from '../lib/mocks/data';

import MetricTable from "../lib/CognitoMetricsTable";
import { CognitoMetricData } from '../lib';

// StrictMode didn't work in decorator... 
const Wrapper = (props) => {

  return <React.StrictMode>
    <MetricTable {...props} />
  </React.StrictMode>

}

//console.log(theme)
export default {
  title: "Components Dashboard/SB",
  //component: Wrapper,
  args: {
    data: CognitoMetricData({ result: cognitoMetricJSON })
  }
};

const Template = args => <Wrapper {...args} />

export const TableTestSB = Template.bind({});
TableTestSB.storyName = "MetricDataTable";

/*
const dataDecorator = (story, ctx) => {

  ctx.args['data'] =CognitoMetricData(cognitoMetricJSON);

  return <>
    {story()}
  </>
}

TableTestSB.decorators = [dataDecorator]
*/

/*
const Template = args => <Wrapper {...args} />

export const DashboardUserCountSB = Template.bind({});

DashboardUserCountSB.storyName = "UserCount";
*/
//tableTest.storyName = "TableTest";
