import React from "react";

import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  useTheme,
} from "@blend-ui/core";

import { ProjectContainer } from "../pages/ProjectDetails-v2";
import PublisherDetails from "./PublisherDetails";
import CategorizationAndSupportDetails from "./CategorisationAndSupport";
import ProductDescriptionDetails from "./ProductDescriptionDetails";
import ApplicationDataDetails from "./ApplicationDataDetails";

import MarketingAssetsDetails from "./MarketingAssetsDetails";
const MarketPlaceListingDetails = ({ parentInputState, options, S3Storage, ...props }) => {

  console.log("MARKETPLACE DETAILS ", options);

  const { colors } = useTheme();

  const publisherDetailsArgs = {
    fields: {
      publisher: "p-publisher",
    },
    inputRefs: {},
    options: {
      defaults: {
        publisher: options.defaults.publisher
      }
    },
    inputState: (input, validation = false) => {
      console.log("STATE UPDATE", input);
      console.log("STATE UPDATE", input.id);
      console.log("STATE UPDATE", input.value);
      parentInputState(input)
      // inputRefs.current[input.id].value = input.value;

    }
  }

  const categorisationAndSupportDetailsArgs = {
    fields: {
      category: "p-category",
      age: "p-age",
    },
    inputRefs: {},
    options: {
      defaults: {
        languages: options.defaults.languages,
        deviceSupport: options.defaults.deviceSupport,
        category: options.defaults.category,
        age: options.defaults.age,
      }
    },
    inputState: (input, validation = false) => {
      console.log("STATE UPDATE", input);
      console.log("STATE UPDATE", input.id);
      console.log("STATE UPDATE", input.value);
      parentInputState(input)
      // inputRefs.current[input.id].value = input.value;

    }
  }

  const productDescriptionDetailsArgs = {
    fields: {
      title: "p-title",
      shortDescription: "p-shortDescription",
      longDescriotion: "p-longDescription"
    },
    inputRefs: {},
    options: {
      defaults: {
        title: options.defaults.title,
        shortDescription: options.defaults.shortDescription,
        longDescription: options.defaults.longDescription,
        keyFeatures: options.defaults.keyFeatures,
      }
    },
    inputState: (input, validation = false) => {
      console.log("STATE UPDATE", input);
      console.log("STATE UPDATE", input.id);
      console.log("STATE UPDATE", input.value);
      parentInputState(input)
      // inputRefs.current[input.id].value = input.value;

    }
  }


  const applicationDataDetailsArgs = {

    options: {
      defaults: {
        public: options.defaults.public,
        userHeld: options.defaults.userHeld,
        userGenerated: options.defaults.userGenerated
      }
    },
    inputState: (input, validation = false) => {
      console.log("STATE UPDATE", input);
      console.log("STATE UPDATE", input.id);
      console.log("STATE UPDATE", input.value);
      parentInputState(input)
      // inputRefs.current[input.id].value = input.value;

    }
  }



  const marketingAssetsArgs = {

    options: {
      defaults: {
        id: options.defaults.id,
        icon: options.defaults.icon,
        screenshots: options.defaults.screenshots,
      }
    },
    inputState: (input, validation = false) => {
      console.log("STATE UPDATE", input);
      console.log("STATE UPDATE", input.id);
      console.log("STATE UPDATE", input.value);
      parentInputState(input)
      // inputRefs.current[input.id].value = input.value;

    }
  }


  return <>
    <ProjectContainer mb={24}>
      <Box
        style={{
          padding: "4px 224px 16px 24px",
          marginBottom: 16,
        }}
      >
        <Text
          style={{ textTransform: "uppercase" }}
          mb={8}
          fontSize="lgx"
        >
          Marketplace Listing
        </Text>

        <Text mb={32} color={colors.textSecondary}>
          All applications published on our platform have a listing page
          in the Prifina App Marketplace. This is what users will see when
          they are deciding wether or not to install your app.
        </Text>
        <Text color={colors.textSecondary}>
          For context you can visit the App Marketplace and see how this
          information will be displayed.
        </Text>
      </Box>

      <PublisherDetails {...publisherDetailsArgs} />
      <CategorizationAndSupportDetails {...categorisationAndSupportDetailsArgs} />

      <ApplicationDataDetails {...applicationDataDetailsArgs} />
      <ProductDescriptionDetails {...productDescriptionDetailsArgs} />
      <MarketingAssetsDetails {...marketingAssetsArgs} S3Storage={S3Storage} />



    </ProjectContainer>

  </>
}


export default MarketPlaceListingDetails;