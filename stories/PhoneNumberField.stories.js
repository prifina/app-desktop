import React from "react";
import PhoneNumberField from "../src/components/PhoneNumberField";
import { Text } from "@blend-ui/core";
import { countryList } from "../src/lib/utils";

//console.log("CC", countryList());
/*
const selectOptions = [
  {
    key: "0",
    value: "This is component",
    component: (
      <React.Fragment>
        <Text as="span">This is component</Text>
        <Text as="span">(+358)</Text>
      </React.Fragment>
    ),
  },
  { key: "1", value: "Premium Economy" },
  { key: "2", value: "Something" },
];
*/
const selectOptions = countryList().map((cc) => {
  return {
    key: "+" + cc.countryCode,
    value: cc.regionName,
    component: (
      <React.Fragment>
        <Text as="span">{cc.regionName}</Text>
        <Text as="span" color={"#C3C2C2"} fontSize={"xs"} pl={4}>
          (+{cc.countryCode})
        </Text>
      </React.Fragment>
    ),
  };
});
export default { title: "Phone number Field" };

export const fieldinput = () => (
  <PhoneNumberField>
    <PhoneNumberField.RegionField
      defaultValue="000"
      options={selectOptions}
      searchLength={1}
      showList={true}
    />
    <PhoneNumberField.InputField placeholder={"Enter value here"} />
  </PhoneNumberField>
);
fieldinput.story = {
  name: "PhoneNumber",
};
