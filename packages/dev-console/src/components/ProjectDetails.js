import React, { useState, useEffect, useReducer } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Link,
  Divider,
  Input,
  Radio,
  TextArea,
  useTheme,
} from "@blend-ui/core";

import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";
import { IconField } from "@blend-ui/icon-field";

import { TagInput } from "@blend-ui/tag-input";

import {
  updateAppVersionMutation,
  deleteAppVersionMutation,
  listDataSourcesQuery,
  i18n,
  getAppVersionQuery,
  useAppContext,
  appCategory,
  ageAppropriate,
} from "@prifina-apps/utils";

import { API as GRAPHQL, Storage } from "aws-amplify";

import config from "../config";

import PropTypes from "prop-types";
import { BlendIcon } from "@blend-ui/icons";

import * as C from "./components";

import { useToast } from "@blend-ui/toast";

import styled from "styled-components";

import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";
import hazardSymbol from "@iconify/icons-mdi/warning";
import successTick from "@iconify/icons-mdi/tick-circle";

import mdiLockOutline from "@iconify/icons-mdi/lock-outline";

import UploadAsset from "./UploadAsset";
import UploadFile from "./UploadFile";

import placeholderImage from "../assets/placeholder-image.svg";

import {
  AddRemoveDataSources,
  ControlAddedDataSources,
  DataSourceForm,
  ApiForm,
} from "./helper";

i18n.init();

const userRegion = config.cognito.USER_IDENTITY_POOL_ID.split(":")[0];

Storage.configure({
  bucket: `prifina-data-${config.prifinaAccountId}-${config.main_region}`,
  region: userRegion,
});

