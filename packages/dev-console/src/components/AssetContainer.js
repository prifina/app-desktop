import React from "react";

import {
  Box,
  Flex,
  Text,
  Image,
  useTheme,
} from "@blend-ui/core";


import styled from "styled-components";

import PlaceholderImage from "../assets/PlaceholderImage";

import UploadAsset from "./UploadAsset-v2";

import PropTypes from "prop-types";

const ImageZoomContainer = styled(Image)`
  transition: transform 0.2s;

  height: 114px;
  width: 151px;
  &:hover {
    transform: scale(2.0, 2.0);
  }
  cursor: pointer;
`;

const ImageZoom = ({ src }) => {
  console.log("ZOOM IMAGE ", src);
  return (
    <ImageZoomContainer
      src={src}
      height="150px"
      onError={e => (e.target.style.display = "none")}
      onClick={() => {
        window.open(src);
      }}
    />
  );
};

ImageZoom.propTypes = {
  src: PropTypes.string,
};

const AssetContainer = ({
  src,
  id,
  type,
  numId,
  onFinish,
  S3Storage,
  updateUploaded
}) => {


  const { colors } = useTheme();

  return (
    <>
      <Flex
        mb={5}
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 0px 24px 0px",
          // width: "700px",
        }}
      >
        <Flex style={{ alignItems: "center" }}>
          <Box width="185px">
            {(src !== "") && <ImageZoom
              src={src}
              onError={e => (e.target.style.display = "none")}
            />}

            {(src === "") &&
              <PlaceholderImage />
            }
          </Box>

          <Box ml={16} mr={16}>
            <Text
              fontSize="sm"
              mb={5}
              style={{ textTransform: "uppercase" }}
              color={colors.textSecondary}
            >
              Product Image {numId}
            </Text>
            <Text fontSize="sm" mb={5} color={colors.textSecondary}>
              Add images which represent key elements of your product
              experience.
            </Text>
            <Text fontSize="sm" mb={5}>
              Images should be .jpg or .PNG and high enough resolution to
              display @ 284x213px on retina displays.
            </Text>
          </Box>
        </Flex>
        <UploadAsset

          id={id}
          type={type}
          numId={numId}
          onFinish={onFinish}
          S3Storage={S3Storage}
          updateUploaded={updateUploaded}
          imageState={(src === "")}

        />
      </Flex>
    </>
  );
};

AssetContainer.propTypes = {
  src: PropTypes.string,

  id: PropTypes.string,
  type: PropTypes.string,
  numId: PropTypes.string,
  onFinish: PropTypes.func,
  S3Storage: PropTypes.object,
  updateUploaded: PropTypes.func
};

export default AssetContainer;