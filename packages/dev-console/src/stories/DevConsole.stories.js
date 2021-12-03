// /* eslint-disable react/no-multi-comp */
// import React, { useState, useEffect, useReducer } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Button,
//   Image,
//   Input,
//   SearchSelect,
//   Select,
//   useTheme,
//   Link,
//   Checkbox,
// } from "@blend-ui/core";
// import { BlendIcon } from "@blend-ui/icons";

// import { Tabs, Tab, TabList, TabPanel, TabPanelList } from "@blend-ui/tabs";

// import {
//   Modal,
//   ModalContent,
//   ModalBody,
//   ModalHeader,
//   ModalFooter,
// } from "@blend-ui/modal";

// import { i18n, AccountContext } from "@prifina-apps/utils";

// import config from "../config";

// import TermsOfUse from "../pages/TermsOfUse";

// import { PrifinaLogo } from "../components/PrifinaLogo";
// import avatarDefault from "../assets/dev-console/avatarDefault.png";

// import * as C from "../pages/dev-console/components";

// import * as D from "../pages/display-app/components";

// import dashboardBanner from "../assets/dev-console/dashboard-banner.png";

// import { ProgressBar, ProgressLabel } from "@blend-ui/progress";

// import docs from "../assets/dev-console/docs.png";
// import starterResources from "../assets/dev-console/starterResources.png";
// import slackResources from "../assets/dev-console/slackResources.png";
// import zendeskResources from "../assets/dev-console/zendeskResources.png";
// import widget from "../assets/dev-console/widget.png";

// import formPrifinaLogo from "../assets/dev-console/top-logo.png";

// import mdiPowerPlug from "@iconify/icons-mdi/power-plug";
// import mdiZipBoxOutline from "@iconify/icons-mdi/zip-box-outline";
// import copy from "@iconify/icons-mdi/content-copy";
// import mdiArrowLeft from "@iconify/icons-mdi/arrow-left";
// import bxsInfoCircle from "@iconify/icons-bx/bxs-info-circle";
// import arrowTopRightBottomLeft from "@iconify/icons-mdi/arrow-top-right-bottom-left";
// import baselineWeb from "@iconify/icons-mdi/table";
// import bxsEdit from "@iconify/icons-bx/bx-edit-alt";
// import bxsXCircle from "@iconify/icons-bx/bx-x-circle";

// import { DevConsoleLogo } from "../pages/dev-console/DevConsoleLogo";

// import CreateProjectModal from "../pages/dev-console/CreateProjectModal";

// import { useHistory } from "react-router-dom";

// //import { listAppsQuery, addAppVersionMutation } from "../graphql/api";

// //import withUsermenu from "../components/UserMenu";

// import styled, { css } from "styled-components";
// import { useTable } from "react-table";

// import Table from "../pages/dev-console/Table";

// export default { title: "Dev Console" };

// export const DevConsole = props => {
//   console.log("DEV CONSOLE PROPS ", props);
//   /* checking if user is registered as developer.... */
//   const data = [
//     {
//       name: "Holistic Health",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "25",
//       density: "402.82",
//     },
//     {
//       name: "Battleship",
//       appID: "0IVzuQpF...",
//       type: "Widget",
//       progress: "50",
//       density: "146.24",
//     },
//     {
//       name: "PopChat",
//       appID: "0IVzuQpF...",
//       type: "Widget",
//       progress: "10",
//       density: "200.72",
//     },
//     {
//       name: "Pollen Run",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "100",
//       density: "33.27",
//     },
//     {
//       name: "Sleep Master",
//       appID: "0IVzuQpF...",
//       type: "Widget",
//       progress: "20",
//       density: "3.77",
//     },
//     {
//       name: "Budget Buddy",
//       appID: "0IVzuQpF...",
//       type: "Widget",
//       progress: "80",
//       density: "3.31",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "100",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "100",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//     {
//       name: "Text",
//       appID: "0IVzuQpF...",
//       type: "Application",
//       progress: "35",
//       density: "232.17",
//     },
//   ];

//   const tabStyle = {
//     background: "#1D152C",
//     height: 37,
//     justifyContent: "center",
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     border: 0,
//     borderBottom: 0,
//     boxShadow: "0px 0px 0px 0px",
//     margin: 8,
//   };

//   const Badge = styled.span`
//     min-width: 55px;
//     height: 22px;
//     padding: 3.5px 5.5px;
//     border-radius: 20px;
//     border: ${props =>
//       props.type === "Widget" ? "1px solid #9f7aea" : "1px solid #f6ad55"};
//     background: transparent;
//     font-size: 10px;
//     line-height: 12px;
//     color: ${props => (props.type === "Widget" ? "#9f7aea" : "#f6ad55")};
//     font-weight: 700;
//     text-transform: uppercase;
//     display: flex;
//     justify-content: center;
//   `;

//   const StyledFlex = styled(Flex)`
//     background: linear-gradient(89.1deg, #61045f 43.06%, #aa076b 111.87%);
//   `;

//   const StyledBox = styled(Box)`
//     background-image: url(${formPrifinaLogo});
//     background-repeat: no-repeat;
//   `;

//   const StyledInput = styled(Input)`
//     background: #141020;
//     border: 1px solid #4b4b4b;
//     width: 361px;
//     height: 35px;
//     color: white;
//   `;
//   const StyledInput2 = styled(Input)`
//     background: #231d35;
//     border: 0;
//     width: 361px;
//     height: 35px;
//     color: #aa1370;
//   `;

//   const StyledInput3 = styled(Input)`
//     background: #141020;
//     border: 1px solid gray;
//     width: 834px;
//     height: 35px;
//     color: white;
//   `;

//   const columns = [
//     {
//       Header: "Name",
//       accessor: "name",
//       sortType: "basic",
//       Cell: props => {
//         return (
//           <Text
//             color="white"
//             onClick={() => {
//               setStep(4);
//             }}
//           >
//             {props.cell.value}
//           </Text>
//         );
//       },
//     },
//     {
//       Header: "App ID",
//       accessor: "appID",
//       sortType: "basic",
//       align: "left",
//       Cell: props => {
//         console.log(props);
//         return (
//           <span
//             style={{
//               display: "flex",
//               width: "100%",
//               textAlign: props.cell.column.align,
//             }}
//           >
//             <div style={{ paddingRight: 17 }}>{props.cell.value}</div>
//             <BlendIcon iconify={copy} />
//           </span>
//         );
//       },
//     },

//     {
//       Header: "Type",
//       accessor: "type",
//       sortType: "basic",
//       align: "center",
//       Cell: props => {
//         console.log(props);
//         return (
//           <span
//             style={{
//               display: "flex",
//               width: "119px",
//               textAlign: props.cell.column.align,
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Badge type={props.cell.value}>{props.cell.value}</Badge>
//           </span>
//         );
//       },
//     },

//     // cursor: ${props => (props.open ? "default" : "pointer")};

