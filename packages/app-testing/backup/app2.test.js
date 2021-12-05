describe("search2", () => {
  console.log("ENV ", process.env);

  it("needs tests");
});

test("login form works correctly", async () => {
  //const page2 = await browser.newPage();

  //await page2.goto(process.env.TEST_URL + "login");
  const usernameEl = await page.$("#username");
  const passwordEl = await page.$("#password");

  const invalidEntry = i18nTranslate.__("invalidEntry");
  await usernameEl.tap();
  await page.keyboard.press("Enter");
  // check if empty username triggers toast

  const checkInvalidEntry = await checkThis(
    page,
    "[id*='blend-toast-']",
    invalidEntry
  );
  //console.log("CHECK ", checkInvalidEntry);
  expect(checkInvalidEntry).toBe(true);
  /*
  const selector = "[id*='blend-toast-']";
  try {
    await page.waitForFunction(
      (invalidEntry, selector) => {
      

        return document
          .querySelector(selector)
          .innerText.includes(invalidEntry);
      },
      {},
      invalidEntry,
      selector
    );
    console.log(`The text "${invalidEntry}" was found on the page`);
  } catch (e) {
    console.log(`The text "${invalidEntry}" was not found on the page`);
    //found = false;
  }
*/
  //await page.$eval("#username", (e) => e.blur());

  //await page.type("#username", "test");

  //console.log("USER ", usernameEl);

  //console.log("PASS ", passwordEl);

  /*
  const page2 = await browser.newPage()
  await page2.emulate(iPhone)
  await page2.goto('http://localhost:3000/')

  const firstNameEl = await page2.$('[data-testid="firstName"]')
  const lastNameEl = await page2.$('[data-testid="lastName"]')
  const emaildEl = await page2.$('[data-testid="email"]')
  const passwordEl = await page2.$('[data-testid="password"]')
  const submitEl = await page2.$('[data-testid="submit"]')

  await firstNameEl.tap()    
  await page2.type('[data-testid="firstName"]', user.firstName)

  await lastNameEl.tap()        
  await page2.type('[data-testid="lastName"]', user.lastName)

  await emaildEl.tap()            
  await page2.type('[data-testid="email"]', user.email)

  await passwordEl.tap()
  await page2.type('[data-testid="password"]', user.password)

  await submitEl.tap()    

  await page2.waitForSelector('[data-testid="success"]')
  */
}, 16000);

  /*
  test("nav loads correctly", async () => {
    const navbar = await page.$eval('[data-testid="navbar"]', (el) =>
      el ? true : false
    );
    const listItems = await page.$$('[data-testid="navBarLi"]');

    expect(navbar).toBe(true);
    expect(listItems.length).toBe(4);
  });
  */
});
