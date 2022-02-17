import { installWidgetMutation } from "../utils/src/graphql/api";
import { installWidget } from "../utils/src/graphql/mutations";

// const {
//   installWidgetMutation,
//   installWidget,
// } = require("../utils/src/graphql/api");

// jest.mock("../utils/src/graphql/api");
// jest.mock("../utils/src/graphql/mutations");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("testing calling mutation", () => {
  test("test1", async () => {
    const API = {
      graphql: jest.fn(),
    };

    const id = "0d3cbdb06ffc93642fe144ce37a68532bf50";
    const query = installWidget;
    const widget = "sad";
    const authMode = "AMAZON_COGNITO_USER_POOLS";

    const result = await installWidgetMutation(API, id, widget);

    console.log(result);

    expect(API.graphql).toHaveBeenCalled();

    expect(API.graphql).toBeCalledWith({
      query: query,
      authMode: authMode,
      variables: {
        id: id,
        widget: widget,
      },
    });
  });
  // test("testing equal to", async () => {
  //   const API = {};

  //   const id = "";
  //   const widget = {
  //     id: id,
  //     settings: "hehe",
  //     index: -1,
  //   };
  //   const result = await installWidgetMutation(API, id, widget);

  //   expect(result).toEqual();
  // });
});
