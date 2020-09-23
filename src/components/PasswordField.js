import React from "react";
import { IconField, Input } from "@blend-ui/core";

import { BlendIcon } from "@blend-ui/icons";
import { default as eyeIcon } from "@iconify/icons-bx/bx-show";
import bxLockAlt from "@iconify/icons-bx/bx-lock-alt";

const PasswordField = ({ placeholder, ...props }) => {
  return (
    <IconField>
      <BlendIcon iconify={bxLockAlt} color={"componentPrimary"} size={"17"} />
      <Input type={"password"} placeholder={placeholder} {...props} />
      <BlendIcon iconify={eyeIcon} color={"componentPrimary"} size={"17"} />
    </IconField>
  );
};

export default PasswordField;
