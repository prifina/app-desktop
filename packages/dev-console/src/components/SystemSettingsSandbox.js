import React, { useEffect, useState } from "react";

import { _ } from "lodash";

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

  console.log("DEFAULT SETTINGS", defaultSettings);

  let currentSettings = appSettings.settings;

  console.log("CURRENT SETTINGS", currentSettings[0].value);

  let currentSizes = currentSettings[0].value;
  let parsedSizes = JSON.parse(currentSizes);

  let currentThemes = currentSettings[1].value;
  let parsedThemes = JSON.parse(currentThemes);

  console.log("CURRENT SIZES", parsedSizes);

  let activeSizes = parsedSizes.map(items => ({ ...items, checked: true }));
  let activeThemes = parsedThemes.map(items => ({ ...items, checked: true }));

  console.log("ACTIVE SIZES", activeSizes);

  console.log("ACTIVE THEMES", activeThemes);

  let defaultSizes = [
    { option: "300x300", value: "300x300" },
    { option: "600x300", value: "600x300" },
    { option: "300x600", value: "300x600" },
    { option: "600x600", value: "600x600" },
  ];

  let defaultThemes = [
    { option: "Light", value: "light" },
    { option: "Dark", value: "dark" },
  ];

  console.log("DEFAULT SIZES", defaultSizes);

  const checkSelected = (originalArray, updatingArray) => {
    for (let i = 0, l = originalArray.length; i < l; i++) {
      for (let j = 0, ll = updatingArray.length; j < ll; j++) {
        if (originalArray[i].option === updatingArray[j].option) {
          originalArray.splice(i, 1, updatingArray[j]);
          break;
        }
      }
    }
  };

  checkSelected(defaultSizes, activeSizes);
  checkSelected(defaultThemes, activeThemes);

  const [themeOptions, setThemeOptions] = useState({
    checked: false,
    value: defaultThemes,
  });

  const [sizeOptions, setSizeOptions] = useState({
    checked: false,
    value: defaultSizes,
  });

  console.log("themeOptions", themeOptions);

  const handleCheck = (e, index, set) => {
    console.log(e.target.checked, index);
    set(prev => {
      let newState = { ...prev };
      newState.value[index].checked = e.target.checked;
      return newState;
    });
  };

  const settings = [...defaultSettings];

  useEffect(() => {
    let filteredSize = sizeOptions.value.filter(obj => {
      return obj.checked === true;
    });

    console.log("sizes filter", filteredSize);

    const sizeValues = filteredSize.map(({ checked, ...rest }) => ({
      ...rest,
    }));

    settings.push({
      field: "sizes",
      label: "Sizes",
      type: "select",
      value: JSON.stringify(sizeValues),
    });

    let filteredTheme = themeOptions.value.filter(obj => {
      return obj.checked === true;
    });

    console.log("themes filter", filteredTheme);

    const themeValues = filteredTheme.map(({ checked, ...rest }) => ({
      ...rest,
    }));

    console.log("res", themeValues);

    settings.push({
      field: "theme",
      label: "Theme",
      type: "select",
      value: JSON.stringify(themeValues),
    });

    console.log("settings", settings);
  }, [themeOptions, sizeOptions]);

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
          {sizeOptions.value.map((item, index) => (
            <Flex key={index}>
              <input
                checked={item?.checked || false}
                onChange={e => handleCheck(e, index, setSizeOptions)}
                type="checkbox"
              />
              <Text ml={4}>{item.option}</Text>
            </Flex>
          ))}
        </Flex>
      </Box>
      <Flex mb={25}>
        <Box>
          <Text fontSize="sm" mb={5}>
            Project themes
          </Text>
          <Flex>
            {themeOptions.value.map((item, index) => (
              <Flex mr={16} key={index}>
                <input
                  checked={item?.checked || false}
                  onChange={e => handleCheck(e, index, setThemeOptions)}
                  type="checkbox"
                />
                <Text ml={4}>{item.option}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Flex>
      <Button
        onClick={e => {
          onClick(e, settings);
        }}
      >
        Submit
      </Button>
    </Box>
  );
};
SystemSettingsSandbox.propTypes = {
  appSettings: PropTypes.object,
};

export default SystemSettingsSandbox;
