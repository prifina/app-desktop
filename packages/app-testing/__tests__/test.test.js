const {
  getPrifinaUserQuery,
  listAppMarketQuery,
  listDataSourcesQuery,
  installWidgetMutation,
} = require("../utils/src/graphql/api");

// import { installWidgetMutation } from "../utils/src/graphql/api";

jest.mock("../utils/src/graphql/api");

// jest.mock("../utils/src/graphql/api", () => {
//   const original = jest.requireActual("../utils/src/graphql/api"); // Step 2.
//   return {
//     ...original,
//     installWidgetMutation: jest.fn(),
//   };
// });

// installWidgetMutation = jest.fn().mockImplementation(() => {
//   return "Some Value";
// });

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  // installWidgetMutation.mockClear();
});

describe("test suite", () => {
  it("test", () => {
    const myResponse = {
      data: "test",
    };
    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockResponse(200, null, JSON.stringify(myResponse))),
      );
    /* Creating a wrapper around the component. */
    // const wrapper = mount(<MyComponent />);
    //Perform some action in the component that does a fetch
    // wrapper.find(Button).at(0).simulate("click");

    //assert that there is a state updated from the response
    // expect(wrapper.state("fetchResponse")).toEqual(myResponse);
    expect(installWidgetMutation().toEqual(myResponse));
  });
  // it("should get user data and sort the contacts", async () => {
  //   const userId = 51;
  //   const userData = {
  //     id: userId,
  //     name: "Allan",
  //     // the detailed data are not relevant to this article
  //     // contacts: [...],
  //   };
  //   const expectedSortedUserdata = {
  //     user: userData,
  //     // contactsSortedByName: [...],
  //     // contactsSortedByAge: [...],
  //   };

  //   installWidgetMutation.mockResolvedValue(userData);

  //   const sortedUserData = await userData;

  //   expect(sortedUserData).toEqual(expectedSortedUserdata);

  //   expect(installWidgetMutation).toHaveBeenCalledTimes(1);
  //   expect(installWidgetMutation).toHaveBeenCalledWith(userId);
  // });
  // test("should call the API and return the data", async () => {
  //   const usersData = [
  //     { id: 51, name: "Allan" },
  //     { id: 120, name: "George" },
  //   ];

  //   // axiosGet.mockResolvedValue({ data: usersData });
  //   // also could be mockImplementation
  //   // or anything that mock functions can do

  //   const returnedUsersData = await installWidgetMutation();

  //   expect(returnedUsersData).toEqual(usersData);
  //   // and because axios.get is a mock function, we can assert it too
  //   expect(installWidgetMutation).toHaveBeenCalledTimes(1);
  //   // expect(axiosGet).toHaveBeenCalledWith("/api/users");
  // });

  // test("function test", () => {
  //   installWidgetMutation.mockImplementation(() => ({ mockedValue: 2 }));
  //   // expect(installWidgetMutation).toHaveBeenCalledTimes(1);
  //   console.log(installWidgetMutation());
  // });

  // test("should get username", () => {
  //   const users = [
  //     {
  //       addInstalledWidgets: {
  //         id: "0d3cbdb06ffc93642fe144ce37a68532bf50",
  //         installedWidgets:
  //           '[{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"light"}],"id":"866fscSq5Ae7bPgUtb6ffB"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"}],"id":"sCUiMz2m9JsRSnRJ5favnP"},{"settings":[{"field":"size","value":"300x300"},{"field":"theme","value":"dark"},{"field":"city","value":"London"}],"id":"3LSdcSs1kcPskBWBJvqGto"}]',
  //       },
  //     },
  //   ];
  //   // expect(installWidgetMutation()).toEqual(users);
  //   // expect(installWidgetMutation()).toBe(users);
  //   // expect(installWidgetMutation).toHaveBeenCalled();

  // });
});