//     // {widget.settings && (
//     //   <IconDiv open={props.open} onClick={() => openSettings(i)}>
//     //     <BlendIcon iconify={bxCog} />
//     //   </IconDiv>
//     {
//       Header: "Progress",
//       accessor: "progress",
//       sortType: "basic",
//       align: "center",
//       Cell: props => {
//         console.log(props);
//         return (
//           <span
//             style={{
//               display: "block",
//               width: "177px",
//               textAlign: props.cell.column.align,
//             }}
//           >
//             {/* <ProgressBar
//               color="#AA1370"
//               height="8px"
//               width="116px"
//               percentage={props.cell.value}
//             ></ProgressBar> */}
//           </span>
//         );
//       },
//     },
//     {
//       Header: "Actions",
//       sortType: "basic",
//       align: "center",
//       Cell: props => {
//         console.log(props);
//         return (
//           <span
//             style={{
//               display: "block",
//               width: "177px",
//               textAlign: props.cell.column.align,
//               justifyContent: "space-between",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//               }}
//             >
//               <BlendIcon iconify={mdiPowerPlug} />
//               <BlendIcon iconify={baselineWeb} />
//               <BlendIcon iconify={mdiZipBoxOutline} />
//               <BlendIcon iconify={arrowTopRightBottomLeft} />
//             </div>
//           </span>
//         );
//       },
//     },
//     {
//       Header: "Publishing",
//       // accessor: "density",
//       sortType: "basic",
//       align: "left",
//       Cell: props => {
//         console.log(props);
//         console.log("Custom row value", props.cell.row.allCells[3].value);
//         return (
//           <span
//             style={{
//               display: "block",
//               // width: "100%",
//               textAlign: "center",
//               lineHeight: "24px",
//             }}
//           >
//             {props.cell.row.allCells[3].value === "100" ? (
//               <C.StyledButton size="xs" lineHeight="24px" minWidth="84px">
//                 {i18n.__("submit")}
//               </C.StyledButton>
//             ) : (
//               <Button size="xs" lineHeight="24px" minWidth="84px" disabled>
//                 {i18n.__("submit")}
//               </Button>
//             )}
//           </span>
//         );
//       },
//     },
//   ];

//   const CheckboxStateful = () => {
//     const [value, setValue] = useState(false);
//     return (
//       <Checkbox id="checkbox" checked={value} onChange={() => setValue(!value)}>
//         <Text color="white">My project does not require any data to run</Text>
//       </Checkbox>
//     );
//   };

//   //for sandbox
//   const [color, setColor] = useState("#1D152C");

//   const changeColor = () => {
//     const newColor = color == "#1D152C" ? "white" : "#1D152C";
//     setColor(newColor);
//   };

//   const [activeTab, setActiveTab] = useState(0);

//   const tabClick = (e, tab) => {
//     console.log("Click", e);
//     console.log("TAB", tab);
//     setActiveTab(tab);
//   };

//   const [activeTab2, setActiveTab2] = useState(0);

//   const tabClick2 = (e, tab) => {
//     console.log("Click", e);
//     console.log("TAB", tab);
//     setActiveTab2(tab);
//   };

//   const [activeTab3, setActiveTab3] = useState(0);

//   const tabClick3 = (e, tab) => {
//     console.log("Click", e);
//     console.log("TAB", tab);
//     setActiveTab3(tab);
//   };

//   const [step, setStep] = useState(0);

//   const [state, setState] = useReducer(
//     (state, newState) => ({ ...state, ...newState }),
//     {
//       username: {
//         status: false,
//         msg: "",
//         valid: false,
//         value: "",
//       },

//       termsAccepted: false,
//       emailVerified: "",
//       phoneVerified: "",
//     },
//   );

//   let menuItemColor1 = "baseWhite";
//   let menuItemColor2 = "baseWhite";
//   let menuItemColor3 = "baseWhite";

//   const [dataSource, setDataSource] = useState([]);
//   const [apiData, setApiData] = useState([]);

//   console.log("CLOUD DATA", dataSource);
//   console.log("API DATA", apiData);

//   let addedDataSources = dataSource
//     .concat(apiData)
//     .filter(key => key.isAdded == true);
//   // console.log("ADDED DATA", addedDataSources);

//   let falseDataSource = apiData.filter(key => key.isAdded == false);

//   const [addedDataSources2, setAddedDataSources2] = useState([]);

//   const [editControled, setEditControled] = useState(false);

//   ///Prifina user cloud

//   const addDataSource = (text, func, url) => {
//     const newSourceData = [...dataSource, { text, func, url }];
//     setDataSource(newSourceData);
//   };

//   const removeDataSource = index => {
//     const newSourceData = [...dataSource];
//     newSourceData.splice(index, 1);
//     setDataSource(newSourceData);
//   };

//   const completeDataSource = index => {
//     const newSourceData = [...dataSource];
//     newSourceData[index].isAdded = true;
//     setDataSource(newSourceData);
//   };

//   //////API

//   const addApiSource = text => {
//     const newSourceData = [...apiData, { text }];
//     setApiData(newSourceData);
//   };

//   const removeApiSource = index => {
//     const newSourceData = [...apiData];
//     newSourceData.splice(index, 1);
//     setApiData(newSourceData);
//   };

//   const completeApiSource = index => {
//     const newSourceData = [...apiData];
//     newSourceData[index].isAdded = true;
//     setApiData(newSourceData);
//   };

//   ////common data sources

//   const uncompleteDataSource = index => {
//     const newSourceData = [...addedDataSources];
//     newSourceData[index].isAdded = false;
//     setAddedDataSources2(newSourceData);
//   };

//   function AddRemoveDataSources({
//     dataSource,
//     index,
//     completeDataSource,
//     removeDataSource,
//   }) {
//     console.log("data source", dataSource);
//     return (
//       <Flex
//         justifyContent="space-between"
//         height="72px"
//         border="1px solid gray"
//         borderRadius="10px"
//         width="834px"
//         paddingLeft="15px"
//         paddingRight="15px"
//         marginTop="5px"
//       >
//         {dataSource.url !== undefined ? (
//           <Flex paddingTop="5px">
//             <Text mr="5px" color="white">
//               {dataSource.text}
//             </Text>

//             <Link
//               href={dataSource.url}
//               target="_blank"
//               style={{ color: "#AA1370" }}
//             >
//               Full spec here
//             </Link>
//           </Flex>
//         ) : (
//           <Flex paddingTop="5px" flexDirection="column">
//             <Text mr="5px" color="white">
//               {dataSource.text}
//             </Text>

//             <Link href="" target="_blank" style={{ color: "#AA1370" }}>
//               URL of this API
//             </Link>
//           </Flex>
//         )}
//         {dataSource.func !== undefined ? (
//           <Flex
//             style={{
//               flexDirection: "column",

//               paddingTop: 5,
//               paddingBottom: 5,
//             }}
//           >
//             <Flex
//               style={{
//                 border: "1px solid #BC31EA",
//                 borderRadius: 5.5,
//                 height: 22,
//                 width: 100,
//                 alignItems: "center",
//                 padding: 5,
//               }}
//             >
//               <Text fontSize="xs" color="#BC31EA">
//                 Data connector
//               </Text>
//             </Flex>
//             <Text color="white">
//               This Data connector contains {dataSource.func.length} functions.
//             </Text>
//           </Flex>
//         ) : (
//           <Flex
//             style={{
//               marginTop: 5,
//               padding: 5,
//               border: "1px solid #074EE8",
//               borderRadius: 5.5,
//               height: 22,
//               alignItems: "center",
//             }}
//           >
//             <Text fontSize="xs" color="blue">
//               Public API
//             </Text>
//           </Flex>
//         )}
//         <Flex>
//           <Flex alignItems="center" justifySelf="flex-end">
//             <button
//               onClick={() => completeDataSource(index)}
//               style={{ width: 50, height: 50, marginRight: 5 }}
//             >
//               <Text textStyle="h3" color="blue">
//                 +
//               </Text>
//             </button>
//             <button
//               onClick={() => removeDataSource(index)}
//               style={{ width: 50, height: 50 }}
//             >
//               <Text textStyle="h3" colorStyle="error">
//                 x
//               </Text>
//             </button>
//           </Flex>
//         </Flex>
//       </Flex>
//     );
//   }

