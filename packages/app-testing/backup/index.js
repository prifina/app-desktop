const puppeteer = require("puppeteer");

// const i18nTranslate = require("../getI18n");
// i18nTranslate.init();

// (async function () {
//   const browser = await puppeteer.launch({ headless: false });

//   const page = await browser.newPage();
//   await page.goto("http://localhost:3000/login?redirect=/");

//   await page.waitForSelector(".ForgotUsernameButton");

//   await page.click(".ForgotUsernameButton");
// })();

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
    // console.log(`The text "${text}" was found on the page`);
    found = true;
  } catch (e) {
    // console.log(`The text "${text}" was not found on the page`);
    found = false;
  }

  return Promise.resolve(found);
};

describe("Login page", () => {
  // test("Testing Forgot Username Button", async () => {
  //   jest.setTimeout(30000);
  //   const browser = await puppeteer.launch({ headless: false });

  //   const page = await browser.newPage();
  //   await page.goto("http://localhost:3000/login?redirect=/");
  //   await page.waitForSelector(".ForgotUsernameButton");

  //   await page.click(".ForgotUsernameButton");
  // });

  test("login forgot username click", async done => {
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    await page.goto("http://localhost:3000/login?redirect=/");

    await page.waitForSelector(".ForgotUsernameButton");

    // await page.click(".ForgotUsernameButton");
    const forgotPasswordTitle = "Forgot username?";
    const checkTitle = await checkThis(
      page,
      ".ForgotUsernameButton",
      forgotPasswordTitle,
      3000,
    );
    expect(checkTitle).toBe(true);
    // await page.click(".BackButton");
    done();
  }, 10000);

  // test("login create account click", async done => {
  //   const browser = await puppeteer.launch({ headless: false });

  //   const page = await browser.newPage();
  //   await page.goto("http://localhost:3000/login?redirect=/");

  //   await page.click("#CreateAccountButton");

  //   const createAccountTitle = "Create an account";
  //   const checkTitle = await checkThis(page, "body", createAccountTitle, 3000);
  //   expect(checkTitle).toBe(true);
  //   await page.click(".BackButton");
  //   done();
  // });
});
