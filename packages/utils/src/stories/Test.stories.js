
import React from 'react';

//import { useTheme } from "@blend-ui/core";

import useComponentFlagList from "../lib/hooks/UseComponentFlagList";
//console.log(theme)
export default { title: "Test" };


export const test = () => {
  //const theme = useTheme();
  //console.log(theme);
  const { selectOptions, flagsLoading } = useComponentFlagList();

  return <div>Testing</div>
};


test.storyName = "Test";