//   function ControlAddedDataSources({
//     dataSource,
//     index,
//     uncompleteDataSource,
//   }) {
//     const theme = useTheme();

//     const [dialogOpen, setDialogOpen] = useState(false);

//     const onCloseCheck = (e, action) => {
//       console.log("MODAL CLOSE ", e, action);
//       onClose(e, action);
//       e.preventDefault();
//     };
//     return (
//       <Flex
//         justifyContent="space-between"
//         height="72px"
//         border="1px solid gray"
//         borderRadius="10px"
//         width="834px"
//         paddingLeft="15px"
//         paddingRight="15px"
//         marginTop="5px"
//       >
//         {dataSource.url !== undefined ? (
//           <Flex paddingTop="5px">
//             <Text mr="5px" color="white">
//               {dataSource.text}
//             </Text>

//             <Link
//               href={dataSource.url}
//               target="_blank"
//               style={{ color: "#AA1370" }}
//             >
//               Full spec here
//             </Link>
//           </Flex>
//         ) : (
//           <Flex paddingTop="5px" flexDirection="column">
//             <Text mr="5px" color="white">
//               {dataSource.text}
//             </Text>

//             <Link href="" target="_blank" style={{ color: "#AA1370" }}>
//               URL of this API
//             </Link>
//           </Flex>
//         )}
//         {dataSource.func !== undefined ? (
//           <Flex
//             style={{
//               flexDirection: "column",

//               paddingTop: 5,
//               paddingBottom: 5,
//             }}
//           >
//             <Flex
//               style={{
//                 border: "1px solid #BC31EA",
//                 borderRadius: 5.5,
//                 height: 22,
//                 width: 100,
//                 alignItems: "center",
//                 padding: 5,
//               }}
//             >
//               <Text fontSize="xs" color="#BC31EA">
//                 Data connector
//               </Text>
//             </Flex>
//             <Text color="white">
//               This Data connector contains {dataSource.func.length} functions.
//             </Text>
//           </Flex>
//         ) : (
//           <Flex
//             style={{
//               marginTop: 5,
//               padding: 5,
//               border: "1px solid #074EE8",
//               borderRadius: 5.5,
//               height: 22,
//               alignItems: "center",
//             }}
//           >
//             <Text fontSize="xs" color="blue">
//               Public API
//             </Text>
//           </Flex>
//         )}

//         <Flex alignItems="center">
//           <>
//             <Modal
//               isOpen={dialogOpen}
//               closeOnEsc={true}
//               closeOnOutsideClick={false}
//               onClose={onCloseCheck}
//               scrollBehavior={"inside"}
//               theme={theme}
//               {...props}
//             >
//               <ModalContent
//                 style={{
//                   background: "white",
//                   height: "412px",
//                   width: 350,
//                 }}
//               >
//                 <ModalHeader>
//                   <Flex
//                     justifyContent="space-between"
//                     paddingLeft="20px"
//                     paddingRight="20px"
//                   >
//                     <Text textStyle={"h5"}>PrifinaData Connector</Text>
//                     <BlendIcon
//                       iconify={bxsXCircle}
//                       onClick={e => {
//                         setDialogOpen(false);

//                         e.preventDefault();
//                       }}
//                     />
//                   </Flex>
//                 </ModalHeader>
//                 <ModalBody paddingLeft="20px" paddingRight="20px">
//                   <Flex display="flex" flexDirection="column">
//                     <Flex
//                       display="flex"
//                       flexDirection="row"
//                       justifyContent="center"
//                     ></Flex>
//                     <Text>Tell us what data your app uses from </Text>
//                     <Text mt="20px">Public API address</Text>
//                     <Input value={dataSource.text} disabled />
//                     <Text mt="20px">
//                       List data attributes used in your project
//                     </Text>
//                     {/* <Input style={{ height: 100 }} /> */}
//                     <textarea style={{ height: 100 }} />
//                   </Flex>
//                 </ModalBody>
//                 <ModalFooter
//                   padding="20px"
//                   justifyContent="space-between"
//                   flexDirection="row"
//                 >
//                   <C.OutlineButton
//                     variation={"outline"}
//                     colorStyle={"error"}
//                     onClick={e => {
//                       setDialogOpen(false);

//                       e.preventDefault();
//                     }}
//                   >
//                     Cancel
//                   </C.OutlineButton>
//                   <C.StyledButton
//                     onClick={e => {
//                       // setDialogOpen(false);
//                       // dataSource.push("hey");

//                       e.preventDefault();
//                     }}
//                   >
//                     Submit
//                   </C.StyledButton>
//                 </ModalFooter>
//               </ModalContent>
//             </Modal>
//           </>
//           {editControled ? (
//             <>
//               <button
//                 onClick={() => setDialogOpen(true)}
//                 style={{ width: 50, height: 50, marginRight: 5 }}
//               >
//                 {/* <Text textStyle="h3">E</Text> */}
//                 <BlendIcon iconify={bxsEdit} />
//               </button>
//               <button
//                 onClick={() => uncompleteDataSource(index)}
//                 style={{ width: 50, height: 50 }}
//               >
//                 <Text textStyle="h3" colorStyle="error">
//                   x
//                 </Text>
//               </button>
//             </>
//           ) : // <>
//           //   <button
//           //     onClick={() => setDialogOpen(true)}
//           //     style={{ width: 50, height: 50, marginRight: 5 }}
//           //   >
//           //     {/* <Text textStyle="h3">E</Text> */}
//           //     {/* <BlendIcon iconify={bxsEdit} />
//           //      */}
//           //     ...
//           //   </button>
//           // </>
//           null}
//         </Flex>
//       </Flex>
//     );
//   }

//   const selectOptions = [
//     {
//       key: "0",
//       value: "Prifina/Oura",
//       functions: ["Activity", "Sleep", "Readiness"],
//       url: "www.oura.com",
//     },
//     {
//       key: "1",
//       value: "Prifina/Fitbit",
//       functions: ["Function1", "Function2"],
//       url: "www.fitbit.com",
//     },
//     {
//       key: "2",
//       value: "Prifina/Netflix",
//       functions: [
//         "Function1",
//         "Function2",
//         "Function3",
//         "Function4",
//         "Function5",
//         "Function6",
//       ],
//       url: "www.netflix.com",
//     },
//   ];

//   function DataSourceForm({ addDataSource }) {
//     const [value, setValue] = useState("");
//     const [functions, setFunctions] = useState("");
//     const [url, setUrl] = useState("");

//     const handleSubmit = e => {
//       e.preventDefault();
//       if (!value) return;
//       addDataSource(value, functions, url);
//       setValue("");
//       setFunctions("");
//     };

//     const handleChange = event => {
//       const functionsByDataType = selectOptions.reduce(
//         (result, currentSelectOption) => ({
//           ...result,
//           [currentSelectOption.value]: currentSelectOption.functions,
//         }),
//         {},
//       );
//       const urlByDataType = selectOptions.reduce(
//         (result, currentSelectOption) => ({
//           ...result,
//           [currentSelectOption.value]: currentSelectOption.url,
//         }),
//         {},
//       );
//       console.log("SELECT", functionsByDataType[event.target.value]);
//       setValue(event.target.value);
//       setFunctions(functionsByDataType[event.target.value]);
//       setUrl(urlByDataType[event.target.value]);
//     };