const getImage = s3Key => {
  console.log("GET IMAGE URL ", s3Key);
  return new Promise(function (resolve, reject) {
    Storage.get(s3Key, { level: "public", download: false })
      .then(url => {
        var myRequest = new Request(url);
        fetch(myRequest).then(function (response) {
          if (response.status === 200) {
            console.log("URL ", url);
            resolve(url);
          } else {
            reject(response.status);
          }
        });
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

const listAssets = s3Key => {
  console.log("S3 ", s3Key);

  return Storage.list(s3Key, { level: "public" });
};

const ProjectDetails = props => {
  console.log("DETAILS ", props);
  const { colors } = useTheme();
  //console.log("THEME COLORS  ", colors);
  //const history = useHistory();
  const navigate = useNavigate();

  const { appID } = props;

  const { currentUser } = useAppContext();

  const toast = useToast();

  const [appData, setAppData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  const [newValues, setNewValues] = useState();

  const [newKeyFeatures, setNewKeyFeatures] = useState([]);
  const [newUserHeld, setNewUserHeld] = useState([]);
  const [newUserGenerated, setNewUserGenerated] = useState([]);
  const [newPublic, setNewPublic] = useState([]);

  //in progress..
  const [isEqual, setIsEqual] = useState(false);

  const [activeTab, setActiveTab] = useState(0);

  const tabClick3 = (e, tab) => {
    setActiveTab(tab);
  };

  //const [assetsS3Path, setAssetsS3Path] = useState("");

  const assetsS3Path = `https://prifina-data-${config.prifinaAccountId}-${config.main_region}.s3.${config.main_region}.amazonaws.com/public/${appID}/assets`;

  //const [assetStatuses, setAssetStatus] = useState([]);

  // can't use object/array for controlling state change reloading...
  // this method allows to "pack" those state variables into one state
  // replace this later with zustand...
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      icon: false,
      screenShot1: false,
      screenShot2: false,
      screenShot3: false,
    },
  );

  const [imageUrls, setImageUrl] = useState(new Array(4).fill(""));

  const [newDataSources, setNewDataSources] = useState([]);
  console.log("new data sources", newDataSources);

  let defaultSettings = [
    {
      field: "sizes",
      value: '[{"option":"300x300","value":"300x300"}]',
      label: "Sizes",
      type: "select",
    },
    {
      field: "theme",
      value: '[{"option":"Light","value":"light"}]',
      label: "Theme",
      type: "select",
    },
  ];

  const lang = "en";
  const devSupport = "Desktop devices";

  useEffect(() => {
    async function fetchData() {
      const result = await getAppVersionQuery(GRAPHQL, appID);
      const currentApp = result.data.getAppVersion;
      console.log("filtered app", currentApp);
      delete currentApp.modifiedAt;
      delete currentApp.createdAt;

      // note currentApp.version should not be updated.... nextVersion instead.

      // noSQL doesn't have all attributes, which are in schema object, if those attributes doesn't have values...
      if (!currentApp?.icon) {
        currentApp.icon = "";
      }
      if (!currentApp?.screenshots) {
        currentApp.screenshots = new Array(3).fill("");
      }
      // native assets...
      if (!currentApp?.assets) {
        currentApp.assets = [];
      }

      setAppData(currentApp);

      setNewValues(currentApp);

      setNewKeyFeatures(
        currentApp.keyFeatures === null ? [] : currentApp.keyFeatures,
      );
      setNewUserHeld(currentApp.userHeld === null ? [] : currentApp.userHeld);
      setNewUserGenerated(
        currentApp.userGenerated === null ? [] : currentApp.userGenerated,
      );
      setNewPublic(currentApp.public === null ? [] : currentApp.public);

      if (
        currentApp?.dataSources &&
        currentApp.dataSources != null &&
        currentApp.dataSources.length > 0
      ) {
        console.log(
          "DATASOURCES FOUND ",
          currentApp.dataSources,
          typeof currentApp.dataSources,
        );
        setNewDataSources(JSON.parse(currentApp.dataSources));
      }

      const assetList = await listAssets(appID + "/assets/");
      //      console.log("PROCESS THIS ", assetList);
      if (assetList.length > 0) {
        const statuses = new Array(4).fill(false);
        const checkList = [
          "icon-1.png",
          "screenshot-1.png",
          "screenshot-2.png",
          "screenshot-3.png",
        ];
        let images = [];
        assetList.forEach(asset => {
          const assetKey = asset.key.split("/").pop();
          const idx = checkList.indexOf(assetKey);
          if (idx > -1) {
            statuses[idx] = true;
            images.push(getImage(appID + "/assets/" + assetKey));
          }
        });

        await Promise.all(images).then(res => {
          //console.log("URLS ", res);
          let urls = imageUrls;
          res.forEach(url => {
            checkList.forEach((img, i) => {
              if (url.indexOf(img) > -1) {
                urls[i] = url;
              }
            });
          });
          console.log("ASSETS STATUS ", urls, statuses, assetList);

          setState({
            icon: statuses[0],
            screenShot1: statuses[1],
            screenShot2: statuses[2],
            screenShot3: statuses[3],
          });
          setImageUrl(urls);
        });
        /*
        await Promise.all(images).then(urls=>{
  
          let urls = imageUrls;
          urls[idx] = url;
          setImageUrl(urls);
      
        }) 
     
      */

        /* 
         const images = ['icon-1.png', 'screenshot-1.png', 'screenshot-2.png', 'screenshot-3.png'];
 
 
         getImage(appID + "/assets/" + images[idx], (url) => {
           let urls = imageUrls;
           urls[idx] = url;
           setImageUrl(urls);
 */
        // console.log("STATUSES ", statuses, assetList);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  console.log("appData", appData);

  console.log("USER HELD", newUserHeld);

  console.log("KEY FEATURES", newKeyFeatures);

  //in progress..
  // useEffect(() => {
  //   let eq = JSON.stringify(newValues) === JSON.stringify(appData);
  //   console.log("eq", eq);

  //   if (eq) {
  //     setIsEqual(true);
  //   } else if (!eq) {
  //     setIsEqual(false);
  //   }
  // }, [newValues]);

  const handleValueChange = event => {
    let value = event.target.value;
    let name = event.target.name;

    setNewValues(prevalue => {
      return {
        ...prevalue, // Spread Operator
        [name]: value,
      };
    });
  };

  console.log("NEW VALUES", newValues);

  const saveChanges = (
    id,
    appType,
    name,
    nextVersion,
    publisher,
    newCategory,
    deviceSupport,
    languages,
    age,
    newKeyFeatures,
    title,
    shortDescription,
    longDescription,
    newUserHeld,
    newUserGenerated,
    newPublic,
    icon,
    screenshots,
    newRemoteUrl,
    newDataSources,
  ) => {
    updateAppVersionMutation(GRAPHQL, {
      id: id,
      appType: appType,
      name: name,
      nextVersion: nextVersion,
      publisher: publisher,
      category: newCategory,
      deviceSupport: deviceSupport,
      languages: languages,
      age: age,
      keyFeatures: newKeyFeatures,
      title: title,
      shortDescription: shortDescription,
      longDescription: longDescription,
      userHeld: newUserHeld,
      userGenerated: newUserGenerated,
      public: newPublic,
      icon: icon,
      screenshots: screenshots,
      remoteUrl: newRemoteUrl,
      dataSources: JSON.stringify(newDataSources),
      settings: defaultSettings,
    }).then(res => {
      console.log("SUCCESS", res);
      toast.success("Project details updated", {});
      // location.reload();
      //   setStep(2);
    });
  };

  const publishApp = () => {
    updateAppVersionMutation(GRAPHQL, {
      id: newValues.id,
      status: 1,
    }).then(res => {
      console.log("SUCCESS", res);
      setNewValues({ ...newValues });
      toast.success("Your project has been published", {});
      // location.reload();
      //   setStep(2);
    });
  };

  const deleteApp = () => {
    deleteAppVersionMutation(GRAPHQL, newValues.id).then(res => {
      console.log("SUCCESS", res);
      // location.reload();
      toast.success("Deleted project", {});
    });
  };

  const detailsSaveStatus = () => {
    if (!isEqual) {
      return (
        <Flex alignItems="center">
          <BlendIcon
            size="18px"
            iconify={hazardSymbol}
            className="icon"
            color="orange"
          />
          <Text fontSize="xs" ml={5} color="#EDA436">
            {i18n.__("unsavedChangesSectionStatusText")}
          </Text>
          <Button
            ml="15px"
            onClick={() => {
              saveChanges(
                newValues.id,
                newValues.appType,
                newValues.name,
                newValues.nextVersion,
                newValues.publisher,
                newValues.category,
                // newValues.deviceSupport,
                // newValues.languages,
                devSupport,
                lang,
                newValues.age,
                newKeyFeatures,
                newValues.title,
                newValues.shortDescription,
                newValues.longDescription,
                newUserHeld,
                newUserGenerated,
                newPublic,
                newValues.icon,
                newValues.screenshots,
                newValues.newRemoteUrl,
                newDataSources,
              );
            }}
          >
            Save Changes
          </Button>
        </Flex>
      );
    } else {
      return (
        <Flex alignItems="center">
          <Text fontSize="xs">{i18n.__("noUnsavedChangesSectionStatusText")}</Text>
          <Button disabled colorStyle="red" ml="15px">
            Save Changes
          </Button>
        </Flex>
      );
    }
  };

  // const passAssetInfo = title => {
  //   console.log("pass", title);

  //   setNewValues({
  //     ...newValues,
  //     icon: appData.id + "-" + "icon" + "-" + title,
  //   });
  // };

  //---------------------------------------------------------

  const [dataConnectors, setDataConnectors] = useState([]);
  const [publicSources, setPublicSources] = useState([]);

  useEffect(() => {
    // declare the async data fetching function
    const fetchConnectors = async () => {
      const data = await listDataSourcesQuery(GRAPHQL, {
        filter: { sourceType: { lt: 3 } },
      });
      let filteredData = data.data.listDataSources.items;

      console.log("original data sources", filteredData);

      setDataConnectors(filteredData);
    };
    const fetchPublic = async () => {
      const data = await listDataSourcesQuery(GRAPHQL, {
        filter: { sourceType: { eq: 3 } },
      });
      let filteredData = data.data.listDataSources.items;

      console.log("original public", filteredData);

      setPublicSources(filteredData);
    };

    // call the function
    fetchConnectors().catch(console.error);
    fetchPublic().catch(console.error);
  }, []);

  const [dataSourcePreview, setDataSourcePreview] = useState([]);
  const [apiDataPreview, setApiDataPreview] = useState([]);

  console.log("CLOUD DATA", dataSourcePreview);
  console.log("API DATA", apiDataPreview);

  let addedDataSources = dataSourcePreview
    .concat(apiDataPreview)
    .filter(key => key.isAdded == true);
  console.log("ADDED DATA", addedDataSources);

  const [editControled, setEditControled] = useState(false);

  ///Prifina user cloud
  //can make them reusable
  const addDataSource = (source, sourceType) => {
    const newSourceData = [...dataSourcePreview, { source, sourceType }];
    console.log("NEW DATASOURCE ADDED ", newSourceData);
    setDataSourcePreview(newSourceData);
  };

  const removeDataSource = index => {
    const newSourceData = [...dataSourcePreview];
    newSourceData.splice(index, 1);
    setDataSourcePreview(newSourceData);
  };

  const completeDataSource = index => {
    console.log("COMPLETE DATA SOURCE CLICK ", dataSourcePreview);
    const newSourceData = newDataSources.concat(dataSourcePreview);
    setNewDataSources(newSourceData);
  };

  //////API

  const addApiSource = text => {
    const newSourceData = [...apiDataPreview, { text }];
    setApiDataPreview(newSourceData);
  };

  const removeApiSource = index => {
    const newSourceData = [...apiDataPreview];
    newSourceData.splice(index, 1);
    setApiDataPreview(newSourceData);
  };

  const completeApiSource = index => {
    const newSourceData = [...apiDataPreview];
    newSourceData[index].isAdded = true;
    setNewDataSources(newSourceData);
  };

  const uncompleteDataSource = index => {
    newDataSources.splice(index, 1);
    setNewDataSources([...newDataSources]);
  };

  //==============//==============//==============//==============//==============//==============//==============

  // /changing attribute name
  dataConnectors.forEach(function (obj) {
    obj.value = obj.name;
  });
  publicSources.forEach(function (obj) {
    obj.value = obj.name;
  });

  function checkJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const [fontColor, setFontColor] = useState(colors.textMuted);

  const handleFocusColor = () => {
    setFontColor(colors.brandAccent);
  };
  const handleBlurColor = () => {
    setFontColor(colors.textMuted);
  };

  const updateAssetStatus = (status, idx) => {
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
  };

  console.log("app", appCategory);

  return (
    <>
      {!isLoading ? (
        <Flex flexDirection="column">
          <C.ActionContainer
            mt={10}
            mb={24}
            style={{
              top: 65,
              position: "sticky",
              outline: 2,
              boxShadow: `0px 15px 20px ${colors.basePrimary}`,
            }}
          >
            <C.CustomShape bg="brandAccent" />
            <Flex alignItems="center">
              <BlendIcon
                style={{ cursor: "pointer" }}
                color={colors.textPrimary}
                iconify={mdiArrowLeft}
                width="24px"
                onClick={() => {
                  navigate(-1);
                }}
              />
              <Input
                style={{ marginLeft: 8 }}
                width="200px"
                name="name"
                defaultValue={appData.name}
                onChange={handleValueChange}
              />
              <Flex ml={16}>
                <Flex flexDirection="row" alignItems="center" mr="20px">
                  <Flex flexDirection="row" alignItems="center" mr="15px">
                    <Radio
                      fontSize="8px"
                      onChange={() => {}}
                      onClick={() => {
                        setNewValues(existing => {
                          return { ...existing, appType: 1 };
                        });
                      }}
                      checked={newValues.appType === 1 ? "checked" : null}
                    />
                    <Text fontSize="xs">{i18n.__("application")}</Text>
                  </Flex>
                  <Flex flexDirection="row" alignItems="center">
                    <Radio
                      fontSize="10px"
                      onChange={() => {}}
                      onClick={() => {
                        setNewValues(existing => {
                          return { ...existing, appType: 2 };
                        });
                        //setNewValues({ ...newValues, appType: 2 });
                      }}
                      checked={newValues.appType === 2 ? "checked" : null}
                    />
                    <Text fontSize="xs">{i18n.__("widget")}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>

            {detailsSaveStatus()}
          </C.ActionContainer>
          <C.ProjectContainer mb={24}>
            <Box
              style={{
                padding: "4px 224px 16px 24px",
                marginBottom: 16,
              }}
            >
              <Text style={{ textTransform: "uppercase" }} mb={8}>
                {i18n.__("devComponentProjectDetailsRemoteLinkTest")}
              </Text>

              <Text color={colors.textSecondary}>
                {i18n.__("devComponentProjectDetailsRemoteLinkTestDesc")}
              </Text>
            </Box>

            <Flex
              width="584px"
              style={{
                border: "1px solid #393838",
                padding: 24,
                width: "100%",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                  {i18n.__("remoteLink")}
                </Text>
                <Input
                  width="451px"
                  label="text"
                  name="newRemoteUrl"
                  defaultValue={appData.remoteUrl}
                  onChange={handleValueChange}
                  color={colors.textSecondary}
                />
                <Text fontSize="xxs" mt={5} color={colors.textSecondary}>
                  {i18n.__("devComponentProjectDetailsInputText")}
                </Text>
              </Box>

              <Button
                onClick={() => {
                  navigate("/sandbox", { state: { allValues: appData } });
                }}
              >
                Launch Sandbox
              </Button>
            </Flex>
          </C.ProjectContainer>
          <C.ProjectContainer mb={24}>
            <Box
              style={{
                padding: "4px 224px 16px 24px",
                marginBottom: 40,
              }}
            >
              <Text
                style={{ textTransform: "uppercase" }}
                mb={12}
                fontSize="lgx"
              >
                {i18n.__("devComponentProjectDetailsTextPackage")}
              </Text>

              <Text mb={20} color={colors.textSecondary}>
                {i18n.__("devComponentProjectDetailsAppDesc")}
              </Text>
              <Text color={colors.textSecondary}>
                {i18n.__("devComponentProjectDetailsAppDesc2")}
              </Text>
            </Box>

            <C.InnerContainer>
              <Box>
                <Text style={{ textTransform: "uppercase" }}>
                  {i18n.__("subSectionHeadingBuildDeployment")}
                </Text>
                <Text mt={5} mb={32} color={colors.textSecondary}>
                  {i18n.__("subSectionForBuildDeployment")}
                </Text>
                <Box mb={16}>
                  <Text fontSize="sm" color={colors.textSecondary}>
                    {i18n.__("versionNumberForLabel")}
                  </Text>
                  <Flex alignItems="center">
                    <Input
                      onFocus={handleFocusColor}
                      onBlur={handleBlurColor}
                      label="text"
                      name="nextVersion"
                      defaultValue={appData.nextVersion || "undefined"}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        minWidth: "451px",
                        width: 451,
                      }}
                    />
                    <Box>
                      <Text fontSize="xs" ml={25} color={colors.textMuted}>
                        {i18n.__("versionNumberForLabelHelp1")}
                      </Text>
                      <Text fontSize="xs" ml={25} color={colors.textMuted}>
                        {i18n.__("versionNumberForLabelHelp2")}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
                <Text fontSize="sm" color={colors.textSecondary}>
                  {i18n.__("appIdFormLabel")}
                </Text>
                <Flex mb={53} alignItems="center">
                  <Input
                    onFocus={handleFocusColor}
                    onBlur={handleBlurColor}
                    disabled
                    width="451px"
                    label="text"
                    value={appData.id}
                    color={colors.textSecondary}
                    style={{ background: "transparent" }}
                  />
                  <Box>
                    <Text fontSize="xs" ml={25} color={colors.textMuted} mb={8}>
                      {i18n.__("appIDHelperText")}
                    </Text>
                    <Text fontSize="xs" ml={25} color={colors.textMuted}>
                      {i18n.__("docLabel")}
                    </Text>
                  </Box>
                </Flex>
                <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                  {i18n.__("packageUploaderFormLabel")}
                </Text>
                <Flex alignItems="center" justifyContent="center" mb={16}>
                  <Box ml="5px">
                    <UploadFile widgetId={appID} />
                  </Box>
                  <Box ml={25}>
                    <Text fontSize="xs" color={colors.textMuted} mb={10}>
                      {i18n.__("buildDeploymentPackageRuleText")}
                    </Text>
                    <Text fontSize="xs" color={colors.textMuted}>
                      {i18n.__("buildDeploymentPackageRule1")}
                    </Text>
                    <Text fontSize="xs" color={colors.textMuted} mb={10}>
                      {i18n.__("buildDeploymentPackageRule2")}
                    </Text>
                    <Text fontSize="xs" color={colors.textMuted}>
                      {i18n.__("docLabel")}
                    </Text>
                  </Box>
                </Flex>
                <Text>{i18n.__("statusHelperText")}</Text>
              </Box>
            </C.InnerContainer>
          </C.ProjectContainer>
          <C.ProjectContainer mb={24}>
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
                {i18n.__("sectionHeadingMarkeplaceListing")}
              </Text>

              <Text mb={32} color={colors.textSecondary}>
                {i18n.__("marketplaceListingDecs")}
              </Text>
              <Text color={colors.textSecondary}>
                {i18n.__("marketPlaceLisitngText")}
              </Text>
            </Box>
            <C.InnerContainer>
              <Box>
                <Text style={{ textTransform: "uppercase" }}>
                  {i18n.__("subSectionHeadingPublisherDetails")}
                </Text>
                <Text mt={5} mb={32} color={colors.textSecondary}>
                  {i18n.__("subSectionForPublisherDetails")}
                </Text>
                <Flex alignItems="flex-end" mb={16}>
                  <Box>
                    <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                      {i18n.__("publisherNameFormLabel")}
                    </Text>
                    <Input
                      width="451px"
                      label="text"
                      name="publisher"
                      defaultValue={appData.publisher}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                    />
                  </Box>
                </Flex>
              </Box>
            </C.InnerContainer>
            <C.InnerContainer>
              <Text style={{ textTransform: "uppercase" }} mb={5}>
                {i18n.__("subSectionHeadingCategorization")}
              </Text>
              <Text color={colors.textSecondary} mb={40}>
                {i18n.__("subSectionForPublisherTextHelp")}
              </Text>
              <Text fontSize="sm" color={colors.textSecondary}>
                {i18n.__("langSupLabel")}
              </Text>
              <C.FieldContainer>
                <Box>
                  <Input
                    width="451px"
                    label="text"
                    name="languages"
                    // defaultValue={appData.languages}
                    value="en"
                    onChange={handleValueChange}
                    color={colors.textPrimary}
                    disabled
                  />
                </Box>
                <Text fontSize="xs" ml={25} color={colors.textMuted}>
                  {i18n.__("langSupportHelpText")}
                </Text>
              </C.FieldContainer>
              <Text fontSize="sm" color={colors.textSecondary}>
                {i18n.__("deviceSupLabel")}
              </Text>
              <C.FieldContainer>
                <Box>
                  <Input
                    width="451px"
                    label="text"
                    name="deviceSupport"
                    // defaultValue={appData.deviceSupport}

                    defaultValue="Desktop devices"
                    // value="Desktop devices"
                    onChange={handleValueChange}
                    color={colors.textPrimary}
                    disabled
                  />
                </Box>
                <Text fontSize="xs" ml={25} color={colors.textMuted}>
                  {i18n.__("deviceSupHelpText")}
                </Text>
              </C.FieldContainer>

              <Text fontSize="sm" color={colors.textSecondary}>
                {i18n.__("appCatLabel")}
              </Text>
              <Flex alignItems="center" mb={24}>
                <Box>
                  <C.CustomSelect
                    name="category"
                    defaultValue={
                      appData.category === null
                        ? "Choose category"
                        : appData.category
                    }
                    onChange={handleValueChange}
                    showList={true}
                    width={"150px"}
                  >
                    {appCategory.map((item, index) => (
                      <option key={index}>{item}</option>
                    ))}
                  </C.CustomSelect>
                </Box>
                <Box>
                  <Text fontSize="xs" mb={10} ml={25} color={colors.textMuted}>
                    {i18n.__("appCatHelpText1")}
                  </Text>
                  <Text fontSize="xs" ml={25} color={colors.textMuted}>
                    {i18n.__("appCatHelpText2")}
                  </Text>
                </Box>
              </Flex>
              <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                {i18n.__("ageAppropLabel")}
              </Text>
              <Flex alignItems="center" mb={32}>
                <Box>
                  <C.CustomSelect
                    name="age"
                    defaultValue={
                      appData.age === null ? "Choose category" : appData.age
                    }
                    onChange={handleValueChange}
                    showList={true}
                    width={"150px"}
                  >
                    {ageAppropriate.map((item, index) => (
                      <option key={index}>{item}</option>
                    ))}
                  </C.CustomSelect>
                </Box>
                <Text fontSize="xs" ml={25} color={colors.textMuted}>
                  {i18n.__(ageAppropHelpText)}
                </Text>
              </Flex>
            </C.InnerContainer>
            <C.InnerContainer>
              <Box>
                <Box mb={40}>
                  <Text mb={10} style={{ textTransform: "uppercase" }}>
                    {i18n.__("subSectionHeadingAppData")}
                  </Text>
                  <Text mb={15} color={colors.textSecondary}>
                    {i18n.__("subSectionForAppData1")}
                  </Text>
                  <Text color={colors.textSecondary}>
                    {i18n.__("subSectionForAppData2")}
                  </Text>
                </Box>
                <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                  {i18n.__("publicLabel")}
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
                      {i18n.__("publicHelpText1")}
                    </Text>
                    <Text fontSize="xs" ml={25} color={colors.textMuted}>
                      {i18n.__("publicHelpText2")}
                    </Text>
                  </Box>
                </Flex>
                <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                  {i18n.__(devComponentHelperText)}
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
                      {i18n.__("userHeldHelpText1")}
                    </Text>
                    <Text fontSize="xs" ml={25} color={colors.textMuted}>
                      {i18n.__("userHeldHelpText2")}
                    </Text>
                  </Box>
                </Flex>
                <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                  {i18n.__("userGenerateHelpText1")}
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
                      {i18n.__("userGenerateHelpText2")}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </C.InnerContainer>
            <C.InnerContainer>
              <Box>
                <Text style={{ textTransform: "uppercase" }}>
                  {i18n.__("subSectionHeadingProduct")}
                </Text>
                <Text mt={5} mb={40} color={colors.textSecondary}>
                  {i18n.__("subSectionForHeading")}
                </Text>
                <Box mb={40}>
                  <Text fontSize="sm" color={colors.textSecondary}>
                    {i18n.__("applicationNameLabel")}
                  </Text>
                  <Flex alignItems="center">
                    <Input
                      onFocus={handleFocusColor}
                      onBlur={handleBlurColor}
                      label="text"
                      name="title"
                      defaultValue={appData.title || "undefined"}
                      onChange={handleValueChange}
                      color={colors.textPrimary}
                      style={{
                        background: "transparent",
                        width: 470,
                      }}
                    />
                    <Box>
                      <Text fontSize="xs" ml={25} color={colors.textMuted}>
                        {i18n.__("userAppMarketplaceText1")}
                      </Text>
                      <Text fontSize="xs" ml={25} color={colors.textMuted}>
                        {i18n.__("userAppMarketplaceText2")}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
                <Text fontSize="sm" color={colors.textSecondary}>
                  {i18n.__("shortDescriptionLabel")}
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
                        name="shortDescription"
                        defaultValue={appData.shortDescription}
                        onChange={handleValueChange}
                      />
                    </Box>
                    <Box width="340px">
                      <Text
                        fontSize="xs"
                        ml={25}
                        mb={10}
                        color={colors.textMuted}
                      >
                        {i18n.__("shortDescriptionHelpText1")}
                      </Text>
                      <Text fontSize="xs" ml={25} color={colors.textMuted}>
                        {i18n.__("shortDescriptionHelpText2")}
                      </Text>
                    </Box>
                  </Flex>
                  <Text fontSize="xs" color={colors.textSecondary}>
                    {i18n.__("wordDescriptionLength")}
                  </Text>
                </Box>
                <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                  {i18n.__("longDescriptionLabel")}
                </Text>
                <Box mb={40}>
                  <Flex alignItems="center">
                    <TextArea
                      placeholder="This simple widget gives you insight into the weather in different locations you choose. You can access it in your account from wherever you access the internet."
                      expand
                      height={208}
                      width="470px"
                      label="text"
                      name="longDescription"
                      defaultValue={appData.longDescription}
                      onChange={handleValueChange}
                    />

                    <Box width="340px">
                      <Text
                        fontSize="xs"
                        ml={25}
                        mb={10}
                        color={colors.textMuted}
                      >
                        {i18n.__("longDescriptionHelpText1")}
                      </Text>
                      <Text fontSize="xs" ml={25} color={colors.textMuted}>
                        {i18n.__("longDescriptionHelpText2")}
                      </Text>
                    </Box>
                  </Flex>
                  <Text fontSize="xs" mt={6} color={colors.textSecondary}>
                    {i18n.__("wordDescriptionLength")}
                  </Text>
                </Box>
                <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                  {i18n.__("featuresListLabel")}
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
                      {i18n.__("featuresListHelpText1")}
                    </Text>
                    <Text fontSize="xs" ml={25} color={colors.textMuted}>
                      {i18n.__("featuresListHelpText2")}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </C.InnerContainer>
            <C.InnerContainer>
              <Box>
                <Text style={{ textTransform: "uppercase" }} mb={5}>
                  {i18n.__("subSectionHeadingMarketing")}
                </Text>
                <Text mb={40} color={colors.textSecondary}>
                  {i18n.__("subSectionForMarketing")}                 
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
                      {state.icon ? (
                        <Image
                          // width="92px"
                          src={imageUrls[0]}
                          onError={e => (e.target.style.display = "none")}
                        />
                      ) : (
                        <Image width="92px" src={placeholderImage} />
                      )}
                    </Box>

                    <Box ml={16} mr={16}>
                      <Text
                        fontSize="sm"
                        mb={5}
                        style={{ textTransform: "uppercase" }}
                        color={colors.textSecondary}
                      >
                        {i18n.__("appIconHeading")}
                      </Text>
                      <Text fontSize="sm" mb={5} color={colors.textSecondary}>
                        {i18n.__("appIconText1")}                       
                      </Text>
                      <Text fontSize="sm" mb={5}>
                        {i18n.__("appIconHelpText")}
                      </Text>
                    </Box>
                  </Flex>
                  <UploadAsset
                    id={appData.id}
                    type="icon"
                    numId="1"
                    onFinish={updateAssetStatus}
                    // passAssetInfo={passAssetInfo}
                  />
                </Flex>
                <Divider as={"div"} color="#393838" mb={56} />
                <Box>
                  <Text style={{ textTransform: "uppercase" }}>
                    {i18n.__("productImagesHeader")}
                  </Text>

                  <Text mt={5} fontSize="xs" color={colors.textSecondary}>
                    {i18n.__("productImagesHelpText1")}
                  </Text>
                  <Text mt={5} fontSize="xs" color={colors.textSecondary}>
                    {i18n.__("productImagesHelpText2")}
                  </Text>
                  <Text mt={5} fontSize="xs" color={colors.textSecondary}>
                    {i18n.__("productImagesHelpText3")}
                  </Text>
                </Box>
                <C.AssetContainer
                  state={state.screenShot1}
                  src={imageUrls[1]}
                  id={appData.id}
                  type="screenshot"
                  numId="1"
                  onFinish={updateAssetStatus}
                  colors={colors}
                />
                <Divider as={"div"} color="#393838" />

                <C.AssetContainer
                  state={state.screenShot2}
                  src={imageUrls[2]}
                  id={appData.id}
                  type="screenshot"
                  numId="2"
                  onFinish={updateAssetStatus}
                  colors={colors}
                />
                <Divider as={"div"} color="#393838" />

                <C.AssetContainer
                  state={state.screenShot3}
                  src={imageUrls[3]}
                  id={appData.id}
                  type="screenshot"
                  numId="3"
                  onFinish={updateAssetStatus}
                  colors={colors}
                />
              </Box>
            </C.InnerContainer>
          </C.ProjectContainer>

          <C.ProjectContainer alt="dataSources" mb={24}>
            <Box mb={45}>
              <Text style={{ textTransform: "uppercase" }}>
                {i18n.__("dataResourcesSurveyLabel")}
              </Text>
              <Text mt={5} color={colors.textSecondary}>
                {i18n.__("dataResourceshelpPara")}
              </Text>
            </Box>
            <C.InnerContainer>
              <Flex>
                <div
                  style={{
                    overflow: "hidden",
                    width: 600,
                  }}
                >
                  <Tabs
                    activeTab={activeTab}
                    onClick={tabClick3}
                    style={{
                      height: "100%",
                      background: "transparent",
                      padding: 0,
                    }}
                    variant="rectangle"
                  >
                    <TabList>
                      <Tab>
                        <Text>{i18n.__("publicApi")}</Text>
                      </Tab>
                      <Tab>
                        <Text>{i18n.__("prifinaUserCloud")}</Text>
                      </Tab>
                      <Tab>
                        <Text>{i18n.__("noData")}</Text>
                      </Tab>
                    </TabList>
                    <TabPanelList style={{ backgroundColor: null }}>
                      <TabPanel
                        style={{
                          height: "100vh",
                          paddingBottom: "50px",
                          overflow: "auto",
                        }}
                      >
                        <div style={{ overflow: "auto" }}>
                          <Flex>
                            <ApiForm
                              addApi={addApiSource}
                              selectOptions={publicSources}
                            />
                          </Flex>

                          {/* Box with state change */}
                          <Flex>
                            {apiDataPreview.length > 0 && (
                              <Flex
                                width="100%"
                                flexDirection="column"
                                padding="10px"
                                style={{
                                  marginTop: 15,
                                  borderRadius: 10,
                                }}
                              >
                                <Text textStyle="h6" mb="10px">
                                  {i18n.__("chooseToAddSources")}
                                </Text>
                                <Flex>
                                  <Flex flexDirection="column">
                                    {apiDataPreview.map((event, index) => (
                                      <AddRemoveDataSources
                                        key={index}
                                        index={index}
                                        dataSource={event}
                                        removeDataSource={removeApiSource}
                                        completeDataSource={completeApiSource}
                                      />
                                    ))}
                                  </Flex>
                                </Flex>
                              </Flex>
                            )}
                          </Flex>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div style={{ overflow: "auto" }}>
                          <Flex>
                            <DataSourceForm
                              addDataSource={addDataSource}
                              // addFunctions={addFunction}
                              selectOptions={dataConnectors}
                            />
                          </Flex>
                          <Flex>
                            {dataSourcePreview.length > 0 && (
                              <Flex
                                width="100%"
                                flexDirection="column"
                                padding="10px"
                                style={{
                                  backgroundColor: colors.baseMuted,
                                  marginTop: 15,
                                  borderRadius: 10,
                                }}
                              >
                                <Text textStyle="h6" mt="10px" mb="10px">
                                  {i18n.__("dataConectorResults")}
                                </Text>

                                <Flex>
                                  <Flex flexDirection="column">
                                    {dataSourcePreview.map((item, index) => (
                                      <>
                                        <AddRemoveDataSources
                                          key={index}
                                          index={index}
                                          dataSource={item}
                                          removeDataSource={removeDataSource}
                                          completeDataSource={
                                            completeDataSource
                                          }
                                        />
                                      </>
                                    ))}
                                  </Flex>
                                </Flex>
                              </Flex>
                            )}
                          </Flex>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div style={{ overflow: "auto" }}>
                          <Flex>
                            <Box
                              width="426px"
                              height="76px"
                              borderRadius="6px"
                              paddingLeft="10px"
                              bg={colors.baseLinkHover}
                              style={{
                                border: `2px solid ${colors.baseLink}`,
                              }}
                            >
                              <Flex>
                                <Text>{i18n.__("noDataText")}</Text>
                                <Button
                                  variation="link"
                                  onClick={() => {
                                    window.open("https://prifina.com");
                                  }}
                                >
                                  {i18n.__("learnMoreHere")}
                                </Button>
                              </Flex>
                            </Box>

                            <Flex ml="10px">{/* <CheckboxStateful /> */}</Flex>
                          </Flex>
                        </div>
                      </TabPanel>
                    </TabPanelList>
                  </Tabs>
                </div>
                <Box width="320px">
                  <Text fontSize="13px">
                    {i18n.__("publicDataSourcesText1")}
                  </Text>
                  <Text mt="15px" fontSize="13px">
                    {i18n.__("publicDataSourcesText2")}
                  </Text>
                </Box>
              </Flex>

              {appData.dataSources !== null &&
              appData.dataSources !== "[]" &&
              appData.dataSources !== 0 &&
              appData.dataSources !== ["[null]"] ? (
                <Flex flexDirection="column" justifyContent="center">
                  {newDataSources.length > 0 &&
                    newDataSources.map((item, index) => (
                      <ControlAddedDataSources
                        key={index}
                        keyIndex={index}
                        dataSource={item}
                        uncompleteDataSource={uncompleteDataSource}
                        editControled={editControled}
                      />
                    ))}

                  {/* {newDataSources.length === 0 && <div>No datasources </div>} */}
                </Flex>
              ) : (
                <Flex flexDirection="column" justifyContent="center">
                  <Text mt="20px" mb="20px">
                    {i18n.__("dataSourcesUsed")}
                  </Text>

                  <Flex
                    style={{
                      border: "1px dashed #373436",
                      width: 438,
                      height: 272,
                      borderRadius: 4,
                      background: "#6B6669",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      width="238px"
                      src={placeholderImage}
                      height="120px"
                    />

                    <Text fontSize="lg" mt={16}>
                      {i18n.__("selectSources")}
                    </Text>
                    <Text mt="10px" color={colors.textSecondary}>
                      {i18n.__("dataSourcesYouAdd")}
                    </Text>
                  </Flex>
                </Flex>
              )}
            </C.InnerContainer>
          </C.ProjectContainer>

          <C.ActionContainer mb={32} justifyContent="space-between">
            <C.CustomShape bg="baseError" />
            <Box width="530px">
              <Text>{i18n.__("publishProjectHeading")}</Text>
              <Text mt={5} fontSize="xs">
                {i18n.__("appStatusLabel")}{" "}
                {appData.status === 1 ? "Published" : "Not Published"}
              </Text>
            </Box>
            <Button
              onClick={publishApp}
              disabled={appData.status === 1 ? true : false}
            >
              Publish
            </Button>
          </C.ActionContainer>

          <C.ActionContainer mb={32} justifyContent="space-between">
            <C.CustomShape bg="baseError" />
            <Box width="530px">
              <Text>{i18n.__("deleteProjectLabel")}</Text>
              <Text mt={5} fontSize="xs">
                {i18n.__("deleteProjectHelpText")}
              </Text>
            </Box>
            <Button colorStyle="error" onClick={deleteApp}>
              Delete
            </Button>
          </C.ActionContainer>
        </Flex>
      ) : (
        <Box marginTop={"50px"} height={"100vh"} bg={colors.basePrimary}>
          <Text>{i18n.__("loadingLabel")}</Text>
        </Box>
      )}
    </>
  );
};

ProjectDetails.propTypes = {
  appID: PropTypes.string.isRequired,
};

ProjectDetails.displayName = "ProjectDetails";
export default ProjectDetails;
