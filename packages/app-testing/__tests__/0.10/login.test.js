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
  browser = await puppeteer.launch(isDebugging());
  // browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto(process.env.TEST_URL + "/login");
  // default design viewport size
  // page.setViewport({ width: 500, height: 2400 });
});

describe("Test Login page ", () => {
  test("Login page loads correctly", async () => {
    let text = i18n.__("loginWelcomeMessage");
    console.log("I18n", i18n.__("loginWelcomeMessage"));

    const found = await checkThis(page, "body", text, 10000);

    expect(found).toBe(true);
    // done();
    // }, 16000);
  });

  test("Username check length after blur event", async () => {
    const usernameEl = await page.$("#username");

    const invalidLength = i18n.__("usernameError", {
      length: process.env.USERNAME_LENGTH,
    });
    await usernameEl.tap();
    await page.focus("#username");

    await page.type("#username", "test");
    await page.$eval("#username", e => e.blur());
    // check if empty username triggers toast

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",
      // "#blend-toast-5",
      invalidLength,
      4000,
    );
    //console.log("CHECK ", checkInvalidEntry);

    expect(checkInvalidEntry).toBe(true);
    //   done();
    // }, 6000);
  });

  test("Username, check length when password onFocus test", async () => {
    // remove any previous entries...
    await page.evaluate(function () {
      document.querySelector("input#username").value = "";
    });

    const passwordEl = await page.$("#password");
    await passwordEl.tap();
    //await page.$eval("#password", (e) => e.focus());
    await page.focus("#password");

    const elID = await page.evaluate(() => document.activeElement.id);
    //console.log("ACTIVE ", elID);
    expect(elID).toBe("username");

    //   done();
    // }, 6000);
  });

  test("Password check if empty on enter keypress test", async () => {
    const passwordEl = await page.$("#password");
    const invalidEntry = i18n.__("invalidEntry");
    await passwordEl.tap();
    await page.focus("#password");
    await page.keyboard.press("Enter");

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",
      invalidEntry,
      4000,
    );
    //console.log("CHECK ", checkInvalidEntry);
    expect(checkInvalidEntry).toBe(true);
    //   done();
    // }, 6000);
  });

  test("Login weak password quality check on enter keypress", async () => {
    // type username, so on focus check is not triggered....

    await page.type("#username", "testing");
    await page.evaluate(function () {
      document.querySelector("input#username").value = "testing";
    });
    const passwordEl = await page.$("#password");
    const invalidPassword = i18n.__("passwordQuality");
    await passwordEl.tap();
    //await page.focus("#password");
    await page.type("#password", "weakpassword");
    await page.keyboard.press("Enter");

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",
      invalidPassword,
      3000,
    );
    //console.log("CHECK ", checkInvalidEntry);
    expect(checkInvalidEntry).toBe(true);
    //   done();
    // }, 6000);
  });

  test("Login password change visibility, show", async () => {
    await page.click(".PasswordRightIcon");

    const iconShown = await waitThis(page, ".HideIcon", 1000);
    expect(iconShown).toBe(true);

    //   done();
    // }, 3000);
  });

  test("login password change visibility, hide", async () => {
    await page.click(".PasswordRightIcon");

    const iconShown = await waitThis(page, ".EyeIcon", 1000);
    expect(iconShown).toBe(true);

    //   done();
    // }, 6000);
  });

  test("Login weak password quality check on blur event", async () => {
    // type username, so on focus check is not triggered....

    await page.type("#username", "testing");
    await page.evaluate(function () {
      document.querySelector("input#username").value = "testing";
      document.querySelector("input#password").value = "";
    });
    const passwordEl = await page.$("#password");
    const invalidPassword = i18n.__("passwordQuality");
    await passwordEl.tap();
    //await page.focus("#password");
    await page.type("#password", "weakpassword");
    await page.$eval("#password", e => e.blur());

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",

      invalidPassword,
      3000,
    );
    //console.log("CHECK ", checkInvalidEntry);
    expect(checkInvalidEntry).toBe(true);
    //   done();
    // }, 6000);
  });

  ///===========test needs work
  test("Login strong password quality check on blur event", async () => {
    // 2 test results...
    // expect.assertions(2);

    // type username, so on focus check is not triggered....
    await page.type("#username", "testing");
    await page.evaluate(function () {
      document.querySelector("input#username").value = "testing";
      document.querySelector("input#password").value = "";
    });
    const passwordEl = await page.$("#password");
    const invalidPassword = i18n.__("passwordQuality");
    await passwordEl.tap();
    //await page.focus("#password");
    await page.type("#password", "thisISGoodPassword12!#");
    await page.$eval("#password", e => e.blur());

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",
      // "#blend-toast-5",
      invalidPassword,
      2000,
    );
    console.log("CHECK ", checkInvalidEntry);
    expect(checkInvalidEntry).toBe(true);

    const is_disabled = (await page.$(".LoginButton[disabled]")) !== null;
    // Login button should now be normal
    expect(is_disabled).toBe(false);

    //   done();
    // }, 8000);
  });

  test("Login button click invalid credentials", async () => {
    // using previous test input field values....
    await page.click(".LoginButton");
    const invalidLogin = i18n.__("passwordQuality");
    const checkInvalidLogin = await checkThis(
      page,
      "[id*='blend-toast-']",

      invalidLogin,
      2000,
    );

    expect(checkInvalidLogin).toBe(true);

    //   done();
    // }, 6000);
  });

  test("Login create account click", async () => {
    await page.click("#createAccountButton");

    const createAccountTitle = i18n.__("createAccountTitle");
    const checkTitle = await checkThis(page, "body", createAccountTitle, 3000);
    expect(checkTitle).toBe(true);

    ///go back to login page -- maybe change this with browser back button
    await page.click("#loginLinkButton");
    //   done();
    // }, 6000);
  });

  test("Login forgot password click", async () => {
    await page.click(".ForgotPasswordButton");
    const forgotPasswordTitle = i18n.__("resetPasswordTitle");
    const checkTitle = await checkThis(page, "body", forgotPasswordTitle, 3000);
    expect(checkTitle).toBe(true);
    await page.click(".backButton");
    //   done();
    // }, 6000);
  });

  test("Login forgot username click", async () => {
    await page.waitForSelector("#forgotUsernameButton");

    await page.click("#forgotUsernameButton");
    // const forgotPasswordTitle = "Forgot username?";
    const forgotPasswordTitle = i18n.__("recoverUsernameTitle");
    const checkTitle = await checkThis(page, "body", forgotPasswordTitle, 3000);
    expect(checkTitle).toBe(true);
    await page.click(".backButton");
    //   done();
    // }, 10000);
  });
});

afterAll(() => {
  if (isDebugging()) {
    browser.close();
  }
});

process.on("unhandledRejection", reason => {
  console.log("DEBUG: " + reason);
});
