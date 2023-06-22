import React, { useEffect, useRef } from "react";

import {
  Box,
  Flex,
  Text,
  Input,
  useTheme,
} from "@blend-ui/core";

import {
  appCategory,
  ageAppropriate,
} from "@prifina-apps/ui-lib";

import { InnerContainer, FieldContainer, CustomSelect } from "../pages/ProjectDetails-v2";

const CategorizationAndSupportDetails = ({ inputRefs, inputState, fields, options, ...props }) => {


  const { colors } = useTheme();

  const checkEntry = (e) => {
    console.log("TARGET ", e.target.id)
    const newValue = inputRefs[e.target.id].value;
    console.log("Checking value ", newValue);
    inputState(inputRefs[e.target.id]);
    e.preventDefault();

  }

  const effectCalled = useRef(false);

  useEffect(() => {
    if (!effectCalled.current) {
      effectCalled.current = true;
      appCategory.unshift("Choose a category");
      ageAppropriate.unshift("Choose age category");
    }

  }, [])


  const defaultCategory = options.defaults.category();

  const defaultAge = options.defaults.age();

  return <InnerContainer>
    <Text style={{ textTransform: "uppercase" }} mb={5}>
      2. Categorization and Support
    </Text>
    <Text color={colors.textSecondary} mb={40}>
      Packaged version of your application, including manifest file.
    </Text>
    <Text fontSize="sm" color={colors.textSecondary}>
      Language support
    </Text>

    <FieldContainer>
      <Box>
        <Input
          width="451px"
          label="text"
          defaultValue={options.defaults.languages() || ""}
          color={colors.textPrimary}
          disabled
        />
      </Box>
      <Text fontSize="xs" ml={25} color={colors.textMuted}>
        Prifina only currently supports English but we have plans to
        add other languages soon!
      </Text>
    </FieldContainer>
    <Text fontSize="sm" color={colors.textSecondary}>
      Device support
    </Text>
    <FieldContainer>
      <Box>
        <Input
          width="451px"
          label="text"
          defaultValue={options.defaults.deviceSupport() || ""}
          color={colors.textPrimary}
          disabled
        />
      </Box>
      <Text fontSize="xs" ml={25} color={colors.textMuted}>
        Prifina only currently supports desktop but we have plans to
        expand to other devices and screensizes soon!
      </Text>
    </FieldContainer>

    <Text fontSize="sm" color={colors.textSecondary}>
      Application category (select 1)
    </Text>
    <Flex alignItems="center" mb={24}>
      <Box>
        <CustomSelect
          name={fields["category"]}
          id={fields["category"]}
          /*
          defaultValue={() => {
            const defaultCategory = options.defaults.category();
            console.log("DEFAULT ", defaultCategory)
            return defaultCategory === "" ? "Choose a category" : defaultCategory
          }}
          */
          showList={true}
          width={"150px"}
          ref={(ref) => {
            if (ref) {
              inputRefs[ref.id] = ref;
            }
          }}
          onBlur={checkEntry}
          onKeyDown={e => {
            if (e.key === "Enter") {
              checkEntry(e);
            }
          }}
          defaultValue={defaultCategory || ""}
        >
          {appCategory.map((item, index) => {
            //console.log(defaultCategory, item, defaultCategory === item);
            //selected={`${defaultCategory === item ? "selected" : ""}`}
            return <option key={index} value={item}  >{item}</option>
          })}
        </CustomSelect>
      </Box>
      <Box>
        <Text fontSize="xs" mb={10} ml={25} color={colors.textMuted}>
          Select the category which best fits your product.
        </Text>
        <Text fontSize="xs" ml={25} color={colors.textMuted}>
          If none fit choose ‘other’
        </Text>
      </Box>
    </Flex>
    <Text fontSize="sm" mb={5} color={colors.textSecondary}>
      Age appropriate (select 1)
    </Text>
    <Flex alignItems="center" mb={32}>
      <Box>
        <CustomSelect
          name={fields["age"]}
          id={fields["age"]}
          /* 
          defaultValue={() => {
            const defaultCategory = options.defaults.age();
            return defaultCategory === "" ? "Choose age category" : defaultCategory
          }} */

          showList={true}
          width={"150px"}
          ref={(ref) => {
            if (ref) {
              inputRefs[ref.id] = ref;
            }
          }}
          onBlur={checkEntry}
          onKeyDown={e => {
            if (e.key === "Enter") {
              checkEntry(e);
            }
          }}
          defaultValue={defaultAge || ""}
        >
          {ageAppropriate.map((item, index) => (
            <option key={index} value={item}  >{item}</option>
          ))}
        </CustomSelect>
      </Box>
      <Text fontSize="xs" ml={25} color={colors.textMuted}>
        Select the appropriate age your product.
      </Text>
    </Flex>
  </InnerContainer>

}

export default CategorizationAndSupportDetails;