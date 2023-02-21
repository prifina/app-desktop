import React, { useRef, useState, forwardRef } from "react";


import { Flex, Box, Button, Text, Checkbox } from "@blend-ui/core";

import { useToast } from "@blend-ui/toast";
import PropTypes from "prop-types";

const SetChecbox = forwardRef(({ initState, label, ...props }, ref) => {

  const [checked, setChecked] = useState(initState);

  return <Checkbox {...props} ref={ref} checked={checked} onChange={() => setChecked(preValue => !preValue)}>
    <Text as={"span"} textStyle={"caption"} ml={8}>
      {label}
    </Text>
  </Checkbox>
});

const SystemSettingsSandbox = ({ systemSettings, updateSettings }) => {


  const toast = useToast();

  /*
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
*/
  const sizes = ["300x300", "600x600", "300x600", "600x300"];
  const themes = ["light", "dark"];
  const sizeRefs = useRef({});
  const themeRefs = useRef({});
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
          Widget size support
        </Text>
        <Flex justifyContent="space-between" alignItems="center">
          {sizes.map((size, i) => {
            const initState = systemSettings[0].value.indexOf(size) === -1 ? false : true;
            //console.log("SETTINGS ", systemSettings[0].value, size)
            //console.log("SETTINGS ", systemSettings[0].value.indexOf(size))
            return <SetChecbox key={"size-" + i} label={size} initState={initState} ref={ref => {
              if (ref) {
                sizeRefs.current[size] = ref;
              }
            }} />
          })}

        </Flex>
      </Box>
      <Flex mb={25}>
        <Box>
          <Text fontSize="sm" mb={5}>
            Project theme support
          </Text>
          <Flex>
            {themes.map((theme, i) => {
              const initState = systemSettings[1].value.indexOf(theme) === -1 ? false : true;
              const label = theme.charAt(0).toUpperCase() + theme.slice(1);
              return <Flex mr={52}><SetChecbox key={"theme-" + i} label={label} initState={initState} ref={ref => {
                if (ref) {
                  themeRefs.current[theme] = ref;
                }
              }} /></Flex>
            })}

          </Flex>
        </Box>
      </Flex>
      <Button

        onClick={e => {
          systemSettings[0].value = [];
          sizes.forEach((size, i) => {
            const checked = sizeRefs.current[size].querySelector('input').checked;
            if (checked) {
              systemSettings[0].value.push(size);
            }
          })
          systemSettings[1].value = [];
          themes.forEach((theme, i) => {
            const checked = themeRefs.current[theme].querySelector('input').checked;
            if (checked) {
              systemSettings[1].value.push(theme);
            }
          })
          // console.log("SETTINGS ", sizeRefs.current["300x300"].querySelector('input').checked);
          console.log("SETTINGS ", systemSettings);
          updateSettings(systemSettings).then(() => {
            toast.info("System settings updated", {});
          })

        }}

      >
        Update
      </Button>
    </Box>
  );
};

SystemSettingsSandbox.propTypes = {
  systemSettings: PropTypes.array,
  updateSettings: PropTypes.func
};


export default SystemSettingsSandbox;
