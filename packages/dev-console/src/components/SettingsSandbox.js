import React, { useState } from "react";

import { Flex, Box, Button, Text, TextArea, useTheme } from "@blend-ui/core";

import PropTypes from "prop-types";

import {i18n} from "@prifina-apps/utils";

i18n.init();

const SettingsSandbox = ({ onClick, appSettings, ...props }) => {
  const theme = useTheme();

  const { colors } = useTheme();

  const defaultSettings = appSettings.settings.filter(element => {
    return element.field === "theme" || element.label === "Sizes";
  });

  console.log("def", defaultSettings);

  ////need better control lose the theme and size and remove the array brackets

  const filter = appSettings.settings
    .filter(el => el.field !== "sizes")
    .filter(el => el.field !== "theme");

  const [settings, setSettings] = useState(appSettings.settings);

  const prettySettings = JSON.stringify(settings, undefined, 4);

  function handleChange(event) {
    setSettings(event.target.value);
  }

  return (
    <div>
      <Box mb={16}>
        <Text mb={5}>{i18n.__("testSettingsTabText")}</Text>
      </Box>

      <TextArea
        height="217px"
        width="660px"
        label="text"
        defaultValue={prettySettings}
        onChange={handleChange}
      />
      <Text mt={8} mb={18} fontSize="xs">
        {i18n.__("settingsHelperText")}
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


SettingsSandbox.propTypes = {
  onClick:PropTypes.func,
  appSettings:PropTypes.object
}  

export default SettingsSandbox;
