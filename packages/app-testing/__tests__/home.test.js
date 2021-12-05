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

  jest.setTimeout(7000);

  browser = await puppeteer.launch(isDebugging());
  page = await browser.newPage();
  await page.goto(process.env.TEST_URL + "/home");
  //   await page.goto(process.env.TEST_URL + "/register");

  //   click on create account button to go to register

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
  // test("Register page loads correctly", async () => {
  //   let text = i18nTranslate.__("welcomeMessage");
  //   console.log("I18n", i18nTranslate.__("welcomeMessage"));
  //   const found = await checkThis(page, "body", text, 10000);
  //   expect(found).toBe(true);
  //   // done();
  //   // }, 16000);
  // }, 16000);
 
});

afterAll(() => {
  if (isDebugging()) {
    browser.close();
  }
});

process.on("unhandledRejection", reason => {
  console.log("DEBUG: " + reason);
});
