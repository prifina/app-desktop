import React, { useState } from "react";
import { Input, IconField } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";
import { default as eyeIcon } from "@iconify/icons-bx/bx-show";
import bxLock from "@iconify/icons-bx/bx-lock";
import bxPhone from "@iconify/icons-bx/bx-phone";
import bxUser from "@iconify/icons-bx/bx-user";
import bxEnvelope from "@iconify/icons-bx/bx-envelope";
import PasswordField from "../src/components/PasswordField";

//import bxHide from '@iconify/icons-bx/bx-hide';

//import bxLock from '@iconify/icons-bx/bx-lock';
//import bxPhone from '@iconify/icons-bx/bx-phone';
//import bxUser from '@iconify/icons-bx/bx-user';
//import bxEnvelope from '@iconify/icons-bx/bx-envelope';

//import { accountIcon, eyeIcon, BlendIcon } from "@blend-ui/icons";
// npm install --save-dev @iconify/react @iconify/icons-bx
//import { Icon, InlineIcon } from '@iconify/react';
//import bxArchiveIn from '@iconify/icons-bx/bx-archive-in';

export default { title: "Icon Field" };

export const iconfieldinput = () => (
  <IconField>
    <IconField.LeftIcon
      iconify={bxUser}
      color={"componentPrimary"}
      size={"17"}
    />
    <IconField.InputField placeholder={"Enter value here"} />
  </IconField>
);
iconfieldinput.story = {
  name: "Username",
};

export const iconfieldinput2 = () => (
  <IconField>
    <IconField.LeftIcon
      iconify={bxEnvelope}
      color={"componentPrimary"}
      size={"17"}
    />
    <IconField.InputField placeholder={"Enter value here"} />
  </IconField>
);
iconfieldinput2.story = {
  name: "Email",
};

export const iconfieldinput3 = () => (
  <IconField>
    <IconField.LeftIcon
      iconify={bxPhone}
      color={"componentPrimary"}
      size={"17"}
    />
    <IconField.InputField placeholder={"Enter value here"} />
  </IconField>
);
iconfieldinput3.story = {
  name: "Telephone",
};
/*
export const iconfieldinput4 = () => (
  <IconField>
    <BlendIcon iconify={bxLock} color={"componentPrimary"} size={"17"} />
    <Input placeholder={"Enter value here"} />
    <BlendIcon iconify={eyeIcon} color={"componentPrimary"} size={"17"} />
  </IconField>
);
iconfieldinput4.story = {
  name: "Password Field Input ",
};
*/
export const iconfieldinput4 = () => {
  //let addPopper = false;
  const [addPopper, setAddPopper] = useState(false);
  const onPopper = (e) => {
    console.log("POPPER");
    e.preventDefault();
    setAddPopper(!addPopper);
    //addPopper = !addPopper;
  };

  return (
    <PasswordField
      placeholder={"Enter value here"}
      onFocus={onPopper}
      onBlur={onPopper}
      addPopper={addPopper}
      verifications={[true, false, false, true, false]}
    />
  );
};
iconfieldinput4.story = {
  name: "Password Field Input ",
};
export const iconfieldinput5 = () => (
  <IconField disabled>
    <IconField.LeftIcon
      iconify={bxUser}
      color={"componentPrimary"}
      size={"17"}
    />
    <IconField.InputField placeholder={"Enter value here"} />
  </IconField>
);
iconfieldinput5.story = {
  name: "Disabled Username",
};

export const iconfieldinput6 = () => (
  <IconField>
    <IconField.LeftIcon
      iconify={bxUser}
      color={"componentPrimary"}
      size={"17"}
    />
    <IconField.InputField placeholder={"Enter value here"} error={true} />
  </IconField>
);
iconfieldinput6.story = {
  name: "Error Username",
};
