const puppeteer = require("puppeteer");

const i18nTranslate = require("../getI18n");
i18nTranslate.init();

const isDebugging = () => {
  let debugging_mode = {
    headless: false,
    slowMo: 50,
    devtools: true,
  };
  return process.env.NODE_ENV === "debug" ? debugging_mode : {};
};

const checkThis = async (page, selector, text, timeout = 0) => {
  let found = false;
  console.log("CHECK ", text);

  try {
    await page.waitForFunction(
      (text, selector) =>
        document.querySelector(selector).innerText.includes(text),
      { timeout: timeout },
      text,
      selector,
    );
    // console.log(`The text "${text}" was found on the page`);
    found = true;
  } catch (e) {
    // console.log(`The text "${text}" was not found on the page`);
    found = false;
  }

  return Promise.resolve(found);
};

const waitThis = async (page, selector, timeout = 0) => {
  let found = false;
  console.log("WAIT ", selector);

  try {
    await page.waitForSelector(selector, { timeout: timeout });
    console.log(`"${selector}" was found on the page`);
    found = true;
  } catch (e) {
    console.log(`"${selector}" was not found on the page`);
    found = false;
  }

  return Promise.resolve(found);
};

let browser;
let page;

beforeAll(async () => {
  // const browser = await puppeteer.launch({ headless: true });

  // browser = await puppeteer.launch(isDebugging());
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto(process.env.TEST_URL + "/home");

  // default design viewport size
  page.setViewport({ width: 500, height: 2400 });
  /*
  page.on("console", (msg) => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
  });
  */
});

describe("Test Home page ", () => {
  test("Load Background test", async () => {
    //in first test wait for home to completely load
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // await page.waitForSelector("#styledBackground");

    const backgroundShown = await waitThis(page, "#styledBackground", 6000);
    expect(backgroundShown).toBe(true);

    // done();
  }, 6000);
  // });
  test("Apps grid test", async () => {
    const appGridShown = await waitThis(page, "#appsGrid", 6000);
    expect(appGridShown).toBe(true);

    // done();
  }, 6000);

  test("Apps cell test", async () => {
    const appCellShown = await waitThis(page, "#cell", 6000);
    expect(appCellShown).toBe(true);

    // done();
  }, 6000);
});

afterAll(() => {
  if (isDebugging()) {
    browser.close();
  }
});

process.on("unhandledRejection", reason => {
  console.log("DEBUG: " + reason);
});