//     return (
//       <form onSubmit={handleSubmit}>
//         <Flex>
//           <SearchSelect
//             // id={selectId}
//             // name={selectId}
//             // key="value"
//             variation="outline"
//             // defaultValue="000"
//             options={selectOptions}
//             defaultValue
//             searchLength={1}
//             showList={true}
//             selectOption="value"
//             size="sm"
//             width="834px"
//             // containerRef={boxRef}
//             onChange={handleChange}
//           />
//           <button
//             style={{ width: 48, height: 48, marginLeft: 4 }}
//             onChange={e => {
//               console.log("CLICK ", e.target.value);

//               setValue(e.target.value);
//             }}
//           >
//             +
//           </button>
//         </Flex>
//       </form>
//     );
//   }

//   function ApiForm({ addApi }) {
//     const [value, setValue] = useState("");

//     const handleSubmit = e => {
//       e.preventDefault();
//       if (!value) return;
//       addApi(value);
//       setValue("");
//     };

//     return (
//       <form onSubmit={handleSubmit}>
//         <Flex alignItems="center">
//           <StyledInput3
//             width="834px"
//             type="text"
//             className="input"
//             value={value}
//             onChange={e => setValue(e.target.value)}
//           />
//           <button
//             style={{ width: 48, height: 48, marginLeft: 4 }}
//             onChange={e => {
//               console.log("CLICK ", e.target.value);

//               setValue(e.target.value);
//             }}
//           >
//             +
//           </button>
//         </Flex>
//       </form>
//     );
//   }

//   switch (step) {
//     case 0:
//       break;
//     case 1:
//       break;
//     case 2:
//       break;
//     case 3:
//       break;
//     default:
//   }

//   const nextStepAction = step => {
//     console.log("ACTION STEP ", step);
//     if (step === 3) {
//       //await Auth.signOut();
//       //history.replace("/");
//       //setState({ phoneVerified: currentUser.phone_number });
//       //setRegisterStep(step);
//       //   _currentUser.termsAccepted = true;
//     } else if (step === 2) {
//       //   setState({ termsAccepted: true });
//       // setRegisterStep(step);
//       //   window.location.href = config.DEV_URL; // browser-back is /core/dev-console
//       setStep(2);
//     } else if (step === 0) {
//       // terms declined...
//       // alerts.info(i18n.__("acceptTerms"), {});
//       setStep(0);
//     }
//   };

//   const accountContext = { nextStepAction, state };

//   return (
//     <>
//       <AccountContext.Provider value={accountContext}>
//         {step === 0 && (
//           <Box
//             width={"100vw"}
//             height={"100vh"}
//             display="flex"
//             flexDirection="row"
//           >
//             <Box
//               alt="left-side"
//               minWidth="610px"
//               style={{
//                 background: "linear-gradient(180deg, #AA076B 0%, #61045F 100%)",
//               }}
//             />
//             <StyledBox alt="center" bg="black" minWidth="296px">
//               <Box alt="menu" alignContent="flex-start">
//                 <C.MenuButton mt={157}>
//                   {/* 01 {i18n.__("accountDetails")} */}
//                   01 Account Details
//                 </C.MenuButton>
//                 <C.MenuButton
//                   style={{ color: "grey", border: 0 }}
//                   onClick={() => {
//                     setStep(1);
//                   }}
//                 >
//                   {/* 02 {i18n.__("developerAgreement")} */}
//                   02 Developer Agreement
//                 </C.MenuButton>
//               </Box>
//             </StyledBox>
//             <Box
//               alt="form-container"
//               bg="#141020"
//               width="100vw"
//               display="flex"
//               flexDirection="column"
//               alignItems="center"
//             >
//               <Box mt={160} mb={40}>
//                 <Text fontSize="xl" color="white">
//                   Welcome back Jane!
//                 </Text>
//               </Box>
//               <C.DeveloperCard name="JaneDoe23" avatar={avatarDefault} />
//               <C.Card mt={42} mb={140} bg="#1D152C">
//                 <Box ml={23} mt={13} mr={23} mb={13}>
//                   <Text fontSize="md" color="white">
//                     Great News!
//                   </Text>
//                   <Text fontSize="xs" color="white" textStyle={"normal"}>
//                     Because you have an existing individual Prifina account, you
//                     can use it to log in, and we’ll connect it to your new
//                     developer account.
//                   </Text>
//                 </Box>
//               </C.Card>
//               <C.StyledButton
//                 mb={8}
//                 width="361px"
//                 onClick={() => {
//                   setStep(1);
//                 }}
//               >
//                 Continue as Jane
//               </C.StyledButton>
//               <Flex alignItems="baseline">
//                 <Text color="white" fontSize="xs" mr="5px">
//                   Not You?
//                 </Text>
//                 <C.LinkButton variation="link">Logout</C.LinkButton>
//               </Flex>
//             </Box>
//           </Box>
//         )}
//         {step === 1 && (
//           <Box
//             width={"100vw"}
//             height={"100vh"}
//             display="flex"
//             flexDirection="row"
//           >
//             <Box
//               alt="left-side"
//               minWidth="610px"
//               style={{
//                 background: "linear-gradient(180deg, #AA076B 0%, #61045F 100%)",
//               }}
//             />
//             <StyledBox alt="center" bg="black" minWidth="296px">
//               <Box alt="menu" alignContent="flex-start">
//                 <C.MenuButton
//                   mt={157}
//                   style={{ color: "grey", border: 0 }}
//                   onClick={() => {
//                     setStep(0);
//                   }}
//                 >
//                   {/* 01 {i18n.__("accountDetails")} */}
//                   01 Account Details
//                 </C.MenuButton>
//                 <C.MenuButton>
//                   {/* 02 {i18n.__("developerAgreement")} */}
//                   02 Developer Agreement
//                 </C.MenuButton>
//               </Box>
//             </StyledBox>
//             <Box
//               alt="form-container"
//               bg="brandPrimary"
//               width="100vw"
//               display="flex"
//               flexDirection="column"
//               alignItems="center"
//               bg="#141020"
//             >
//               <Box mt={92}>
//                 <TermsOfUse />
//               </Box>
//             </Box>
//           </Box>
//         )}
//         {step === 2 && (
//           <>
//             <C.DevConsoleSidebar
//               backgroundColor1="#1D152C"
//               backgroundColor2={menuItemColor2}
//               iconColor1="#aa1370"
//               borderColor1="#aa1370"
//               onClick1={() => {
//                 setStep(2);
//               }}
//               onClick2={() => {
//                 setStep(3);
//               }}
//               // onClick3={() => {
//               //   setStep(4);
//               // }}
//             />

