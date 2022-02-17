const {
  getPrifinaUserQuery,
  listAppMarketQuery,
  listDataSourcesQuery,
} = require("../utils/src/graphql/api");

jest.mock("../utils/src/graphql/api");

// jest.mock("../utils/src/graphql/api", () => {
//   return {
//     baseURL: "http://localhost:3000/app-market",
//     request: jest.fn()({
//       data: [
//         {
//           id: 1,
//           title: "incidunt alias vel enim",
//           url: "",
//         },
//         {
//           id: 2,
//           title: "incidunt alias vel enim",
//           url: "",
//         },
//         {
//           id: 3,
//           title: "incidunt alias vel enim",
//           url: "",
//         },
//       ],
//     }),
//   };
// });

describe("test out query functions in App Market", () => {
  afterEach(() => jest.resetAllMocks());

  test("test 1", async () => {
    const mockFunction = await listAppMarketQuery();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledWith("", {
      data: [{}],
    });
  });

  test("test 2", async () => {
    const { mockFunction } = await listAppMarketQuery({
      id: 3,
      title: "incidunt alias vel enim",
      url: "",
    }).encode();

    expect(mockFunction).toEqual(MockFunction.from(require("../__tests__/request.json")));
  });
});
