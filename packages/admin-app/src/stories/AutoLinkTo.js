
import React from 'react';
import { linkTo } from '@storybook/addon-links';

import { useActiveContext } from "./Dashboard-sidebar-Active.stories";

export const AutoLinkTo = ({ kind, story }) => {

  //console.log("HOOK2 ", useActiveContext())
  const { name } = useActiveContext();
  localStorage.setItem("Nav-Story", name);
  React.useEffect(() => {
    linkTo(kind, story)();
  })
  return null;
}