//             <C.NavbarContainer bg="#08011C">
//               <DevConsoleLogo alignItems="center" />
//             </C.NavbarContainer>
//             <Flex
//               width="100%"
//               height="100vh"
//               paddingLeft="286px"
//               bg="white"
//               flexDirection="column"
//               bg="#141020"
//             >
//               <Flex flexDirection="column" alignItems="center" mt="42px">
//                 <Image src={dashboardBanner} style={{ position: "relative" }} />
//                 <Flex
//                   textAlign="center"
//                   width="506px"
//                   height="196px"
//                   flexDirection="column"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   position="absolute"
//                   top="243px"
//                 >
//                   <Text color="white" fontSize={24}>
//                     Create your first project
//                   </Text>
//                   <Text color="white" fontSize={20}>
//                     Done with your local build and ready to plug into the power
//                     of Prifina? Create a project to get started
//                   </Text>
//                   <C.StyledButton
//                     size="sm"
//                     onClick={() => {
//                       setStep(6);
//                       // openModal();
//                     }}
//                   >
//                     New Project
//                     {/* <BlendIcon iconify={bxsPlusCircle} size="12px" paddingLeft="10px" /> */}
//                   </C.StyledButton>
//                 </Flex>
//               </Flex>
//               <Box paddingLeft="62px" paddingTop="100px">
//                 <Text color="white" fontSize={24}>
//                   {/* {i18n.__("keyResources")} */}
//                   Key Resources
//                 </Text>
//                 <Text color="white" fontSize={16} paddingTop="8px">
//                   {/* {i18n.__("resourcesSubtitle")} */}
//                   Resources and utilities to help you build for Prifina
//                 </Text>
//                 <Flex paddingTop="35px">
//                   <Box paddingRight="42px">
//                     <C.ResourceCard
//                       src={docs}
//                       // title={i18n.__("prifinaDocs")}
//                       title="Prifina Docs"
//                       description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
//                     />
//                   </Box>
//                   <Box paddingRight="42px">
//                     <C.ResourceCard
//                       src={starterResources}
//                       // title={i18n.__("appStarter")}
//                       title="App Starter"
//                       description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
//                     />
//                   </Box>
//                   <Box paddingRight="42px">
//                     <C.ResourceCard
//                       src={zendeskResources}
//                       // title={i18n.__("zendesk")}
//                       title="Zendesk"
//                       description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
//                     />
//                   </Box>
//                   <Box>
//                     <C.ResourceCard
//                       src={slackResources}
//                       // title={i18n.__("ledSlack")}
//                       title="LED Slack"
//                       description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu."
//                     />
//                   </Box>
//                 </Flex>
//               </Box>
//             </Flex>
//           </>
//         )}
//         {step === 3 && (
//           <>
//             <C.DevConsoleSidebar
//               backgroundColor2="#1D152C"
//               iconColor2="#aa1370"
//               borderColor2="#aa1370"
//               onClick1={() => {
//                 setStep(2);
//               }}
//               onClick2={() => {
//                 setStep(3);
//               }}
//             />
//             <C.NavbarContainer bg="#08011C">
//               <DevConsoleLogo />
//             </C.NavbarContainer>

//             <Flex
//               width="100%"
//               height="100vh"
//               paddingLeft="286px"
//               bg="white"
//               flexDirection="column"
//               bg="#141020"
//             >
//               <Flex
//                 marginLeft="66px"
//                 bg="#231D35"
//                 width="1007px"
//                 height="617px"
//                 borderRadius="10px"
//                 flexDirection="column"
//                 alignItems="center"
//                 mt="48px"
//               >
//                 <Flex
//                   paddingLeft="16px"
//                   paddingTop="16px"
//                   paddingBottom="40px"
//                   justifyContent="space-between"
//                   display="flex"
//                 >
//                   <Text color="white" fontSize={24}>
//                     Projects
//                   </Text>
//                   <Box marginLeft="750px">
//                     <C.StyledButton
//                       onClick={() => {
//                         setStep(6);
//                       }}
//                       size="sm"
//                     >
//                       New Project
//                     </C.StyledButton>
//                   </Box>
//                 </Flex>
//                 <Table columns={columns} data={data} />
//               </Flex>
//             </Flex>
//           </>
//         )}
//         {step === 4 && (
//           <>
//             <C.DevConsoleSidebar
//               backgroundColor2="#1D152C"
//               iconColor2="#aa1370"
//               borderColor2="#aa1370"
//               onClick1={() => {
//                 setStep(2);
//               }}
//               onClick2={() => {
//                 setStep(3);
//               }}
//             />
//             <C.NavbarContainer bg="#08011C">
//               <DevConsoleLogo />
//             </C.NavbarContainer>
//             <Flex
//               width="100vw"
//               height="100vh"
//               paddingLeft="288px"
//               // paddingTop="48px"
//               bg="#141020"
//               // justifyContent="center"
//               flexDirection="column"
//             >
//               <Flex flexDirection="column">
//                 <Flex
//                   justifyContent="space-between"
//                   alignItems="center"
//                   paddingLeft="22px"
//                   paddingRight="24px"
//                   height="64px"
//                   bg="#1D152C"
//                 >
//                   <Flex alignItems="center">
//                     <BlendIcon
//                       color="white"
//                       iconify={mdiArrowLeft}
//                       width="24px"
//                       onClick={() => {
//                         setStep(2);
//                       }}
//                     />
//                     <Text ml="16px" color="white">
//                       Holistic Health
//                     </Text>
//                   </Flex>
//                   <Flex alignItems="center">
//                     <C.StyledButton
//                       onClick={() => {
//                         setStep(5);
//                       }}
//                       mr="17px"
//                     >
//                       Launch Sandbox
//                     </C.StyledButton>
//                     <BlendIcon
//                       iconify={bxsInfoCircle}
//                       width="13px"
//                       color="#969595"
//                     />
//                   </Flex>
//                 </Flex>
//                 <Flex
//                   // bg="brandAccent"
//                   style={{
//                     background:
//                       "linear-gradient(89.1deg, #61045F 43.06%, #AA076B 111.87%)",
//                   }}
//                   height="95px"
//                 />
//                 <div
//                   style={{
//                     overflow: "hidden",
//                     paddingTop: 38,
//                     paddingLeft: 65,
//                     paddingRight: 30,
//                     background: "#141020",
//                   }}
//                 >
//                   <Tabs
//                     activeTab={activeTab}
//                     onClick={tabClick}
//                     variant={"line"}
//                   >
//                     <TabList>
//                       <Tab
//                         style={{
//                           height: 37,
//                           justifyContent: "center",
//                           paddingTop: 5,

//                           alignItems: "center",
//                           background: "#1D152C",
//                           // margin: 8,
//                         }}
//                       >
//                         <Flex alignItems="center">
//                           <BlendIcon iconify={mdiPowerPlug} color="white" />
//                           <Text ml="8px" color="white">
//                             Sanbox Testing
//                           </Text>
//                         </Flex>
//                       </Tab>
//                       <Tab
//                         style={{
//                           height: 37,
//                           justifyContent: "center",
//                           paddingTop: 5,
//                           background: "#1D152C",

//                           // margin: 8,
//                         }}
//                       >
//                         <Flex alignItems="center">
//                           <BlendIcon iconify={baselineWeb} color="white" />
//                           <Text ml="8px" color="white">
//                             Build Assets
//                           </Text>
//                         </Flex>
//                       </Tab>
//                       <Tab
//                         style={{
//                           height: 37,
//                           justifyContent: "center",
//                           paddingTop: 5,
//                           background: "#1D152C",

//                           // margin: 8,
//                         }}
//                       >
//                         <Flex alignItems="center">
//                           <BlendIcon iconify={mdiZipBoxOutline} color="white" />
//                           <Text ml="8px" color="white">
//                             Uploads
//                           </Text>
//                         </Flex>
//                       </Tab>
//                     </TabList>
//                     <TabPanelList>
//                       <TabPanel>
//                         <div
//                           style={{
//                             overflow: "auto",
//                             background: "#1D152C",
//                             borderRadius: 10,
//                           }}
//                         >
//                           <Flex
//                             ml="41px"
//                             flexDirection="column"
//                             paddingTop="30px"
//                           >
//                             <Text color="white" fontSize="24px">
//                               Sandbox testing
//                             </Text>
//                             <Box mt="21px" width="493px" mb="49px">
//                               <Text color="white">
//                                 Finished your local build? See how your
//                                 application will behave on our platform using
//                                 our Sandbox enviroment.
//                               </Text>
//                             </Box>
//                           </Flex>

