// const {
//   installWidgetMutation,
//   listAppsQuery,
// } = require("../utils/src/graphql/api");

// import * as myModule from "../utils/src/graphql/api";

// // import { installWidgetMutation } from "@prifina-apps/utils";

// // jest.mock("../utils/src/graphql/api", () => ({
// //   ...jest.requireActual("../utils/src/graphql/api"),
// //   installWidgetMutation: jest.fn(),
// // }));

// jest.mock("../utils/src/graphql/api", () => ({
//   ...jest.requireActual("../utils/src/graphql/api"),
//   listAppsQuery: jest.fn(),
// }));

// // jest.mock("../utils/src/graphql/api");
// jest.mock("../utils/src/graphql/api", () => jest.fn());

// beforeEach(() => {
//   // Clear all instances and calls to constructor and all methods:
//   /* It clears all mocks that have been set on the jest object. */
//   jest.clearAllMocks();
// });

// describe("example", () => {
//   afterEach(() => jest.resetAllMocks());

//   // it("tests something about otherFn", () => {
//   //   const response = {
//   //     addInstalledWidgets: {
//   //       id: "0d3cbdb06ffc93642fe144ce37a68532bf50",
//   //       installedWidgets:
//   //         '[{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"light"}],"id":"866fscSq5Ae7bPgUtb6ffB"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"}],"id":"sCUiMz2m9JsRSnRJ5favnP"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"},{"field":"city","value":"London"}],"id":"3LSdcSs1kcPskBWBJvqGto"}]',
//   //     },
//   //   };

//   //   // listAppsQuery.mockReturnValue("foo");
//   //   expect(listAppsQuery()).toBe(response);
//   // });

//   test("returns an object", async () => {
//     const result = await installWidgetMutation(API, id, widget);
//     console.log(result);
//     expect(result).toEqual({
//       addInstalledWidgets: {
//         id: "0d3cbdb06ffc93642fe144ce37a68532bf50",
//         installedWidgets:
//           '[{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"light"}],"id":"866fscSq5Ae7bPgUtb6ffB"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"}],"id":"sCUiMz2m9JsRSnRJ5favnP"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"},{"field":"city","value":"London"}],"id":"3LSdcSs1kcPskBWBJvqGto"}]',
//       },
//     });
//   });

//   // describe("test category", () => {
//   //   it("tests something about testFn", () => {
//   //     const mock = jest.spyOn(myModule, listAppsQuery); // spy on otherFn
//   //     mock.mockReturnValue("mocked value"); // mock the return value

//   //     console.log("jeuaskads", mock);

//   //     // expect(myModule.testFn()).toBe("mocked value"); // SUCCESS

//   //     mock.mockRestore(); // restore otherFn
//   //   });
//   // });

//   // it("tests something about otherFn", () => {
//   //   listAppsQuery.mockReturnValue("foo");
//   //   expect(listAppsQuery()).toBe("foo");
//   // });

//   // const mock = jest.fn();
//   // test("test 2", async () => {
//   //   const { mockFunction } = await installWidgetMutation({
//   //     id: 3,
//   //     title: "incidunt alias vel enim",
//   //     url: "",
//   //   }).encode();

//   //   expect(mockFunction).toEqual(
//   //     installWidgetMutation.from(require("../utils/src/graphql/api")),
//   //   );
//   // });
// });

// // test("Calls installWidgetMutation function once", () => {
// //   expect(installWidgetMutation).toBeCalledTimes(1);
// // });
