import React, { useState, useRef, useEffect, useReducer, useLayoutEffect } from "react";

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

import { useToast } from "@blend-ui/toast";


// remove this later...
//import { ToastContextProvider } from "@blend-ui/toast";


import { BlendIcon } from "@blend-ui/icons";

import styled from "styled-components";

import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";


import { useTranslate, useStore, useGraphQLContext } from "@prifina-apps/utils";

import shallow from "zustand/shallow";

import { useNavigate, useLocation } from "react-router-dom";

import { prifinaAppTypes } from "../components/Projects";

import SandboxDetails from "../components/SandboxDetails";
import ApplicationPackageDetails from "../components/ApplicationPackageDetails";

import MarketPlaceListingDetails from "../components/MarketPlaceListingDetails";
import DataSourcesSurvey from "../components/DataSourcesSurvey";
import DeleteProject from "../components/DeleteProject";
import PublishProject from "../components/PublishProject";
import PropTypes from "prop-types";

export const CustomShape = styled(Box)`
  width: 5px;
  height: 60px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background: ${props => props.bg};
  position: absolute;
  left: 0;
`;

export const ActionContainer = styled(Flex)`
  width: 1008px;
  min-height: 90px;
  border-radius: 15px;
  background: ${props => props.theme.colors.baseMuted};
  // position: sticky;
  // top: 65px;
  // z-index: 1;
  align-items: center;
  padding-right: 25px;
  padding-left: 25px;
  justify-content: space-between;
`;

export const ProjectContainer = styled(Box)`
  width: 1008px;
  // min-height: 491px;

  border-radius: 15px;
  background: ${props => props.theme.colors.baseMuted};

  padding: 24px 40px 24px 40px;
`;


export const InnerContainer = styled(Box)`
  width: 100%;
  border: 1px solid #393838;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const FieldContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 40px;
`;


export const CustomSelect = styled.select`
  border-radius: 8px;
  border: 1px solid: #6B6669;
  color: #F5F8F7DE;
  padding: 5px;
  font-size: 12px;
  background: transparent;
  height: 32px;
  width: 450px;
  outline: none;
  cursor:pointer;

`;


let timer;

export function useTagInputValues(initialState, cb) {
  const [list, setList] = useState(initialState);

  return [
    list,
    function (item) {
      cb(item(list)); // callback function to handle possible onChange events...
      setList(item(list));

    },
  ];
}

