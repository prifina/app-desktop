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

describe("Test User Menu", () => {
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

  test("Open User Menu Test", async () => {
    await page.waitForSelector("#userMenu-avatar");
    await page.click("#userMenu-avatar");

    const logoutButtonShown = await waitThis(page, ".userMenu-logout", 6000);
    expect(logoutButtonShown).toBe(true);
    const bellButtonShown = await waitThis(page, ".userMenu-bell", 6000);
    expect(bellButtonShown).toBe(true);
    const historyButtonShown = await waitThis(page, ".userMenu-history", 6000);
    expect(historyButtonShown).toBe(true);
    const homeButtonShown = await waitThis(page, ".userMenu-home", 6000);
    expect(homeButtonShown).toBe(true);

    //   done();
    // }, 6000);
  });

  test("Close User Menu", async () => {
    await page.waitForSelector("#home-styledBackground");
    await page.click("#home-styledBackground");

    //   done();
    // }, 6000);
  });

  test("Logout test", async () => {
    await page.waitForSelector("#userMenu-avatar");
    await page.click("#userMenu-avatar");

    await page.click(".userMenu-logout");
    await page.click(".dialog-logoutButton");

    let text = i18n.__("loginWelcomeMessage");
    // console.log("I18n", i18n.__("loginWelcomeMessage"));

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
