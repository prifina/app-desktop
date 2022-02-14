import * as util from "util";
import * as rp from "request-promise";
import { exec } from "child_process";

const pExec = util.promisify(exec);

const API = "http://localhost:4466/";
const CMD_SEED_DATABASE = `${__dirname}/../seed.sh`;

describe("Getting shop items", () => {
  beforeAll(async () => {
    await pExec(CMD_SEED_DATABASE);
  });

  it("Retrieves the shop items in default order", async () => {
    const query = `
            query {
                shopItems {
                    name
                    category
                    size
                }
            }
        `;

    const response = await rp({
      method: "POST",
      uri: API,
      body: { query },
      json: true,
    });
    expect(response).toMatchSnapshot();
  });
});
