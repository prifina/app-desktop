import React, { useEffect, useState, useRef } from "react";
import { Box, Flex, Text, Image } from "@blend-ui/core";
//import Capy from "../assets/capy.png";

import config from "../config";

import PropTypes from "prop-types";

const placeHolderSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAAAXNSR0IArs4c6QAAAIZJREFUaEPt1EERACAMBDHq31o9wQ8TGxxwm+ns7j3BNz4eq654LPhRXPHIAqhHQv9vKq54ZAHUI6EdN9RRjyyAeiS0q4466pEFUI+EdtVRRz2yAOqR0K466qhHFkA9EtpVRx31yAKoR0K76qijHlkA9UhoVx111CMLoB4J7aqjjnpkgSz1B2jy0jkLcPj7AAAAAElFTkSuQmCC";

const s3path = `https://prifina-apps-${config.prifinaAccountId}-${config.auth_region}.s3.amazonaws.com`;

const UserAppIcon = ({ title, ...props }) => {

  //icon: [s3path, item.id, iconAsset].join("/"),
  //console.log(props)
  const src = [s3path, props['app-id'], "assets", "icon-1.png"].join("/");
  //console.log("SRC ", src);
  const imageRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(placeHolderSrc || src);
  const effectCalled = useRef(false);

  useEffect(() => {
    if (!effectCalled.current) {
      effectCalled.current = true;
      //console.log("IMAGE ....", src, imgSrc);
      if (imgSrc !== src) {
        imageRef.current.src = src;
        imageRef.current.onload = () => {
          //console.log("APP LOADED....", imageRef.current.src);
          setImgSrc(src);
          imageRef.current.onload = null;
        }
      }
    }


    /*
    if (imageRef.current.src !== src) {
      console.log("IMAGE ", imageRef.current.src)
      imageRef.current.src = src;
      imageRef.current.onload = () => {
        console.log("LOADED....");
        setImgSrc(src);
      }
    }
    */
  }, [imgSrc]);

  //{...{ src: imgSrc, ...props }}

  return (
    <Flex p={1} flexDirection={"column"} alignItems={"center"} justifyItems={"center"} textAlign={"center"} {...props}>

      <Box width={"62px"} height={"62px"} mt={"4px"} >
        <Image ref={imageRef} src={imgSrc} style={{ borderRadius: "8px" }} />
        <Text
          textStyle={"caption"}
          style={{ paddingTop: "4px" }}
        >
          {title}
        </Text>
      </Box>
    </Flex>
  );
};

UserAppIcon.propTypes = {
  title: PropTypes.string.isRequired,
};


UserAppIcon.displayName = "UserApp";

export default UserAppIcon;
