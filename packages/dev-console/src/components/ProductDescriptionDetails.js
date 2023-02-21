import React from "react";

import {
  Box,
  Flex,
  Text,
  Input,
  TextArea,
  useTheme,
} from "@blend-ui/core";

import { TagInput } from "@blend-ui/tag-input";

import { InnerContainer, useTagInputValues } from "../pages/ProjectDetails-v2";

const ProductDescriptionDetails = ({ inputRefs, inputState, fields, options, ...props }) => {


  const { colors } = useTheme();
  //const [newKeyFeatures, setNewKeyFeatures] = useState([]);
  const [newKeyFeatures, setNewKeyFeatures] = useTagInputValues(options.defaults.keyFeatures(), (items) => {
    inputState({ 'id': 'p-keyFeatures', 'value': items });
  })

  const checkEntry = (e) => {
    console.log("TARGET ", e.target.id)
    const newValue = inputRefs[e.target.id].value;
    console.log("Checking value ", newValue);
    inputState(inputRefs[e.target.id]);
    e.preventDefault();

  }

  return <InnerContainer>
    <Box>
      <Text style={{ textTransform: "uppercase" }}>
        4. Product description
      </Text>
      <Text mt={5} mb={40} color={colors.textSecondary}>
        Add descriptions of your product and list it’s features. This
        information will be shown under the ‘details’ tab of your
        product page.
      </Text>
      <Box mb={40}>
        <Text fontSize="sm" color={colors.textSecondary}>
          Application name
        </Text>
        <Flex alignItems="center">
          <Input
            label="text"
            color={colors.textPrimary}
            style={{
              background: "transparent",
              width: 470,
            }}
            showList={true}
            width={"150px"}
            name={fields["title"]}
            id={fields["title"]}
            defaultValue={options.defaults.title() || ""}
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

          />
          <Box>
            <Text fontSize="xs" ml={25} color={colors.textMuted}>
              The name users will see on the App Marketplace.
            </Text>
            <Text fontSize="xs" ml={25} color={colors.textMuted}>
              The application name is also your project name in the
              App Studio
            </Text>
          </Box>
        </Flex>
      </Box>
      <Text fontSize="sm" color={colors.textSecondary}>
        Short Description
      </Text>
      <Box mb={40}>
        <Flex alignItems="center">
          <Box>
            <TextArea
              placeholder="Heads up widget for showing you the weather in relevant locations to you."
              expand
              height={83}
              width="470px"
              label="text"

              name={fields["shortDescription"]}
              id={fields["shortDescription"]}
              defaultValue={options.defaults.shortDescription() || ""}
              ref={(ref) => {
                if (ref) {
                  inputRefs[ref.id] = ref;
                }
              }}
              onBlur={checkEntry}
            />
          </Box>
          <Box width="340px">
            <Text
              fontSize="xs"
              ml={25}
              mb={10}
              color={colors.textMuted}
            >
              A concise description of your product.
            </Text>
            <Text fontSize="xs" ml={25} color={colors.textMuted}>
              This will be used standalone on the widget directory
              page and along with the long description in your
              marketplace listing page.
            </Text>
          </Box>
        </Flex>
        <Text fontSize="xs" color={colors.textSecondary}>
          Max 50 words
        </Text>
      </Box>
      <Text fontSize="sm" mb={5} color={colors.textSecondary}>
        Long Description
      </Text>
      <Box mb={40}>
        <Flex alignItems="center">
          <TextArea
            placeholder="This simple widget gives you insight into the weather in different locations you choose. You can access it in your account from wherever you access the internet."
            expand
            height={208}
            width="470px"
            label="text"

            name={fields["longDescription"]}
            id={fields["longDescription"]}
            defaultValue={options.defaults.longDescription() || ""}
            ref={(ref) => {
              if (ref) {
                inputRefs[ref.id] = ref;
              }
            }}
            onBlur={checkEntry}
          />

          <Box width="340px">
            <Text
              fontSize="xs"
              ml={25}
              mb={10}
              color={colors.textMuted}
            >
              Go into more detail about your product and the value it
              offers users.
            </Text>
            <Text fontSize="xs" ml={25} color={colors.textMuted}>
              This will be used along with the short description on
              your product’s listing page. You can treat the short
              description as an introduction and the long as more
              details.
            </Text>
          </Box>
        </Flex>
        <Text fontSize="xs" mt={6} color={colors.textSecondary}>
          Max 50 words
        </Text>
      </Box>
      <Text fontSize="sm" mb={5} color={colors.textSecondary}>
        Features list
      </Text>
      <Flex alignItems="center" mb={32}>
        <TagInput
          tags={newKeyFeatures}
          setTags={setNewKeyFeatures}
          style={{
            backgroundColor: colors.baseTertiary,
            height: 110,
            width: 470,
          }}
        />
        <Box width="340px">
          <Text
            fontSize="xs"
            ml={25}
            mb={10}
            color={colors.textMuted}
          >
            Type to add features, these will be translated into a
            simple nubered list.
          </Text>
          <Text fontSize="xs" ml={25} color={colors.textMuted}>
            The order you enter features in here will be the order
            reflected in your product’s listing page.
          </Text>
        </Box>
      </Flex>
    </Box>
  </InnerContainer>

}

export default ProductDescriptionDetails;