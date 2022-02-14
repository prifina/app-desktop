const {
  getPrifinaUserQuery,
  listAppMarketQuery,
  listDataSourcesQuery,
  installWidgetMutation,
} = require("../utils/src/graphql/api");

// import { installWidgetMutation } from "../utils/src/graphql/api";

jest.mock("../utils/src/graphql/api");

describe("test suite", () => {
  // test("function test", () => {
  //   const users = [
  //     {
  //       addInstalledWidgets: {
  //         id: "0d3cbdb06ffc93642fe144ce37a68532bf50",
  //         installedWidgets:
  //           '[{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"light"}],"id":"866fscSq5Ae7bPgUtb6ffB"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"}],"id":"sCUiMz2m9JsRSnRJ5favnP"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"},{"field":"city","value":"London"}],"id":"3LSdcSs1kcPskBWBJvqGto"}]',
  //       },
  //     },
  //   ];
  //   // const resp = { data: users };

  //   // axios.get.mockResolvedValue(resp);

  //   // or you could use the following depending on your use case:
  //   // axios.get.mockImplementation(() => Promise.resolve(resp))

  //   return installWidgetMutation
  //     .all()
  //     .then(data => expect(data).toEqual(users));
  // });
  test("should get username", () => {
    const users = [
      {
        addInstalledWidgets: {
          id: "0d3cbdb06ffc93642fe144ce37a68532bf50",
          installedWidgets:
            '[{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"light"}],"id":"866fscSq5Ae7bPgUtb6ffB"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"}],"id":"sCUiMz2m9JsRSnRJ5favnP"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"},{"field":"city","value":"London"}],"id":"3LSdcSs1kcPskBWBJvqGto"}]',
        },
      },
    ];
    // expect(installWidgetMutation()).toEqual(users);
    expect(installWidgetMutation()).toBe(users);
  });
});
