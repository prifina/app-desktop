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
  page = await browser.newPage();
  await page.goto(process.env.TEST_URL);

  await page.waitForSelector(".createAccountButton");
  await page.click(".createAccountButton");

  // default design viewport size
  page.setViewport({ width: 500, height: 2400 });
});

describe("Test Register page ", () => {
  test("Register page loads correctly", async () => {
    let text = i18n.__("welcomeMessage");
    // console.log("I18n", i18n.__("welcomeMessage"));

    const found = await checkThis(page, "body", text, 10000);

    expect(found).toBe(true);
    //   done();
    // }, 16000);
  });
  test("Testing register page title", async () => {
    let text = i18n.__("createAccountTitle");
    // console.log("I18n", i18n.__("createAccountTitle"));

    const found = await checkThis(page, "#createAccountContainer", text, 10000);

    expect(found).toBe(true);
    //   done();
    // }, 7000);
  });
  test("Username check length, or if empty after blur event", async () => {
    const invalidLength = i18n.__("usernameError", {
      length: process.env.USERNAME_LENGTH,
    });

    await page.focus("#username");

    await page.type("#username", "test");
    await page.$eval("#username", e => e.blur());
    // check if empty username triggers toast

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",
      invalidLength,
      4000,
    );

    expect(checkInvalidEntry).toBe(true);
    //   done();
    // }, 6000);
  });
  test("Username input no spaces allowed test", async () => {
    await page.focus("#username");

    let spacesNotAllowed = i18n.__("usernameError2");

    await page.type("#username", "test test");
    await page.$eval("#username", e => e.blur());
    // check if empty username triggers toast

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",
      spacesNotAllowed,
      4000,
    );

    expect(checkInvalidEntry).toBe(true);
    //   done();
    // }, 6000);
  });
  test("Password check onFocus event if requirements container pops up", async () => {
    // remove any previous entries...
    await page.evaluate(function () {
      document.querySelector("input#username").value = "";
    });

    // type in first name, last name and username
    await page.type("#firstName", "name");
    await page.type("#lastName", "lastname");
    await page.type("#username", "username");

    await page.focus("#accountPassword");

    const waitForPopperContianer = await waitThis(
      page,
      "#passwordPopperContainer",
      4000,
    );

    expect(waitForPopperContianer).toBe(true);
    //   done();
    // }, 6000);
  });

  test("Password value conditions test", async () => {
    // type in first name, last name and username
    await page.type("#firstName", "name");
    await page.type("#lastName", "lastname");
    await page.type("#username", "username");

    const passwordQuality = i18n.__("passwordQuality");

    //input invalid password
    await page.type("#accountPassword", "invalidPassword#");
    await page.$eval("#accountPassword", e => e.blur());

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",
      passwordQuality,
      2000,
    );
    console.log("CHECK ", checkInvalidEntry);
    expect(checkInvalidEntry).toBe(true);

    //input valid password
    await page.type("#accountPassword", "validPassword123!*#");
    await page.$eval("#accountPassword", e => e.blur());

    const waitForPopperContianer = await waitThis(
      page,
      "#passwordPopperContainer",
      4000,
    );

    expect(waitForPopperContianer).toBe(false);
    //   done();
    // }, 8000);
  }, 8000);
  test("Password and confirmation password not matching on next click test", async () => {
    // type in first name, last name and username
    await page.type("#firstName", "name");
    await page.type("#lastName", "lastname");
    await page.type("#username", "username");

    const invalidPassword = i18n.__("invalidPassword");

    //input password
    await page.type("#accountPassword", "validPassword123!*#");
    await page.$eval("#accountPassword", e => e.blur());

    /// input invalid confirmation password
    await page.type("#passwordConfirm", "notMatchingPassword#");
    await page.$eval("#passwordConfirm", e => e.blur());

    ///input rest of the form
    await page.type("#email", "name@email.com");
    await page.type("#phoneNumber", "123123");

    //click next button
    await page.click("#nextButton");

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",
      invalidPassword,
      2000,
    );
    // console.log("CHECK ", checkInvalidEntry);
    expect(checkInvalidEntry).toBe(true);

    //   done();
    // }, 8000);
  });
  test("Password input icon change visibility, show", async () => {
    await page.click(".PasswordRightIcon");

    const iconShown = await waitThis(page, ".HideIcon", 1000);
    expect(iconShown).toBe(true);

    //   done();
    // }, 3000);
  });

  test("Password input icon change visibility, hide", async () => {
    await page.click(".PasswordRightIcon");

    const iconShown = await waitThis(page, ".EyeIcon", 1000);
    expect(iconShown).toBe(true);

    //   done();
    // }, 6000);
  });
  test("Email invalid or exisiting value test", async () => {
    // remove any previous entries...
    await page.evaluate(function () {
      document.querySelector("input#email").value = "";
    });

    // type in first name, last name and username
    await page.type("#firstName", "name");
    await page.type("#lastName", "lastname");
    await page.type("#username", "username");
    await page.type("#accountPassword", "validPassword123!*#");
    await page.type("#passwordConfirm", "validPassword123!*#");

    const invalidEmail = i18n.__("invalidEmail");

    //input invalid email
    await page.type("#email", "invaildEmail");
    await page.$eval("#email", e => e.blur());

    const checkInvalidEntry = await checkThis(
      page,
      "[id*='blend-toast-']",
      // "#blend-toast-4",
      invalidEmail,
      2000,
    );
    // console.log("CHECK ", checkInvalidEntry);
    expect(checkInvalidEntry).toBe(true);

    //   done();
    // }, 8000);
  });
  test("Login link button click", async () => {
    await page.waitForSelector("#loginLinkButton");

    await page.click("#loginLinkButton");
    // const forgotPasswordTitle = "Forgot username?";
    const loginTitle = i18n.__("loginPage");
    const checkTitle = await checkThis(page, "body", loginTitle, 3000);
    expect(checkTitle).toBe(true);
    await page.click(".createAccountButton");
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
