jest.mock("request", () => ({
  post: jest.fn(),
}));
const request = require("request");

const mockRequest = reqData => {
  return {
    params: reqData.params ? reqData.params : {},
    body: reqData.body ? reqData.body : {},
    headers: reqData.headers ? reqData.headers : {},
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
describe("Test suite for controller", () => {
  test("should return true for successful validation", async () => {
    request.post.mockResolvedValue({
      key1: "value1",
      key2: "value2",
    });
    const req = mockRequest();
    const res = mockResponse();
    const Ctrl = require("../../controllers/ctrl");
    await Ctrl.validate(req, res);
    //const result = await res1.json();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
