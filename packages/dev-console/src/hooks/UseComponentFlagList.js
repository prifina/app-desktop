import React, { useState, useEffect, useRef } from "react";
import {
  countryList,
} from "@prifina-apps/utils";
import {

  Flex,
  Text,
  useTheme,
  Divider,
} from "@blend-ui/core";

import useFlags from "./UseFlags";

const continents = {
  XX: { name: "", order: 0 }, //popular...
  AF: { name: "Africa", order: 5 },
  AN: { name: "Antarctica", order: 7 },
  AS: { name: "Asia", order: 3 },
  EU: { name: "Europe", order: 2 },
  NA: { name: "North America", order: 1 },
  OC: { name: "Oceania", order: 6 },
  SA: { name: "South America", order: 4 },
  ZZ: { name: "", order: 8 }, //unknowns...
};
const popularList = ["US", "GB", "FI"];

const UseComponentFlagList = () => {

  const { colors } = useTheme();

  const { cList, nList } = countryList(continents, popularList);

  //console.log("COUNTRIES ", cList);
  //console.log("SUPPORTTED COUNTRIES ", nList);
  const { icons, isLoading } = useFlags(nList);
  const [flagsLoading, setFlagsLoading] = useState(true);

  const [selectOptions, setSelectOptions] = useState([]);

  useEffect(() => {
    if (!isLoading && icons) {
      //console.log("ICONS ", icons);
      let items = [];
      cList.forEach(item => {
        const l = Object.keys(item)[0];
        if (item[l].length > 0) {
          if (l !== "XX") {
            items.push({
              key: "XX",
              value: "XX",
              regionCode: "000",
              component: <>
                <Text mt={18}>{continents[l].name}</Text>
                <Divider mb={10} />
              </>

            });
          }
          item[l].forEach(cc => {
            const flag = icons[cc.regionCode] || null;
            items.push({
              key: "+" + cc.countryCode,
              value: cc.regionName,
              regionCode: cc.regionCode,
              searchValue: cc.regionName + " +" + cc.countryCode,
              component: <Flex mb={6} alignContent={"center"}>
                {flag}
                <Text
                  ml={flag === null ? 22 : 6}
                  as="span"
                  fontSize={"xs"}
                  lineHeight={"16px"}
                >
                  {cc.regionName}
                </Text>
                <Text
                  as="span"
                  color={colors.textMuted}
                  fontSize={"xs"}
                  pl={4}
                  lineHeight={"16px"}
                >
                  +{cc.countryCode}
                </Text>
              </Flex>
            });
          });
        }
      });

      setSelectOptions(items);
      setFlagsLoading(false);
    }
  }, [isLoading])


  return { selectOptions, flagsLoading };
}


export default UseComponentFlagList;
