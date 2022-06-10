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
  SearchSelect,
  AutoComplete,
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
  const location = useLocation();

  const toast = useToast();

  const handleValueChange = event => {
    let value = event.target.value;
    let name = event.target.name;

    setAllValues(prevalue => {
      return {
        ...prevalue, // Spread Operator
        [name]: value,
      };
    });
  };

  console.log("REAL VALUES", allValues);

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
    deleteAppVersionMutation(GRAPHQL, {
      id: allValues.id,
    }).then(res => {
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
                setAllValues({ ...allValues, newType: 2 });
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
                setAllValues({ ...allValues, newType: 1 });
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
                setAllValues({ ...allValues, newType: 2 });
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
                setAllValues({ ...allValues, newType: 1 });
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
      allValues.name !== allValues.newName ||
      allValues.appType !== allValues.newType
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
                allValues.newType,
                allValues.newName,
                allValues.newVersion,
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

  const resourcesSaveStatus = () => {
    if (
      allValues.version !== allValues.newVersion ||
      allValues.publisher !== allValues.newPublisher ||
      allValues.category !== allValues.newCategory ||
      allValues.deviceSupport !== allValues.newDeviceSupport ||
      allValues.languages !== allValues.newLanguages ||
      allValues.age !== allValues.newAge ||
      allValues.keyFeatures !== newKeyFeatures ||
      allValues.shortDescription !== allValues.newShortDescription ||
      allValues.longDescription !== allValues.newLongDescription ||
      allValues.userHeld !== newUserHeld ||
      allValues.userGenerated !== newUserGenerated ||
      allValues.public !== newPublic ||
      allValues.icon !== allValues.newIcon
    ) {
      return (
        <Flex alignItems="center">
          <BlendIcon
            size="18px"
            iconify={hazardSymbol}
            ///strange but fixes overlay if the icon
            style={{}}
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
                allValues.appType,
                allValues.newName,
                allValues.newVersion,
                allValues.newPublisher,
                allValues.newCategory,
                allValues.newDeviceSupport,
                allValues.newLanguages,
                allValues.newAge,
                newKeyFeatures,
                allValues.newShortDescription,
                allValues.newLongDescription,
                newUserHeld,
                newUserGenerated,
                newPublic,
                allValues.newIcon,
                allValues.newRemoteUrl,
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

  const dataSourcesSaveStatus = () => {
    if (allValues.dataSources !== newDataSources) {
      return (
        <Flex alignItems="center">
          <BlendIcon
            size="18px"
            iconify={hazardSymbol}
            ///strange but fixes overlay if the icon
            style={{}}
            className="icon"
            color="orange"
          />
          <Text fontSize="xs" ml={5} color="#EDA436">
            Unsaved Changes
          </Text>
          <Button
            ml="15px"
            onClick={() => {
              saveDataSourceChanges(allValues.id, newDataSources);
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

  const passAssetInfo = title => {
    console.log("pass", title); // LOGS DATA FROM CHILD (My name is Dean Winchester... &)

    setAllValues({
      ...allValues,
      newIcon: allValues.id + "-" + "icon" + "-" + title,
    });
  };

  useEffect(() => {
    if (allValues.version !== allValues.newVersion) {
      return console.log("true");
    } else {
      return console.log("false");
    }
  }, [allValues.newVersion]);

  useEffect(() => {
    if (
      allValues.name !== allValues.newName ||
      allValues.type !== allValues.newType
    ) {
      return console.log("true");
    } else {
      return console.log("false");
    }
  }, [allValues.newName, allValues.newType]);

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
  const addDataSource = (name, sourceType) => {
    const newSourceData = [...dataSourcePreview, { name, sourceType }];
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

  ///changing attribute name
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
            {resourcesSaveStatus()}
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
        <C.ProjectContainer alt="dataSources" mb={24}>
          <Flex justifyContent="space-between" alignItems="center" mb={25}>
            <Text style={{ textTransform: "uppercase" }}>Data sources</Text>
            {dataSourcesSaveStatus()}
          </Flex>
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
          <Button colorStyle="error" onClick={deleteApp} disabled>
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
