/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";

import { SimpleProgress } from "@prifina-apps/utils";

export default {
  title: "Components UI/SimpleProgress",
  component: SimpleProgress,
  args: {
    steps: 3,
    active: 0,
    variation: "tracker",
    w: "700px"
  }
};


const Template = args => <div style={{ margin: "20px", width: args.w }}><SimpleProgress {...args} /></div>;
export const SimpleProgressSB = Template.bind({});

SimpleProgressSB.storyName = "SB";


export const SimpleProgressArrowSB = Template.bind({});

const arrowDecorator = (story, ctx) => {
  ctx.args.variation = "tracker-arrow";
  return <>
    {story()}
  </>
}


SimpleProgressArrowSB.decorators = [arrowDecorator]


SimpleProgressArrowSB.storyName = "SB-Arrow";