//                           <Flex
//                             style={{
//                               border: "1px solid #3F3A4F",
//                               width: 999,
//                               borderTopRightRadius: 10,
//                               borderTopLeftRadius: 10,
//                               borderBottom: 0,
//                               marginRight: 16,
//                               marginLeft: 16,
//                               paddingLeft: 32,
//                               paddingRight: 34,
//                               position: "relative",
//                             }}
//                             flexDirection="column"
//                           >
//                             <Text color="white" mt="35px">
//                               Launch Sandbox session
//                             </Text>
//                             <Flex
//                               alt="cards"
//                               flexDirection="column"
//                               style={{
//                                 position: "absolute",
//                                 right: 84,
//                                 top: -28,
//                               }}
//                             >
//                               <Flex
//                                 width="403px"
//                                 height="35px"
//                                 bg="#231D35"
//                                 borderRadius="5px"
//                                 alignItems="center"
//                                 mb="4px"
//                               >
//                                 <Text
//                                   color="white"
//                                   ml="16px"
//                                   mr="18px"
//                                   fontSize="12px"
//                                 >
//                                   1
//                                 </Text>
//                                 <Text color="white" fontSize="12px">
//                                   Copy your app ID
//                                 </Text>
//                               </Flex>
//                               <Flex
//                                 width="403px"
//                                 height="35px"
//                                 bg="#231D35"
//                                 borderRadius="5px"
//                                 alignItems="center"
//                                 mb="4px"
//                               >
//                                 <Text
//                                   color="white"
//                                   ml="16px"
//                                   mr="18px"
//                                   fontSize="12px"
//                                 >
//                                   2
//                                 </Text>
//                                 <Text color="white" fontSize="12px">
//                                   Add it to your local build
//                                 </Text>
//                               </Flex>
//                               <Flex
//                                 width="403px"
//                                 height="35px"
//                                 bg="#231D35"
//                                 borderRadius="5px"
//                                 alignItems="center"
//                                 mb="4px"
//                               >
//                                 <Text
//                                   color="white"
//                                   ml="16px"
//                                   mr="18px"
//                                   fontSize="12px"
//                                 >
//                                   3
//                                 </Text>
//                                 <Text color="white" fontSize="12px">
//                                   Get a remote link for your repo
//                                 </Text>
//                               </Flex>
//                               <Flex
//                                 width="403px"
//                                 height="35px"
//                                 bg="#231D35"
//                                 borderRadius="5px"
//                                 alignItems="center"
//                               >
//                                 <Text
//                                   color="white"
//                                   ml="16px"
//                                   mr="18px"
//                                   fontSize="12px"
//                                 >
//                                   4
//                                 </Text>
//                                 <Text color="white" fontSize="12px">
//                                   Fill out the form and launch the Sandbox
//                                 </Text>
//                               </Flex>
//                               <Flex alignItems="baseline">
//                                 <Text
//                                   mt="11px"
//                                   color="white"
//                                   fontSize="12px"
//                                   mr="2px"
//                                 >
//                                   Read a more detailed guide in the
//                                 </Text>
//                                 <Button variation="link">
//                                   <Text color="#AA1370">Prifina docs</Text>
//                                 </Button>
//                               </Flex>
//                             </Flex>
//                             <Flex mt="42px" alignItems="center" mb="19px">
//                               <Text color="white" fontSize="12px" mr="8px">
//                                 App ID
//                               </Text>
//                               <BlendIcon
//                                 iconify={bxsInfoCircle}
//                                 width="13px"
//                                 color="#969595"
//                               />
//                             </Flex>
//                             <StyledInput value="1234567890" disabled />
//                             <Flex
//                               justifyContent="space-between"
//                               mt="43px"
//                               width="748px"
//                             >
//                               <Flex flexDirection="column">
//                                 <Text mb="16px" color="white" fontSize="12px">
//                                   Project Name
//                                 </Text>
//                                 <StyledInput placeholder="Project" />
//                               </Flex>
//                               <Flex flexDirection="column">
//                                 <Text mb="16px" color="white" fontSize="12px">
//                                   Remote Link
//                                 </Text>
//                                 <StyledInput placeholder="Remote Link" />
//                               </Flex>
//                             </Flex>
//                             <Flex position="absolute" right="32px" bottom="0px">
//                               <C.StyledButton size="sm">
//                                 Launch Sanbox
//                               </C.StyledButton>
//                             </Flex>
//                           </Flex>
//                         </div>
//                       </TabPanel>
//                       <TabPanel>
//                         {/* SECOND TABS */}
//                         <div style={{ overflow: "hidden" }}>
//                           <Tabs
//                             activeTab={activeTab2}
//                             onClick={tabClick2}
//                             style={{ height: "100%" }}
//                             variant={"line"}
//                           >
//                             <TabList>
//                               <Tab>
//                                 <Text color="white">Data Usage</Text>
//                               </Tab>
//                               <Tab>
//                                 <Text color="white">Build Files</Text>
//                               </Tab>
//                             </TabList>
//                             <TabPanelList style={{ backgroundColor: null }}>
//                               <TabPanel
//                                 style={{
//                                   height: "100vh",
//                                   paddingBottom: "50px",
//                                   overflow: "auto",
//                                 }}
//                               >
//                                 <div style={{ overflow: "auto" }}>
//                                   <Text textStyle="h3" mb="15px" color="white">
//                                     Data Usage
//                                   </Text>
//                                   <Box width="470px">
//                                     <Text
//                                       textStyle="h6"
//                                       mb="15px"
//                                       color="white"
//                                     >
//                                       Sed ut perspiciatis unde omnis iste natus
//                                       error sit voluptatem accusantium
//                                       doloremque laudantium, totam rem aperiam,
//                                       eaque ipsa quae ab illo inventore
//                                       veritatis et quasi architecto beatae vitae
//                                       dicta sunt
//                                     </Text>
//                                   </Box>
//                                   {/* THIRD TABS */}
//                                   <div
//                                     style={{
//                                       overflow: "hidden",
//                                       background: "#1D152C",
//                                       paddingTop: 16,
//                                       paddingBottom: 16,
//                                       paddingLeft: 40,
//                                       paddingRight: 40,
//                                       borderRadius: 10,
//                                     }}
//                                   >
//                                     <Tabs
//                                       activeTab={activeTab3}
//                                       onClick={tabClick3}
//                                       style={{ height: "100%" }}
//                                       variant={"line"}
//                                     >
//                                       <TabList>
//                                         <Tab>
//                                           <Text color="white">Public API</Text>
//                                         </Tab>
//                                         <Tab>
//                                           <Text color="white">
//                                             Prifina User Cloud
//                                           </Text>
//                                         </Tab>
//                                         <Tab>
//                                           <Text color="white">No Data</Text>
//                                         </Tab>
//                                       </TabList>
//                                       <TabPanelList
//                                         style={{ backgroundColor: null }}
//                                       >
//                                         <TabPanel
//                                           style={{
//                                             height: "100vh",
//                                             paddingBottom: "50px",
//                                             overflow: "auto",
//                                           }}
//                                         >
//                                           <div style={{ overflow: "auto" }}>
//                                             <Flex>
//                                               <ApiForm addApi={addApiSource} />
//                                             </Flex>

