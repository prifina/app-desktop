import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Flex,
  Text,
  useTheme,
  Image,
  Divider
} from "@blend-ui/core";

import { InnerContainer } from "../pages/ProjectDetails-v2";
import UploadAsset from "./UploadAsset-v2";

import PlaceholderImage from "../assets/PlaceholderImage";
import AssetContainer from "./AssetContainer";

const MarketingAssetsDetails = ({ inputState, options, S3Storage, ...props }) => {

  console.log("MARKETING ASSETS ", options)

  const { colors } = useTheme();

  const [uploaded, setUploaded] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const imageUrls = useRef([]);
  const effectCalled = useRef(false);

  const images = [
    "icon-1.png",
    "screenshot-1.png",
    "screenshot-2.png",
    "screenshot-3.png",
  ];
  const appID = options.defaults.id();

  useEffect(() => {
    async function initImages() {
      effectCalled.current = true

      //Storage.get(s3Key, { level: "public", download: false })
      const imgs = images.map((img, i) => {
        return S3Storage.get(appID + "/assets/" + images[i], { level: "public", download: false })
      })

      Promise.all(imgs).then(res => {
        console.log("IMAGES ", res);
        imageUrls.current = res;
        setImagesLoaded(true);
      })


    }
    if (!effectCalled.current) {
      initImages();
    }
  }, [])

  const updateAssetStatus = (status, idx) => {

    if (status) {
      S3Storage.get(appID + "/assets/" + images[idx], { level: "public", download: false }).then(url => {
        imageUrls.current[idx] = url;
        let name = "icon";
        let asset = "assets/icon-1.png";
        if (idx != 0) {
          name = "screenshots";
          const currentScreenShots = options.defaults.screenshots();
          currentScreenShots[idx - 1] = 'assets/' + images[idx];
          asset = currentScreenShots;
        }
        inputState({ 'id': 'p-' + name, 'value': asset, force: true });
        setUploaded("");
      })
    }
    /*
    //
    const keys = Object.keys(state);
    //console.log(keys, keys[idx]);
    //{status:false,url:""},
    //{`${assetsS3Path}/icon-1.png`}
    console.log("ASSET UPLOAD ", idx);
    const images = [
      "icon-1.png",
      "screenshot-1.png",
      "screenshot-2.png",
      "screenshot-3.png",
    ];
    getImage(appID + "/assets/" + images[idx]).then(url => {
      //console.log("UPDATE ASSET ", url);
      let urls = imageUrls;
      urls[idx] = url;
      setImageUrl(urls);
      setState({ [keys[idx]]: status });
      let name = "icon";
      let asset = "icon-1.png";
      if (idx != 0) {
        name = "screenshots";
        const currentScreenShots = newValues.screenshots;
        currentScreenShots[idx - 1] = images[idx];
        asset = currentScreenShots;
      }
      console.log("UPDATE VALUES ", name, asset);
      setNewValues(existing => {
        return {
          ...existing,
          [name]: asset,
        };
      });
    });
    */
  };

  return <InnerContainer>
    <Box>
      <Text style={{ textTransform: "uppercase" }} mb={5}>
        5. Marketing assets
      </Text>
      <Text mb={40} color={colors.textSecondary}>
        Add your App icon and screenshots for your marketplace
        listing.
      </Text>
      <Flex
        mb={5}
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 8px 24px 8px",
        }}
      >
        <Flex style={{ alignItems: "center" }}>
          <Box width="92px">
            {(imagesLoaded && imageUrls.current[0] !== "") && <Image
              src={imageUrls.current[0]}
              onError={e => (e.target.style.display = "none")}
            />}

            {(!imagesLoaded || imageUrls.current[0] === "") &&
              <PlaceholderImage style={{ transform: "scale(0.6)" }} />
            }
          </Box>

          <Box ml={"45px"} mr={16}>
            <Text
              fontSize="sm"
              mb={5}
              style={{ textTransform: "uppercase" }}
              color={colors.textSecondary}
            >
              App Icon
            </Text>
            <Text fontSize="sm" mb={5} color={colors.textSecondary}>
              Add a unique icon which represents your product
              experience.
            </Text>
            <Text fontSize="sm" mb={5}>
              Images should be .jpg or .PNG and high enough resolution
              to display @ 56x56px on retina displays.
            </Text>
          </Box>
        </Flex>
        <UploadAsset
          id={appID}
          type="icon"
          numId="1"
          onFinish={updateAssetStatus}
          S3Storage={S3Storage}
          updateUploaded={setUploaded}
          imageState={imageUrls.current[0] !== ""}
        />
      </Flex>
      <Divider as={"div"} color="#393838" mb={56} />
      <Box>
        <Text style={{ textTransform: "uppercase" }}>
          Product Images
        </Text>

        <Text mt={5} fontSize="xs" color={colors.textSecondary}>
          Upload three screenshots of key screens in your application.
          Images should be 284 x 214px and high resolution.
        </Text>
        <Text mt={5} fontSize="xs" color={colors.textSecondary}>
          These screenshots will be in your product’s App Marketplace
          listing page. Images will be shown top-to-bottom based of
          the numerical order below.
        </Text>
        <Text mt={5} fontSize="xs" color={colors.textSecondary}>
          For guidelines on creating acceptable images visit our
          documentation
        </Text>
      </Box>

      <AssetContainer
        src={imageUrls.current[1]}
        id={appID}
        type="screenshot"
        numId="1"
        onFinish={updateAssetStatus}
        S3Storage={S3Storage}
        updateUploaded={setUploaded}
      />

      <Divider as={"div"} color="#393838" />

      <AssetContainer
        src={imageUrls.current[2]}
        id={appID}
        type="screenshot"
        numId="2"
        onFinish={updateAssetStatus}
        S3Storage={S3Storage}
        updateUploaded={setUploaded}
      />

      <Divider as={"div"} color="#393838" />

      <AssetContainer
        src={imageUrls.current[3]}
        id={appID}
        type="screenshot"
        numId="3"
        onFinish={updateAssetStatus}
        S3Storage={S3Storage}
        updateUploaded={setUploaded}
      />
    </Box>
  </InnerContainer>

}

export default MarketingAssetsDetails;