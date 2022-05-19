import React, { useState } from "react";

import { Flex, Box, Button, Text, TextArea, useTheme } from "@blend-ui/core";

const SettingsSandbox = ({ onClick, appSettings, ...props }) => {
  const theme = useTheme();

  const { colors } = useTheme();

  // const filter = appSettings.filter(item => item !== value)

  const fields = ["sizes", "theme"];

  const defaultSettings = appSettings.settings.filter(element => {
    return element.field === "theme" || element.label === "Sizes";
  });

  console.log("def", defaultSettings);

  const filter = appSettings.settings
    .filter(el => el.field !== "sizes")
    .filter(el => el.field !== "theme");

  const [settings, setSettings] = useState(appSettings.settings);

  const prettySettings = JSON.stringify(filter, undefined, 4);

  const prettyDefaultSettings = JSON.stringify(defaultSettings, undefined, 4);

  function handleChange(event) {
    setSettings(event.target.value);
  }

  let combinedSettings = [...settings, ...defaultSettings];

  return (
    <div>
      <Box mb={16}>
        <Text mb={5}>Settings</Text>
      </Box>

      <TextArea
        height="217px"
        width="660px"
        label="text"
        defaultValue={prettySettings}
        onChange={handleChange}
      />
      <Text mt={8} mb={18} fontSize="xs">
        Generate inputs used in your project (json format)
      </Text>
      <Button
        onClick={e => {
          onClick(e, settings);
        }}
      >
        Update
      </Button>
    </div>
  );
};

export default SettingsSandbox;