//                                             {/* Box with state change */}
//                                             <Flex>
//                                               {apiData.length > 0 && (
//                                                 <Flex
//                                                   width="100%"
//                                                   flexDirection="column"
//                                                   padding="10px"
//                                                   style={{
//                                                     marginTop: 15,
//                                                     borderRadius: 10,
//                                                   }}
//                                                 >
//                                                   <Text
//                                                     textStyle="h6"
//                                                     mb="10px"
//                                                     color="white"
//                                                   >
//                                                     Choose to add you your data
//                                                     sources
//                                                   </Text>
//                                                   <Flex>
//                                                     <Flex flexDirection="column">
//                                                       {apiData.map(
//                                                         (event, index) => (
//                                                           <AddRemoveDataSources
//                                                             key={index}
//                                                             index={index}
//                                                             dataSource={event}
//                                                             removeDataSource={
//                                                               removeApiSource
//                                                             }
//                                                             completeDataSource={
//                                                               completeApiSource
//                                                             }
//                                                           />
//                                                         ),
//                                                       )}
//                                                     </Flex>
//                                                   </Flex>
//                                                 </Flex>
//                                               )}
//                                             </Flex>
//                                           </div>
//                                         </TabPanel>
//                                         <TabPanel>
//                                           <div style={{ overflow: "auto" }}>
//                                             <Flex>
//                                               <DataSourceForm
//                                                 addDataSource={addDataSource}
//                                                 // addFunctions={addFunction}
//                                               />
//                                             </Flex>
//                                             {/* Box with state change */}
//                                             <Flex>
//                                               {dataSource.length > 0 && (
//                                                 <Flex
//                                                   width="100%"
//                                                   flexDirection="column"
//                                                   padding="10px"
//                                                   style={{
//                                                     backgroundColor: "#1D152C",
//                                                     marginTop: 15,
//                                                     borderRadius: 10,
//                                                   }}
//                                                 >
//                                                   <Text
//                                                     textStyle="h6"
//                                                     mt="10px"
//                                                     mb="10px"
//                                                     color="white"
//                                                   >
//                                                     Prifina data connectors
//                                                     results...
//                                                   </Text>

//                                                   <Flex>
//                                                     <Flex flexDirection="column">
//                                                       {dataSource.map(
//                                                         (event, index) => (
//                                                           <>
//                                                             <AddRemoveDataSources
//                                                               key={index}
//                                                               index={index}
//                                                               dataSource={event}
//                                                               removeDataSource={
//                                                                 removeDataSource
//                                                               }
//                                                               completeDataSource={
//                                                                 completeDataSource
//                                                               }
//                                                             />
//                                                             <div>
//                                                               {event.functions}
//                                                             </div>
//                                                           </>
//                                                         ),
//                                                       )}
//                                                     </Flex>
//                                                   </Flex>
//                                                 </Flex>
//                                               )}
//                                             </Flex>
//                                           </div>
//                                         </TabPanel>
//                                         <TabPanel>
//                                           <div style={{ overflow: "auto" }}>
//                                             <Flex>
//                                               <Box
//                                                 width="426px"
//                                                 height="76px"
//                                                 borderRadius="6px"
//                                                 border="2px solid #074EE8"
//                                                 paddingLeft="10px"
//                                                 bg="#E0EAFF"
//                                               >
//                                                 <Text>
//                                                   A 'no data' project does not
//                                                   pull any data from any source.
//                                                 </Text>
//                                                 <Link>Learn more here.</Link>
//                                               </Box>
//                                               <Flex ml="10px">
//                                                 <CheckboxStateful />
//                                               </Flex>
//                                             </Flex>
//                                           </div>
//                                         </TabPanel>
//                                       </TabPanelList>
//                                     </Tabs>
//                                   </div>
//                                   <Flex
//                                     flexDirection="column"
//                                     width="100%"
//                                     justifyContent="center"
//                                     padding="15px"
//                                     paddingLeft="40px"
//                                     paddingRight="40px"
//                                     style={{
//                                       backgroundColor: "#1D152C",
//                                       marginTop: 15,
//                                       borderRadius: 10,
//                                     }}
//                                   >
//                                     {addedDataSources.length > 0 ? (
//                                       <>
//                                         <Flex justifyContent="space-between">
//                                           <Text
//                                             textStyle="h6"
//                                             mb="10px"
//                                             color="white"
//                                           >
//                                             Data sources used in your project
//                                           </Text>
//                                           {!editControled ? (
//                                             <>
//                                               <button
//                                                 style={{
//                                                   position: "absolute",

//                                                   right: 45,
//                                                   width: 40,
//                                                   height: 40,
//                                                   border: 0,
//                                                   background: "transparent",
//                                                 }}
//                                                 onClick={() => {
//                                                   // if(editControled===false)
//                                                   setEditControled(true);
//                                                 }}
//                                               >
//                                                 {/* <Text textStyle="h3">E</Text> */}
//                                                 <BlendIcon
//                                                   iconify={bxsEdit}
//                                                   color="white"
//                                                 />
//                                               </button>
//                                             </>
//                                           ) : (
//                                             <Flex>
//                                               <C.OutlineButton
//                                                 onClick={() => {
//                                                   // if(editControled===false)
//                                                   setEditControled(false);
//                                                 }}
//                                                 size="xs"
//                                               >
//                                                 Cancel
//                                               </C.OutlineButton>
//                                               <C.StyledButton
//                                                 onClick={() => {
//                                                   // if(editControled===false)
//                                                   setEditControled(false);
//                                                 }}
//                                                 size="xs"
//                                                 ml="5px"
//                                               >
//                                                 Save
//                                               </C.StyledButton>
//                                             </Flex>
//                                           )}
//                                         </Flex>
//                                         <Flex
//                                           width="100%"
//                                           flexDirection="column"
//                                           style={{
//                                             backgroundColor: "#1D152C",
//                                             marginTop: 15,
//                                             borderRadius: 10,
//                                           }}
//                                         >
//                                           <Flex>
//                                             <Flex
//                                               flexDirection="column"
//                                               justifyContent="center"
//                                             >
//                                               {addedDataSources.map(
//                                                 (event, index) => (
//                                                   <ControlAddedDataSources
//                                                     key={index}
//                                                     index={index}
//                                                     dataSource={event}
//                                                     uncompleteDataSource={
//                                                       uncompleteDataSource
//                                                     }
//                                                   />
//                                                 ),
//                                               )}
//                                             </Flex>
//                                           </Flex>
//                                           <Flex
//                                             flexDirection="column"
//                                             alignSelf="flex-start"
//                                             mt="20px"
//                                           >
//                                             <Text mb="10px" color="white">
//                                               {!editControled
//                                                 ? "Press edit to add more details about data usage"
//                                                 : "Add your comment..."}
//                                             </Text>
//                                             <textarea
//                                               style={{
//                                                 resize: "none",
//                                                 width: 750,
//                                                 height: 100,
//                                               }}
//                                               disabled={
//                                                 !editControled ? true : false
//                                               }
//                                             />
//                                           </Flex>
//                                         </Flex>
//                                       </>
//                                     ) : (
//                                       <Flex
//                                         flexDirection="column"
//                                         alignItems="center"
//                                         justifyContent="center"
//                                       >
//                                         <Flex justifyContent="space-between">
//                                           <Text
//                                             textStyle="h6"
//                                             mb="10px"
//                                             color="white"
//                                           >
//                                             Data sources used in your project
//                                           </Text>
//                                         </Flex>
//                                         <Flex
//                                           width="100%"
//                                           flexDirection="column"
//                                           alignItems="center"
//                                           justifyContent="center"
//                                           style={{
//                                             border: "1px dashed white",
//                                             marginTop: 15,
//                                             borderRadius: 10,
//                                           }}
//                                         >
//                                           <Text
//                                             textStyle="h6"
//                                             mt="10px"
//                                             color="white"
//                                           >
//                                             Search and select data sources
//                                           </Text>
//                                           <Text
//                                             textStyle="h6"
//                                             mt="10px"
//                                             color="white"
//                                           >
//                                             Data sources you add will show up
//                                             here
//                                           </Text>
//                                         </Flex>
//                                       </Flex>
//                                     )}
//                                   </Flex>
//                                 </div>
//                               </TabPanel>
//                               <TabPanel>
//                                 <div style={{ overflow: "auto" }}>
//                                   <Text textStyle="h3" mb="15px" color="white">
//                                     Build Files
//                                   </Text>
//                                   <Box width="470px">
//                                     <Text
//                                       textStyle="h6"
//                                       mb="15px"
//                                       color="white"
//                                     >
//                                       Sed ut perspiciatis unde omnis iste natus
//                                       error sit voluptatem accusantium
//                                       doloremque laudantium, totam rem aperiam,
//                                       eaque ipsa quae ab illo inventore
//                                       veritatis et quasi architecto beatae vitae
//                                       dicta sunt
//                                     </Text>
//                                   </Box>
//                                 </div>
//                               </TabPanel>
//                               <TabPanel>Work panel 3</TabPanel>
//                             </TabPanelList>
//                           </Tabs>
//                         </div>
//                       </TabPanel>
//                       <TabPanel>
//                         <Text mb="16px" color="textPriamry" fontSize="12px">
//                           In progress...
//                         </Text>
//                       </TabPanel>
//                     </TabPanelList>
//                   </Tabs>
//                 </div>
//               </Flex>
//             </Flex>
//           </>
//         )}
//         {/* sandbox */}
//         {step === 5 && (
//           <>
//             <Flex
//               height="48px"
//               width="100%"
//               alignItems="center"
//               justifyContent="center"
//               style={{
//                 background:
//                   "linear-gradient(89.1deg, #61045F 43.06%, #AA076B 111.87%)",
//               }}
//             >
//               <Text color="white" fontSize={16} mr="19px">
//                 This is a live Sandbox session you are seeing how your project
//                 will render in Prifina
//               </Text>
//               <BlendIcon iconify={mdiPowerPlug} color="white" />
//             </Flex>
//             <Flex
//               height="64px"
//               width="100%"
//               bg="#1D152C"
//               justifyContent="space-between"
//               alignItems="center"
//               paddingRight="67px"
//               paddingLeft="23px"
//             >
//               <Flex alignItems="center">
//                 <BlendIcon
//                   iconify={mdiArrowLeft}
//                   color="white"
//                   onClick={() => {
//                     setStep(4);
//                   }}
//                 />
//                 <Text ml="24px" mr="24px" color="white">
//                   Holistic Health
//                 </Text>
//                 <Badge type="Widget">Widget</Badge>
//                 <StyledInput
//                   ml="24px"
//                   value="www.ile/9iduwUDpTmjpPooo?node-id=4692%"
//                 />
//               </Flex>
//               <Flex>
//                 <Text color="#F5F8F7" paddingRight="16px">
//                   Let there be light
//                 </Text>

