import React from "react";

import {
  Box,
  Flex,
  Text,
  useTheme,
} from "@blend-ui/core";

import { TagInput } from "@blend-ui/tag-input";

import { InnerContainer, useTagInputValues } from "../pages/ProjectDetails-v2";

const ApplicationDataDetails = ({ inputState, options, ...props }) => {


  const { colors } = useTheme();

  const [newPublic, setNewPublic] = useTagInputValues(options.defaults.public(), (items) => {
    inputState({ 'id': 'p-public', 'value': items });
  })

  const [newUserHeld, setNewUserHeld] = useTagInputValues(options.defaults.userHeld(), (items) => {
    inputState({ 'id': 'p-userHeld', 'value': items });
  })

  const [newUserGenerated, setNewUserGenerated] = useTagInputValues(options.defaults.userGenerated(), (items) => {
    inputState({ 'id': 'p-userGenerated', 'value': items });
  })

  return <InnerContainer>
    <Box>
      <Box mb={40}>
        <Text mb={10} style={{ textTransform: "uppercase" }}>
          3. Application data
        </Text>
        <Text mb={15} color={colors.textSecondary}>
          Tell your users what specific data your application requires
          or generates. This information will be shown under the “data
          requirements” tab in your product page.
        </Text>
        <Text color={colors.textSecondary}>
          For more detail on data types and detailing data use visit
          our docs
        </Text>
      </Box>
      <Text fontSize="sm" mb={5} color={colors.textSecondary}>
        Public data
      </Text>
      <Flex alignItems="center" mb={40}>
        <TagInput
          placeholder="e.g.“City name”"
          tags={newPublic}
          setTags={setNewPublic}
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
            Detail any attributes your application uses from public
            data sources. For example “Open weather API”.
          </Text>
          <Text fontSize="xs" ml={25} color={colors.textMuted}>
            For examples of public sources visit our documentation
          </Text>
        </Box>
      </Flex>
      <Text fontSize="sm" mb={5} color={colors.textSecondary}>
        User Held
      </Text>
      <Flex alignItems="center" mb={40}>
        <TagInput
          placeholder="e.g.“Avg HR”"
          tags={newUserHeld}
          setTags={setNewUserHeld}
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
            Detail any attributes your application uses from the user
            via our data connectors. For example from the “Oura” data
            connector you might have “Deep sleep”.
          </Text>
          <Text fontSize="xs" ml={25} color={colors.textMuted}>
            For examples of user-held data visit our documentation
          </Text>
        </Box>
      </Flex>
      <Text fontSize="sm" mb={5} color={colors.textSecondary}>
        User Generated
      </Text>
      <Flex alignItems="center" mb={32}>
        <TagInput
          placeholder="e.g.“Height”"
          tags={newUserGenerated}
          setTags={setNewUserGenerated}
          style={{
            backgroundColor: colors.baseTertiary,
            height: 110,
            width: 470,
          }}
        />
        <Box width="340px">
          <Text fontSize="xs" ml={25} color={colors.textMuted}>
            This name will be associated with your products on the App
            Marketplace.
          </Text>
        </Box>
      </Flex>
    </Box>
  </InnerContainer>

}

export default ApplicationDataDetails;