const ProjectDetails = props => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { __ } = useTranslate();

  const toast = useToast();


  const { pathname } = useLocation();

  const appID = pathname.split("/")[2];
  //console.log("PATH", pathname);
  const inputRefs = useRef({});
  const modifiedRefs = useRef({});
  const changedRefs = useRef([]);
  //const [appType, setAppType] = useState(2);

  const [loading, setLoading] = useState(true);

  const [isChanged, setIsChanged] = useState(0);

  const { S3Storage } = useGraphQLContext();


  const { listDataSourcesQuery, deleteAppVersionMutation, updateAppVersionMutation,
    getAppVersionQuery
  } = useStore(
    state => ({
      listDataSourcesQuery: state.listDataSourcesQuery,
      deleteAppVersionMutation: state.deleteAppVersionMutation,
      updateAppVersionMutation: state.updateAppVersionMutation,
      getAppVersionQuery: state.getAppVersionQuery
    }),
    shallow,
  );

  const dataSources = useRef({ public: [], prifina: [] });

  const appRef = useRef()
  const effectCalled = useRef(false);

  const sandboxArgs = {
    id: "p-remoteUrl",
    name: "p-remoreUrl",
    ref: useRef(),
    options: {
      value: () => {
        return inputRefs.current['p-remoteUrl'].value;
      },
      appID: appID
    },
    inputState: (input, validation = false) => {
      console.log("INPUT STATE UPDATE", input);
      console.log("STATE UPDATE", input);
      console.log("STATE UPDATE", input.id);
      console.log("STATE UPDATE", input.value);
      inputRefs.current[input.id].value = input.value;
      /*
      console.log("USER", inputRefs?.username);
      if (typeof input !== 'undefined') {
        if (inputRefs?.username === undefined) {
          //console.log("SET INPUT REF ", input.id)
          inputRefs[input.id] = input
        }

        if (validation) {
          // console.log("USER2 ", inputRefs?.username.value);
          if (inputRefs['username'].value.length < config.usernameLength) {
            // console.log("USER3 ", inputRefs?.username.value.length);
            setStateCheck({ username: false })
            return false;
          } else {
            setStateCheck({ username: true })
            return true;
          }
        } else {
          setStateCheck({ username: input.dataset['isvalid'] })

        }
        console.log("INPUT REF ", inputRefs)
      } else {
        setStateCheck({ username: false })
      }
      */
    }
  }

  const applicationPackageArgs = {
    fields: {

      nextVersion: 'p-nextVersion',
      id: 'p-id'

    },
    inputRefs: {},
    options: {
      defaults: {
        id: () => {
          return inputRefs.current['p-id'].value;
        },
        nextVersion: () => {
          return inputRefs.current['p-nextVersion'].value;
        },
      }
    },
    inputState: (input, validation = false) => {
      console.log("STATE UPDATE", input);
      console.log("STATE UPDATE", input.id);
      console.log("STATE UPDATE", input.value);
      inputRefs.current[input.id].value = input.value;

    }
  }

  class OptionDefaults {
    constructor(defKeys) {

      defKeys.forEach(k => {
        this[k] = () => {
          return inputRefs.current['p-' + k].value;
        }
      })
    }
  }

  //const testDefs = new OptionDefauls(['a', 'b']);
  //console.log("TESTING ", testDefs.a())
  const marketPlaceListingDefaults = ['publisher', 'languages', 'deviceSupport', 'category', 'age',
    'title', 'shortDescription', 'longDescription', 'keyFeatures', 'public',
    'userHeld', 'userGenerated', 'id', 'icon', 'screenshots'];
  const marketPlaceListingArgs = {
    options: {
      defaults: new OptionDefaults(marketPlaceListingDefaults)

    },
    parentInputState: (input, validation = false) => {
      console.log("STATE UPDATE", input);
      console.log("STATE UPDATE", input.id);
      console.log("STATE UPDATE", input.value);
      inputRefs.current[input.id].value = input.value;
      if (input?.force !== undefined && input.force) {
        setIsChanged((prev) => prev + 1);
      }

    }
  }
  const dataSourcesArgs = {
    options: {
      defaults: {
        dataSources: () => {
          console.log("DATASOURCES ", inputRefs.current);
          return inputRefs.current['p-dataSources'].value;
        },

      }

    },
    inputState: (input, validation = false) => {
      console.log("STATE UPDATE", input);
      console.log("STATE UPDATE", input.id);
      console.log("STATE UPDATE", input.value);
      inputRefs.current[input.id].value = input.value;

    }
  }
  const checkChanged = () => {
    //console.log("INPUT ", inputRefs.current);
    //console.log("MOD ", JSON.stringify(modifiedRefs.current));
    //console.log("CUR ", currentProject);

    //
    console.log("CHECK CHANGED --->");
    const keys = Object.keys(inputRefs.current);
    if (keys.length > 0) {
      const check = keys.some(k => {
        //console.log("CHECKING --->", new Date(), k, inputRefs.current[k].value, modifiedRefs.current[k].value);
        // console.log("CHECKING2 --->", test);
        /*
        if (modifiedRefs.current?.[k] === undefined) {
          modifiedRefs.current[k] = { value: inputRefs.current[k].value };
          return false;
        }
        */
        //if (inputRefs.current[k].value !== modifiedRefs.current[k].value || (inputRefs.current[k].value === modifiedRefs.current[k].value && currentProject[k.substring(2)] !== inputRefs.current[k].value)) {
        if ((typeof inputRefs.current[k].value !== "object" && inputRefs.current[k].value !== modifiedRefs.current[k].value) || (typeof inputRefs.current[k].value === "object" && JSON.stringify(inputRefs.current[k].value) !== JSON.stringify(modifiedRefs.current[k].value))) {

          console.log("CHANGED --->", k, inputRefs.current[k].value, modifiedRefs.current[k]);
          modifiedRefs.current = JSON.parse(JSON.stringify(inputRefs.current));
          changedRefs.current.push(k);
          setIsChanged((prev) => prev + 1);
          return true;
        } else {
          return false
        }
      })
    }

  }
  useEffect(() => {


    async function initDetails() {
      effectCalled.current = true;

      const appVersion = await getAppVersionQuery({ id: appID });
      //console.log("RESULT ", result)
      //const currentApp = result.data.getAppVersion;
      ['status', 'name', 'appType', 'remoteUrl', 'nextVersion', 'id',
        'publisher', 'languages', 'deviceSupport', 'category',
        'age', 'title', 'shortDescription', 'longDescription', 'keyFeatures',
        'public', 'userHeld', 'userGenerated', 'icon', 'screenshots', 'dataSources'].forEach(fld => {
          const data = appVersion.data.getAppVersion;

          if (fld === "screenshots" && (data?.screenshots === undefined || data.screenshots === null)) {
            inputRefs.current['p-screenshots'] = { value: ["", "", ""] };
          } else if (["dataSources", "userGenerated", "public", "userHeld", "keyFeatures"].indexOf(fld) !== -1 && (data?.[fld] === undefined || data[fld] === null)) {
            // just empty array..
            inputRefs.current['p-' + fld] = { value: [] };
          } else if (fld === "dataSources") {
            // this is AWSJSON type... 
            inputRefs.current['p-' + fld] = { value: JSON.parse(data[fld]) };
          } else {
            inputRefs.current['p-' + fld] = { value: data[fld] };
          }
        })

      /*
      inputRefs.current['p-status'] = { value: 0 };
      inputRefs.current['p-name'] = { value: "Testing" };
      inputRefs.current['p-appType'] = { value: prifinaAppTypes.WIDGET };
      inputRefs.current['p-remoteUrl'] = { value: "https://something.qqq" };
      inputRefs.current['p-nextVersion'] = { value: "0.0.1" };
      inputRefs.current['p-id'] = { value: "xxxxyyyyzzzzz" };
      inputRefs.current['p-publisher'] = { value: "Publisher xxx" };
      inputRefs.current['p-languages'] = { value: "en" };
      inputRefs.current['p-deviceSupport'] = { value: "Desktop devices" };
      inputRefs.current['p-category'] = { value: "Other" };
      inputRefs.current['p-age'] = { value: "3+" };

      inputRefs.current['p-title'] = { value: "my title" };
      inputRefs.current['p-shortDescription'] = { value: "short descr" };
      inputRefs.current['p-longDescription'] = { value: "long descr" };
      inputRefs.current['p-keyFeatures'] = { value: ["feature-1"] };
      inputRefs.current['p-public'] = { value: ["public-1"] };
      inputRefs.current['p-userHeld'] = { value: ["userHeld-1"] };
      inputRefs.current['p-userGenerated'] = { value: ["userGenerated-1"] };
      inputRefs.current['p-icon'] = { value: "assets/icon-1.png" }
      inputRefs.current['p-screenshots'] = { value: ["", "", ""] };
      inputRefs.current['p-dataSources'] = { value: ["garmin"] };
      */

      //modifiedRefs.current = Object.assign({}, inputRefs.current);
      console.log("MOD INIT ");
      modifiedRefs.current = JSON.parse(JSON.stringify(inputRefs.current));
      //sandboxArgs.options.value = "https://something.qqq";
      //modifiedRefs.current['p-appType'] = { value: prifinaAppTypes.WIDGET };

      const listSources = await listDataSourcesQuery({
        filter: { sourceType: { lt: 4 } },
      })
      listSources.data.listDataSources.items.forEach(s => {
        switch (s.sourceType) {
          case 1:
          case 2:
            dataSources.current.prifina.push(s);
            break;
          case 3:
            dataSources.current.public.push(s);
            break;

        }
      })
      setLoading(false);
      timer = setInterval(checkChanged, 5000);

    }

    if (!effectCalled.current) {
      initDetails();
    }
    return () => {
      //console.log("EFFECT RETURN.... ", timer, timer === undefined);
      if (timer) {
        //console.log("TIMER CLEARED --->", effectCalled, timer)
        clearInterval(timer);
      }
    };
  }, [appID]);

  const deleteApp = () => {

    deleteAppVersionMutation({ id: inputRefs.current['p-id'].value }).then(res => {
      console.log("DELETED ", inputRefs.current);
      navigate("/projects", { replace: true })
    });
  };

  const publishApp = () => {

    updateAppVersionMutation({ id: inputRefs.current['p-id'].value, status: 1 }).then(res => {
      console.log("PUBLISHED ", inputRefs.current);
      navigate("/projects", { replace: true })
    });
  };

  const updateApp = () => {

    console.log("UPDATE APP ", changedRefs.current);
    const updateThis = { id: inputRefs.current['p-id'].value };
    if (changedRefs.current.length > 0) {
      changedRefs.current.forEach(k => {
        const key = k.substring(2);
        if (key === "dataSources") {
          updateThis[key] = JSON.stringify(inputRefs.current[k].value);
        } else {
          updateThis[key] = inputRefs.current[k].value
        }


      });
      console.log("UPDATE APP ", updateThis);

      updateAppVersionMutation(updateThis).then(res => {
        console.log("UPDATED... ", res);
        changedRefs.current = [];
        setIsChanged(0);
        toast.success(inputRefs.current['p-name'].value + " updated...", {});
      });
    }

  }

  return (
    <>
      {!loading && <>
        <Box style={{ minHeight: "100vh", height: "100%", background: "#1E1D1D" }}>
          <Box>
            <ActionContainer
              mt={10}
              mb={24}
              style={{
                top: 65,
                position: "sticky",
                outline: 2,
                boxShadow: `0px 15px 20px ${colors.basePrimary}`,
              }}
            >
              <CustomShape bg="brandAccent" />
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
                  id="p-name"
                  name="p-name"
                  defaultValue={inputRefs.current['p-name']?.value || ""}
                  ref={(ref) => {
                    if (ref) {
                      appRef.current = ref;
                    }
                  }}
                  onBlur={(e) => {
                    inputRefs.current['p-name'].value = appRef.current.value;
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      inputRefs.current['p-name'].value = appRef.current.value;

                    }
                  }}
                />
                <Flex ml={16}>
                  <Flex flexDirection="row" alignItems="center" mr="20px">
                    <Flex flexDirection="row" alignItems="center" mr="15px">
                      <Radio
                        fontSize="8px"
                        onChange={() => { }}
                        onClick={() => {
                          //inputRefs['p-appType'].value = prifinaAppTypes.APP;
                          inputRefs.current['p-appType'] = { value: prifinaAppTypes.APP };
                          //setState({ ['p-appType']: prifinaAppTypes.APP });
                        }}
                        checked={inputRefs.current['p-appType'].value === prifinaAppTypes.APP ? "checked" : null}
                      />
                      <Text fontSize="xs">{__("application")}</Text>
                    </Flex>
                    <Flex flexDirection="row" alignItems="center">
                      <Radio
                        fontSize="10px"
                        onChange={() => { }}
                        onClick={() => {
                          //inputRefs['p-appType'].value = prifinaAppTypes.WIDGET;
                          inputRefs.current['p-appType'] = { value: prifinaAppTypes.WIDGET };
                          //setState({ ['p-appType']: prifinaAppTypes.WIDGET })
                        }}
                        checked={inputRefs.current['p-appType'].value === prifinaAppTypes.WIDGET ? "checked" : null}
                      />
                      <Text fontSize="xs">{__("widget")}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Button disabled={!isChanged} onClick={updateApp}>Save</Button>
              {/* 
              <div style={{ color: "white" }}>{isChanged > 0 ? "CHANGED " + isChanged : ""}</div>
              */}
            </ActionContainer>
          </Box>
          <Box>
            <SandboxDetails {...sandboxArgs} />
          </Box>
          <Box>
            <ApplicationPackageDetails {...applicationPackageArgs} S3Storage={S3Storage} />
          </Box>

          <MarketPlaceListingDetails {...marketPlaceListingArgs} S3Storage={S3Storage} />

          <DataSourcesSurvey {...dataSourcesArgs} publicDatasources={dataSources.current.public} prifinaDatasources={dataSources.current.prifina} />

          <DeleteProject deleteApp={deleteApp} appName={inputRefs.current['p-name'].value} />

          <PublishProject publishApp={publishApp} appData={{ id: inputRefs.current['p-status'].value, name: inputRefs.current['p-name'].value }} />

        </Box>
      </>
      }
    </>
  );
};

ProjectDetails.displayName = "ProjectDetails";
export default ProjectDetails;
