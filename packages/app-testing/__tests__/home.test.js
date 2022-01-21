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
  console.log("CHECK ", text);

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
  browser = await puppeteer.launch(isDebugging());
  // browser = await puppeteer.launch({ headless: false });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/login?debug=true");
  // await page.goto(process.env.TEST_URL);

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  // default design viewport size
  // page.setViewport({ width: 500, height: 2400 });
});

describe("Test Home page ", () => {
  test("Login test", async () => {
    const usernameEl = await page.$("#username");
    const passwordEl = await page.$("#password");

    await usernameEl.tap();
    // await page.focus("#username");

    await page.type("#username", process.env.USERNAME);

    await passwordEl.tap();

    // await page.focus("#username");

    await page.type("#password", process.env.PASSWORD);

    await page.click(".LoginButton");

    // expect(page).toEqual(process.env.TEST_URL + "/home");

    // check if empty username triggers toast

    //console.log("CHECK ", checkInvalidEntry);

    const backgroundShown = await waitThis(
      page,
      "#home-styledBackground",
      6000,
    );
    expect(backgroundShown).toBe(true);

    //   done();
    // }, 6000);
  });
  test("Load Background test", async () => {
    const backgroundShown = await waitThis(
      page,
      "#home-styledBackground",
      6000,
    );
    expect(backgroundShown).toBe(true);

    // done();
    // }, 6000);
  });
  test("Apps grid test", async () => {
    const appGridShown = await waitThis(page, "#home-appsGrid", 6000);
    expect(appGridShown).toBe(true);

    // done();
    // }, 6000);
  });

  test("Apps cell test", async () => {
    const appCellShown = await waitThis(page, "#home-appCell", 6000);
    expect(appCellShown).toBe(true);

    // done();
    // }, 6000);
  });

  test("Logout test", async () => {
    await page.waitForSelector("#userMenu-avatar");
    await page.click("#userMenu-avatar");

    await page.click(".userMenu-logout");
    await page.click(".dialog-logoutButton");

    let text = i18n.__("loginWelcomeMessage");
    console.log("I18n", i18n.__("loginWelcomeMessage"));

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
    browser.close();
  }
});

process.on("unhandledRejection", reason => {
  console.log("DEBUG: " + reason);
});
