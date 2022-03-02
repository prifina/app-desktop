const puppeteer = require("puppeteer");

const { i18n } = require("@prifina-apps/utils");

i18n.init();

const isDebugging = () => {
  let debugging_mode = {
    headless: true,
    slowMo: 50,
    devtools: true,
  };
  return process.env.NODE_ENV === "debug" ? debugging_mode : {};
};

jest.setTimeout(7000);

const checkThis = async (page, selector, text, timeout = 0) => {
  let found = false;
  // console.log("CHECK ", text);

  try {
    await page.waitForFunction(
      (text, selector) =>
        document.querySelector(selector).innerText.includes(text),
      { timeout: timeout },
      text,
      selector,
    );
    found = true;
  } catch (e) {
    found = false;
  }

  return Promise.resolve(found);
};

const waitThis = async (page, selector, timeout = 0) => {
  let found = false;
  // console.log("WAIT ", selector);

  try {
    await page.waitForSelector(selector, { timeout: timeout });
    // console.log(`"${selector}" was found on the page`);
    found = true;
  } catch (e) {
    // console.log(`"${selector}" was not found on the page`);
    found = false;
  }

  return Promise.resolve(found);
};

let browser;
let page;

beforeAll(async () => {
  // browser = await puppeteer.launch(isDebugging());
  browser = await puppeteer.launch({ headless: false });

  page = await browser.newPage();
  await page.goto(process.env.TEST_URL + "/login?debug=true");
  // await page.goto(process.env.TEST_URL);

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  // default design viewport size
  // page.setViewport({ width: 500, height: 2400 });
});

describe("Test App Market", () => {
  test("Login successfully test", async () => {
    await page.type("#username", process.env.USERNAME);

    await page.type("#password", process.env.PASSWORD);

    await page.click(".LoginButton");

    const backgroundShown = await waitThis(
      page,
      "#home-styledBackground",
      6000,
    );
    expect(backgroundShown).toBe(true);

    //   done();
    // }, 6000);
  }, 8000);
  test("Load App Market", async () => {
    await page.goto(process.env.TEST_URL + "/core/app-market");

    let text = i18n.__("dataOnYourSide");

    const titleFound = await checkThis(page, "body", text, 10000);

    expect(titleFound).toBe(true);

    const bannerShown = await waitThis(page, "#appMarket-banner", 6000);
    expect(bannerShown).toBe(true);

    // done();
    // }, 6000);
  }, 8000);

  test("Widgets appearing test", async () => {
    const widgetShown = await waitThis(page, "#appMarket-widgetBase", 6000);
    expect(widgetShown).toBe(true);

    // done();
    // }, 6000);
  });

  test("Select Widget Test", async () => {
    await page.waitForSelector("#appMarket-widgetBase");
    await page.click("#appMarket-widgetBase");

    const backButtonShown = await waitThis(
      page,
      "#widgetsDirectoryButton",
      6000,
    );
    expect(backButtonShown).toBe(true);

    // done();
    // }, 6000);
  });

  test("Install Widget Test", async () => {
    await page.waitForSelector("#installButton");
    await page.click("#installButton");

    // const viewButtonShown = await waitThis(page, "#viewButton", 6000);
    // expect(viewButtonShown).toBe(true);

    // done();
    // }, 6000);
  });

  test("Logout test", async () => {
    await page.waitForSelector("#userMenu-avatar");
    await page.click("#userMenu-avatar");

    await page.click(".userMenu-logout");
    await page.click(".dialog-logoutButton");

    let text = i18n.__("loginWelcomeMessage");

    const found = await checkThis(page, "body", text, 10000);

    expect(found).toBe(true);
    //   done();
    // }, 6000);
  });
});

afterAll(() => {
  if (isDebugging()) {
    browser.close();
  } else {
    // browser.close();
  }
});

process.on("unhandledRejection", reason => {
  console.log("DEBUG: " + reason);
});
