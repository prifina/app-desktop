import React, { useState } from "react";
import { Input } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";
import { default as eyeIcon } from "@iconify/icons-bx/bx-show";

export default { title: "Input" };

export const input = () => <input type="text" />;
input.story = {
  name: "Input",
};

export const input2 = () => <input disabled type="text" />;
input2.story = {
  name: "Input disabled",
};

export const input3 = () => <Input placeholder={"Enter value here"} />;
input3.story = {
  name: "Input Styled",
};

export const input31 = () => <Input placeholder={"Enter value here"} error />;
input31.story = {
  name: "Error Input Styled ",
};

export const input32 = () => (
  <Input placeholder={"Enter value here"} disabled value={"Value"} />
);
input32.story = {
  name: "Disabled Input Styled ",
};
export const input4 = () => (
  <Input placeholder={"Enter value here"} borders={0} p={0} />
);
input4.story = {
  name: "Input Styled no border",
};

export const input5 = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const onHide = (e) => {
    console.log("HIDE PASSWORD ", hidePassword);
    //e.preventDefault();
    //setHidePassword(!hidePassword);
  };
  return <BlendIcon iconify={eyeIcon} onClick={onHide} />;
};
input5.story = {
  name: "Icon Input ",
};
