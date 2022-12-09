
import React, { useEffect } from 'react';

import { useTheme } from "@blend-ui/core";
import { useComponentFlagList } from "@prifina-apps/utils";
/* 
import useComponentFlagList from "../lib/hooks/UseComponentFlagList";
//console.log(theme)
export default { title: "Test" };


export const test = () => {
  //const theme = useTheme();
  //console.log(theme);
  const { selectOptions, flagsLoading } = useComponentFlagList();

   */
//console.log(theme)
export default { title: "Test" };


export const test = () => {
  const theme = useTheme();
  console.log("THEME ", theme)
  const { selectOptions, flagsLoading } = useComponentFlagList();
  useEffect(() => {
    if (!flagsLoading) {
      console.log("FLAGS OK ", selectOptions);
    }
  }, [flagsLoading])

  return <div>Testing</div>
};


test.storyName = "Test";
