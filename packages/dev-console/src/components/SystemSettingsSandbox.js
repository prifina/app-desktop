import React, { useState } from "react";

import { useFormFields } from "@prifina-apps/utils";

import { Flex, Box, Button, Text, useTheme } from "@blend-ui/core";

import PropTypes from "prop-types";


const SystemSettingsSandbox = ({ onClick, appSettings, ...props }) => {
  const theme = useTheme();

  const { colors } = useTheme();

  console.log("MODAL SETTINGS ", appSettings);
  let defaultTheme = "light";
  let defaultSize = "300x300";
  let defaultSettings = [];
  if (
    appSettings.hasOwnProperty("settings") &&
    appSettings.settings.length > 0
  ) {
    appSettings.settings.forEach(s => {
      if (s.field === "theme") {
        const themeValues = JSON.parse(s.value);
        defaultTheme = themeValues[0].value;
      } else if (s.field === "sizes") {
        const sizeValues = JSON.parse(s.value);
        defaultSize = sizeValues[0].value;
      } else {
        defaultSettings.push(s);
      }
    });
  }

  console.log("THEME DEFAULT ", defaultTheme);
  const [themeFields, handleThemeChange] = useFormFields({
    theme: defaultTheme,
    size: defaultSize,
  });

  const [settingsFields, handleSettingsChange] = useFormFields({
    type: "text",
    label: "",
    field: "",
    value: "",
  });
  //const settingsListRef = useRef();
  const [settingsList, setSettings] = useState(defaultSettings);

  console.log("themesize", themeFields);

  return (
    <Box width="418px">
      <Box mb={25}>
        <Text fontSize="sm" mb={5}>
          Tell us what settings are included with your project. Changes here
          will be saved to your project package.
        </Text>
      </Box>
      <Box mb={25}>
        <Text fontSize="sm" mb={5}>
          Widget sizes
        </Text>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex>
            <input
              type="checkbox"
              id="size"
              name="size"
              value="300x300"
              onChange={handleThemeChange}
              checked
            />
            <Text>300x300</Text>
          </Flex>
          <Flex>
            <input
              type="checkbox"
              id="size"
              name="size"
              value="600x300"
              onChange={handleThemeChange}
              disabled
            />
            <Text>600x300</Text>
          </Flex>
          <Flex>
            <input
              type="checkbox"
              id="size"
              name="size"
              value="300x600"
              onChange={handleThemeChange}
              disabled
            />
            <Text>300x600</Text>
          </Flex>
          <Flex>
            <input
              type="checkbox"
              id="size"
              name="size"
              value="600x600"
              onChange={handleThemeChange}
              disabled
            />
            <Text>600x600</Text>
          </Flex>
        </Flex>
      </Box>
      <Flex mb={25}>
        <Box>
          <Text fontSize="sm" mb={5}>
            Project themes
          </Text>
          <Flex>
            <Flex>
              <input
                type="checkbox"
                id="theme"
                name="theme"
                value="light"
                onChange={handleThemeChange}
                // checked
              />
              <Text>Light</Text>
            </Flex>
            <Flex ml={16}>
              <input
                type="checkbox"
                id="theme"
                name="theme"
                value="dark"
                onChange={handleThemeChange}
                // disabled
              />
              <Text>Dark</Text>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Button
        onClick={e => {
          const settings = [...settingsList];

          console.log("CLICK ", settings);
          console.log("CLICK2 ", themeFields);

          settings.push({
            field: "sizes",
            label: "Sizes",
            type: "select",
            value: JSON.stringify([
              { option: themeFields.size, value: themeFields.size },
            ]),
          });

          settings.push({
            field: "theme",
            label: "Theme",
            type: "select",
            value: JSON.stringify([
              { option: themeFields.theme, value: themeFields.theme },
            ]),
          });

          onClick(e, settings);
        }}
      >
        Submit
      </Button>
    </Box>
  );
};
SystemSettingsSandbox.propTypes = {
  onClick:PropTypes.func,
  appSettings:PropTypes.object
}  

export default SystemSettingsSandbox;
