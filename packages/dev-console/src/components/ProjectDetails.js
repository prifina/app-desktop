import React, { useState, useMemo, useCallback, useEffect } from "react";

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

import { TagInput } from "@blend-ui/tag-input";

import {
  updateAppVersionMutation,
  deleteAppVersionMutation,
  listDataSourcesQuery,
  i18n,
} from "@prifina-apps/utils";

import { API as GRAPHQL } from "aws-amplify";

import { useLocation, useHistory } from "react-router-dom";

import PropTypes from "prop-types";
import { BlendIcon } from "@blend-ui/icons";

import * as C from "./components";

import { useToast } from "@blend-ui/toast";

import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";
import hazardSymbol from "@iconify/icons-mdi/warning";
import successTick from "@iconify/icons-mdi/tick-circle";

import UploadAsset from "./UploadAsset";
import UploadFile from "./UploadFile";

import {
  AddRemoveDataSources,
  ControlAddedDataSources,
  DataSourceForm,
  ApiForm,
} from "../components/helper";

const ProjectDetails = ({ allValues, setAllValues, setStep, ...props }) => {
  const { colors } = useTheme();

  const history = useHistory();

  const toast = useToast();

  const [newValues, setNewValues] = useState({
    newAppType: allValues.appType,
    newName: allValues.name,
    newVersion: allValues.version,
    newPublisher: allValues.publisher,
    newCategory: allValues.category,
    newDeviceSupport: allValues.deviceSupport,
    newLanguages: allValues.languages,
    newAge: allValues.age,
    newShortDescription: allValues.shortDescription,
    newLongDescription: allValues.longDescription,
    newIcon: allValues.icon,
    newDataSources: allValues.dataSources,
    newRemoteUrl: allValues.remoteUrl,
  });

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

  console.log("REAL VALUES", allValues);
  console.log("NEW VALUES", newValues);

  const saveChanges = (
    id,
    newAppType,
    newName,
    newVersion,
    newPublisher,
    newCategory,
    newDeviceSupport,
    newLanguages,
    newAge,
    newKeyFeatures,
    newShortDescription,
    newLongDescription,
    newUserHeld,
    newUserGenerated,
    newPublic,
    newIcon,
    newRemoteUrl,
    newDataSources,
  ) => {
    updateAppVersionMutation(GRAPHQL, {
      id: id,
      appType: newAppType,
      name: newName,
      nextVersion: newVersion,
      publisher: newPublisher,
      category: newCategory,
      deviceSupport: newDeviceSupport,
      languages: newLanguages,
      age: newAge,
      keyFeatures: newKeyFeatures,
      shortDescription: newShortDescription,
      longDescription: newLongDescription,
      userHeld: newUserHeld,
      userGenerated: newUserGenerated,
      public: newPublic,
      icon: newIcon,
      remoteUrl: newRemoteUrl,
      dataSources: JSON.stringify(newDataSources),
    }).then(res => {
      console.log("SUCCESS", res);
      toast.success("Project details updated", {});
      // location.reload();
      //   setStep(2);
    });
  };

  const saveDataSourceChanges = (id, newDataSources) => {
    updateAppVersionMutation(GRAPHQL, {
      id: id,
      dataSources: JSON.stringify(newDataSources),
    }).then(res => {
      console.log("SUCCESS", res);
      toast.success("Project data sources updated", {});
      // location.reload();
      //   setStep(2);
    });
  };

  const deleteApp = () => {
    deleteAppVersionMutation(GRAPHQL, allValues.id).then(res => {
      console.log("SUCCESS", res);
      // location.reload();
      toast.success("Deleted project", {});
    });
  };

  const radioButtons = () => {
    if (allValues.appType === 1) {
      return (
        <Flex flexDirection="row" alignItems="center" mr="20px">
          <Flex flexDirection="row" alignItems="center" mr="15px">
            <Radio
              fontSize="8px"
              onChange={() => {}}
              onClick={() => {
                setNewValues({ ...newValues, newAppType: 2 });
              }}
            />
            <Text fontSize="xs">{i18n.__("widget")}</Text>
          </Flex>
          <Flex flexDirection="row" alignItems="center">
            <Radio
              fontSize="10px"
              onChange={() => {}}
              checked
              onClick={() => {
                setNewValues({ ...newValues, newAppType: 1 });
              }}
            />
            <Text fontSize="xs">Application</Text>
          </Flex>
        </Flex>
      );
    } else if (allValues.appType === 2) {
      return (
        <Flex flexDirection="row" alignItems="center" mr="20px">
          <Flex flexDirection="row" alignItems="center" mr="15px">
            <Radio
              checked
              fontSize="10px"
              onChange={() => {}}
              value="1"
              onClick={() => {
                setNewValues({ ...newValues, newAppType: 2 });
              }}
            />
            <Text fontSize="xs">{i18n.__("widget")}</Text>
          </Flex>
          <Flex flexDirection="row" alignItems="center">
            <Radio
              fontSize="10px"
              onChange={() => {}}
              value="2"
              onClick={() => {
                setNewValues({ ...newValues, newAppType: 1 });
              }}
            />
            <Text fontSize="xs">Application</Text>
          </Flex>
        </Flex>
      );
    }
  };

  const detailsSaveStatus = () => {
    if (
      allValues.name !== newValues.newName ||
      allValues.appType !== newValues.newAppType ||
      allValues.version !== newValues.newVersion ||
      allValues.publisher !== newValues.newPublisher ||
      allValues.category !== newValues.newCategory ||
      allValues.deviceSupport !== newValues.newDeviceSupport ||
      allValues.languages !== newValues.newLanguages ||
      allValues.age !== newValues.newAge ||
      allValues.keyFeatures !== newKeyFeatures ||
      allValues.shortDescription !== newValues.newShortDescription ||
      allValues.longDescription !== newValues.newLongDescription ||
      allValues.userHeld !== newUserHeld ||
      allValues.userGenerated !== newUserGenerated ||
      allValues.public !== newPublic ||
      allValues.icon !== newValues.newIcon ||
      allValues.dataSources !== newDataSources
    ) {
      return (
        <Flex alignItems="center">
          <BlendIcon
            size="18px"
            iconify={hazardSymbol}
            className="icon"
            color="orange"
          />
          <Text fontSize="xs" ml={5} color="#EDA436">
            Unsaved Changes
          </Text>
          <Button
            ml="15px"
            onClick={() => {
              saveChanges(
                allValues.id,
                newValues.newAppType,
                newValues.newName,
                newValues.newVersion,
                newValues.newPublisher,
                newValues.newCategory,
                newValues.newDeviceSupport,
                newValues.newLanguages,
                newValues.newAge,
                newKeyFeatures,
                newValues.newShortDescription,
                newValues.newLongDescription,
                newUserHeld,
                newUserGenerated,
                newPublic,
                newValues.newIcon,
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
          <Text fontSize="xs">No Unsaved Changes</Text>
          <Button disabled colorStyle="red" ml="15px">
            Save Changes
          </Button>
        </Flex>
      );
    }
  };

  console.log("all", allValues);

  const passAssetInfo = title => {
    console.log("pass", title);

    setNewValues({
      ...newValues,
      newIcon: allValues.id + "-" + "icon" + "-" + title,
    });
  };

  useEffect(() => {
    if (allValues.version !== newValues.newVersion) {
      return console.log("true");
    } else {
      return console.log("false");
    }
  }, [newValues.newVersion]);

  useEffect(() => {
    if (
      allValues.name !== newValues.newName ||
      allValues.appType !== newValues.newAppType
    ) {
      return console.log("true");
    } else {
      return console.log("false");
    }
  }, [newValues.newName, newValues.newAppType]);

  const [activeTab3, setActiveTab3] = useState(0);

  const tabClick3 = (e, tab) => {
    console.log("Click", e);
    console.log("TAB", tab);
    setActiveTab3(tab);
  };

  //---------------------------------------------------------

  const [newDataSources, setNewDataSources] = useState(allValues.dataSources);
  console.log("new data sources", newDataSources);

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
    setDataSourcePreview(newSourceData);
  };

  const removeDataSource = index => {
    const newSourceData = [...dataSourcePreview];
    newSourceData.splice(index, 1);
    setDataSourcePreview(newSourceData);
  };

  const completeDataSource = index => {
    // const newSourceData = [...dataSourcePreview];
    const newSourceData = [...dataSourcePreview];

    // newSourceData[index].isAdded = true;
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

  const [newKeyFeatures, setNewKeyFeatures] = useState(
    allValues.keyFeatures === null || undefined ? [] : allValues.keyFeatures,
  );
  const [newUserHeld, setNewUserHeld] = useState(
    allValues.userHeld === null || undefined ? [] : allValues.userHeld,
  );
  const [newUserGenerated, setNewUserGenerated] = useState(
    allValues.userGenerated === null || undefined
      ? []
      : allValues.userGenerated,
  );
  const [newPublic, setNewPublic] = useState(
    allValues.public === null || undefined ? [] : allValues.public,
  );

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

  return (
    <>
      <Flex flexDirection="column">
        <C.ActionContainer
          mt={10}
          mb={24}
          style={{ top: 65, position: "sticky" }}
        >
          <C.CustomShape bg="brandAccent" />
          <BlendIcon
            style={{ cursor: "pointer" }}
            color={colors.textPrimary}
            iconify={mdiArrowLeft}
            width="24px"
            onClick={() => {
              setStep(2);
            }}
          />
          <Input
            width="200px"
            name="newName"
            defaultValue={allValues.name}
            onChange={handleValueChange}
          />
          <Flex>
            {radioButtons()}
            {detailsSaveStatus()}
          </Flex>
          <Button
            onClick={() => {
              history.push({
                pathname: "/sandbox",
                state: { allValues: allValues },
              });
            }}
          >
            Launch Sandbox
          </Button>
        </C.ActionContainer>
        <C.ProjectContainer mb={24}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text style={{ textTransform: "uppercase" }}>
              Project resources
            </Text>
          </Flex>
          <Box width="584px">
            <Text fontSize="xs">
              Add your .Zip build deployment package and information regarding
              your apps data useage here to prepare for handoff to a nominated
              publisher account.
            </Text>
          </Box>
          <Divider mb={24} mt={24} color={colors.textMuted} />
          <Text mb={24}>Build deployment</Text>

          <Flex mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                App ID
              </Text>
              <Input
                disabled
                width="451px"
                label="text"
                value={allValues.id}
                color={colors.textPrimary}
                style={{ background: "transparent" }}
              />
            </Box>
          </Flex>
          <Box mb={16}>
            <Text fontSize="sm" mb={5}>
              Version number
            </Text>
            <Flex alignItems="center">
              <Input
                onFocus={handleFocusColor}
                onBlur={handleBlurColor}
                label="text"
                name="newVersion"
                defaultValue={allValues.version || "undefined"}
                onChange={handleValueChange}
                color={colors.textPrimary}
                style={{
                  background: "transparent",
                  minWidth: "451px",
                  width: 451,
                }}
              />
              <Text fontSize="xs" ml={25} color={fontColor}>
                This version number is for your internal use so can follow
                whatever logic you choose.
              </Text>
            </Flex>
          </Box>

          <Flex alignItems="center" justifyContent="center" mb={16}>
            <Box ml="5px">
              <Text fontSize="sm" mb={5}>
                Build deployment package
              </Text>
              <UploadFile widgetId={allValues.id} />
            </Box>
            <Box ml={25}>
              <Text fontSize="xs" color={colors.textMuted}>
                The build deployment package is a package version of your local
                build. It must include:
              </Text>
              <Text fontSize="xs" color={colors.textMuted}>
                1. Your Prifina App ID
              </Text>
              <Text fontSize="xs" color={colors.textMuted}>
                2. Come in a .zip with a maximum file size of 5MB
              </Text>
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Remote Link
              </Text>
              <Input
                width="451px"
                label="text"
                name="newRemoteUrl"
                defaultValue={allValues.remoteUrl}
                onChange={handleValueChange}
                color={colors.textPrimary}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Native Assets
              </Text>
            </Box>

            {/*  Only one asset??? */}
            <UploadAsset variant="native" id={allValues.id} />
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Publisher
              </Text>
              <Input
                width="451px"
                label="text"
                name="newPublisher"
                defaultValue={allValues.publisher}
                onChange={handleValueChange}
                color={colors.textPrimary}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Category
              </Text>
              <Input
                width="451px"
                label="text"
                name="newCategory"
                defaultValue={allValues.category}
                onChange={handleValueChange}
                color={colors.textPrimary}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Short Description
              </Text>
              <TextArea
                expand
                height={50}
                width="451px"
                label="text"
                name="newShortDescription"
                defaultValue={allValues.shortDescription}
                onChange={handleValueChange}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Long Description
              </Text>
              <TextArea
                expand
                height={100}
                width="451px"
                label="text"
                name="newLongDescription"
                defaultValue={allValues.longDescription}
                onChange={handleValueChange}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Key Features
              </Text>
              <TagInput
                tags={newKeyFeatures}
                setTags={setNewKeyFeatures}
                style={{
                  background: colors.baseTertiary,
                }}
              />
            </Box>
          </Flex>

          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                User Held
              </Text>
              <TagInput
                tags={newUserHeld}
                setTags={setNewUserHeld}
                style={{ backgroundColor: colors.baseTertiary }}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                User Generated
              </Text>
              <TagInput
                tags={newUserGenerated}
                setTags={setNewUserGenerated}
                style={{ backgroundColor: colors.baseTertiary }}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Public
              </Text>
              <TagInput
                tags={newPublic}
                setTags={setNewPublic}
                style={{ backgroundColor: colors.baseTertiary }}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Device support
              </Text>
              <Input
                width="451px"
                label="text"
                name="newDeviceSupport"
                defaultValue={allValues.deviceSupport}
                onChange={handleValueChange}
                color={colors.textPrimary}
                style={
                  {
                    // background: "transparent",
                  }
                }
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Languages
              </Text>
              <Input
                width="451px"
                label="text"
                name="newLanguages"
                defaultValue={allValues.languages}
                onChange={handleValueChange}
                color={colors.textPrimary}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Age
              </Text>
              <Input
                width="451px"
                label="text"
                name="newAge"
                defaultValue={allValues.age}
                onChange={handleValueChange}
                color={colors.textPrimary}
              />
            </Box>
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Icon
              </Text>
            </Box>
            <UploadAsset
              id={allValues.id}
              type="icon"
              numId="1"
              passAssetInfo={passAssetInfo}
            />
          </Flex>
          <Flex alignItems="flex-end" mb={16}>
            <Box>
              <Text fontSize="sm" mb={5}>
                Screenshot
              </Text>
            </Box>
            <UploadAsset
              id={allValues.id}
              type="screenshot"
              numId="1"
              // passAssetInfo={passAssetInfo}
            />
            <UploadAsset
              id={allValues.id}
              type="screenshot"
              numId="2"
              // passAssetInfo={passAssetInfo}
            />
            <UploadAsset
              id={allValues.id}
              type="screenshot"
              numId="3"
              // passAssetInfo={passAssetInfo}
            />
          </Flex>
        </C.ProjectContainer>
        {/* <C.ProjectContainer alt="dataSources" mb={24}>
          <Flex justifyContent="space-between" alignItems="center" mb={25}>
            <Text style={{ textTransform: "uppercase" }}>Data sources</Text>
          </Flex>
        </C.ProjectContainer> */}
        <C.ProjectContainer alt="dataSources" mb={24}>
          <Flex justifyContent="space-between" alignItems="center" mb={45}>
            <Text style={{ textTransform: "uppercase" }}>Data sources</Text>
          </Flex>
          <Flex>
            <div
              style={{
                overflow: "hidden",
                width: 600,
              }}
            >
              <Tabs
                activeTab={activeTab3}
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
                                      completeDataSource={completeDataSource}
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
                          <Text>{i18n.__("noDataText")}</Text>
                          <Link href="www.prifina.com">
                            {i18n.__("learnMoreHere")}
                          </Link>
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
                Let us know how your application uses data by logging your
                sources (or lack of) here.
              </Text>
              <Text mt="15px" fontSize="13px">
                This information helps us provide quality support and helps
                direct our product roadmap.
              </Text>
            </Box>
          </Flex>

          {newDataSources !== null &&
          newDataSources[0] !== "[]" &&
          newDataSources.length !== 0 ? (
            <Flex flexDirection="column" justifyContent="center">
              {checkJson(newDataSources)
                ? JSON.parse(newDataSources).map((item, index) => (
                    <ControlAddedDataSources
                      key={index}
                      dataSource={item}
                      uncompleteDataSource={uncompleteDataSource}
                      editControled={editControled}
                    />
                  ))
                : newDataSources.map((item, index) => (
                    <ControlAddedDataSources
                      key={index}
                      dataSource={item}
                      uncompleteDataSource={uncompleteDataSource}
                      editControled={editControled}
                    />
                  ))}
            </Flex>
          ) : (
            <Flex flexDirection="column" justifyContent="center">
              <Text mt="20px" mb="20px">
                Data sources used in your project
              </Text>
              <Flex
                style={{
                  border: "1px dashed #BC31EA",
                  width: 684,
                  height: 132,
                  borderRadius: 4,
                  background: "#F7DEFF",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text fontSize="lg" color="#BC31EA">
                  Search and select data sources
                </Text>
                <Text mt="10px" color="#BC31EA">
                  Data sources you add will show up here
                </Text>
              </Flex>
            </Flex>
          )}
        </C.ProjectContainer>

        <C.ActionContainer mb={32} justifyContent="space-between">
          <C.CustomShape bg="baseError" />
          <Box width="530px">
            <Text>DELETE PROJECT</Text>
            <Text mt={5} fontSize="xs">
              Choose this to delete your project and all data associated with
              your account. This operation is final and all data will be
              permanently lost.
            </Text>
          </Box>
          <Button colorStyle="error" onClick={deleteApp}>
            Delete
          </Button>
        </C.ActionContainer>
      </Flex>
    </>
  );
};

ProjectDetails.propTypes = {
  allValues: PropTypes.instanceOf(Object),
};

ProjectDetails.displayName = "ProjectDetails";
export default ProjectDetails;