//                 <C.StyledButton
//                   size="xs"
//                   onClick={() => {
//                     changeColor();
//                   }}
//                 >
//                   Switch
//                 </C.StyledButton>
//               </Flex>
//             </Flex>
//             <Flex
//               width="100vw"
//               height="100vh"
//               // paddingLeft="288px"
//               // paddingTop="30px"
//               bg="black"
//             >
//               {/* <Image src={widget} width="308px" height="295px" /> */}

//               <div
//                 style={{
//                   marginLeft: 64,
//                   marginRight: 64,
//                   marginTop: 24,
//                   backgroundColor: color,
//                   // border: "1px solid red",
//                   boxShadow: "0px -4px 8px #050113",
//                   borderRadius: 10,
//                 }}
//               >
//                 <div style={{ overflow: "hidden" }}>
//                   <Tabs
//                     activeTab={activeTab}
//                     onClick={tabClick}
//                     // style={{ height: "100%" }}
//                     variant={"line"}
//                     style={{
//                       background: "#1D152C",
//                       boxShadow: 0,
//                     }}
//                   >
//                     <TabList>
//                       <Tab style={{ marginLeft: 22 }}>
//                         <D.TabText>Jane</D.TabText>
//                       </Tab>
//                       <Tab>
//                         <D.TabText>Work</D.TabText>
//                       </Tab>
//                     </TabList>
//                     <TabPanelList>
//                       <TabPanel
//                         style={{
//                           // height: "650px",
//                           paddingBottom: "50px",
//                           overflow: "auto",
//                           background: color,
//                         }}
//                       >
//                         <div style={{ overflow: "auto" }}>
//                           <D.WidgetContainer
//                             className={"prifina-widget-container"}
//                           >
//                             {/* {widgetList.length > 0 && (
//                       <C.WidgetList
//                         widgetList={widgetList}
//                         widgetData={widgetConfig}
//                         currentUser={currentUser}
//                         dataSources={dataSources}
//                       />
//                     )} */}
//                             <Image src={widget} width="300px" height="300px" />
//                             <Image src={widget} width="300px" height="300px" />
//                             <Image src={widget} width="300px" height="300px" />
//                             <Image src={widget} width="300px" height="300px" />
//                             <Image src={widget} width="300px" height="300px" />
//                             <Image src={widget} width="300px" height="300px" />
//                             <Image src={widget} width="300px" height="300px" />
//                           </D.WidgetContainer>
//                         </div>
//                       </TabPanel>
//                       <TabPanel>
//                         <D.WidgetContainer>
//                           <Image src={widget} width="300px" height="300px" />
//                           <Image src={widget} width="300px" height="300px" />
//                           <Image src={widget} width="300px" height="300px" />
//                           <Image src={widget} width="300px" height="300px" />
//                           <Image src={widget} width="300px" height="300px" />
//                           <Image src={widget} width="300px" height="300px" />
//                         </D.WidgetContainer>
//                       </TabPanel>
//                     </TabPanelList>
//                   </Tabs>
//                 </div>
//               </div>
//             </Flex>
//           </>
//         )}
//         {step === 6 && (
//           <>
//             <C.DevConsoleSidebar
//               backgroundColor2="#1D152C"
//               iconColor2="#aa1370"
//               borderColor2="#aa1370"
//               onClick1={() => {
//                 setStep(2);
//               }}
//               onClick2={() => {
//                 setStep(3);
//               }}
//             />
//             <C.NavbarContainer bg="#08011C">
//               <DevConsoleLogo />
//             </C.NavbarContainer>
//             <CreateProjectModal />

//             <Flex
//               width="100%"
//               height="100vh"
//               paddingLeft="286px"
//               bg="white"
//               flexDirection="column"
//               bg="#141020"
//             >
//               <Flex
//                 marginLeft="66px"
//                 bg="#231D35"
//                 width="1007px"
//                 height="617px"
//                 borderRadius="10px"
//                 flexDirection="column"
//                 alignItems="center"
//                 mt="48px"
//               >
//                 <Flex
//                   paddingLeft="16px"
//                   paddingTop="16px"
//                   paddingBottom="40px"
//                   justifyContent="space-between"
//                   display="flex"
//                 >
//                   <Text color="white" fontSize={24}>
//                     Projects
//                   </Text>
//                   <Box marginLeft="750px">
//                     <C.StyledButton
//                       onClick={() => {
//                         setStep(6);
//                       }}
//                       size="sm"
//                     >
//                       New Project
//                     </C.StyledButton>
//                   </Box>
//                 </Flex>
//                 <Table columns={columns} data={data} />
//               </Flex>
//             </Flex>
//           </>
//         )}
//       </AccountContext.Provider>
//     </>
//   );
// };

// DevConsole.displayName = "DevConsole";

// DevConsole.story = {
//   name: "Dev Console",
// };

// // export default DevConsole;
