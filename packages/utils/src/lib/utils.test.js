import React from "react";
import {
  validEmail,
  lowerCaseChars,
  upperCaseChars,
  digitChars,
  hasSpaces,
  hasNonChars,
  checkPwList,
  checkPassword,
  isValidNumber,
} from "./utils";

it("Test email validation, valid email ", () => {
  expect.assertions(1);
  const result = validEmail("tero@prifina.com");

  expect(result).toBe(true);
});

it("Test email validation, invalid email", () => {
  expect.assertions(1);
  const result = validEmail("tero#prifina.com");

  expect(result).toBe(false);
});

it("Test lower case chars validation, invalid string", () => {
  expect.assertions(1);
  const result = lowerCaseChars("BBBBB");

  expect(result).toBe(false);
});

it("Test lower case chars validation, valid string", () => {
  expect.assertions(1);
  const result = lowerCaseChars("BBaaaaaBB");

  expect(result).toBe(true);
});

it("Test upper case chars validation, invalid string", () => {
  expect.assertions(1);
  const result = upperCaseChars("aaaaa");

  expect(result).toBe(false);
});

it("Test upper case chars validation, valid string", () => {
  expect.assertions(1);
  const result = upperCaseChars("BBBB");

  expect(result).toBe(true);
});

it("Test digit chars validation, invalid string", () => {
  expect.assertions(1);
  const result = digitChars("aaaaa");

  expect(result).toBe(false);
});

it("Test digit chars validation, valid string", () => {
  expect.assertions(1);
  const result = digitChars("BBBB1232");

  expect(result).toBe(true);
});

it("Test space chars validation, invalid string", () => {
  expect.assertions(1);
  const result = hasSpaces("aaaaa");

  expect(result).toBe(false);
});

it("Test space chars validation, valid string", () => {
  expect.assertions(1);
  const result = hasSpaces("BBBB 1232");

  expect(result).toBe(true);
});
it("Test non-chars validation, invalid string", () => {
  expect.assertions(1);
  const result = hasNonChars("aaaaa");

  expect(result).toBe(false);
});

it("Test non-chars validation, valid string", () => {
  expect.assertions(1);
  const result = hasNonChars("BBBB#1232");

  expect(result).toBe(true);
});

it("Test password list validation, invalid string", () => {
  expect.assertions(1);
  const result = checkPwList("tero");

  expect(result).toBe(false);
});

it("Test password list validation, valid string", () => {
  expect.assertions(1);
  const result = checkPwList("password");

  expect(result).toBe(true);
});

it("Test password validation, valid string", () => {
  expect.assertions(2);
  const result = checkPassword("qqWW11==22!!", 10, ["tero", "test"]);
  //console.log(result);
  expect(typeof result).toBe("object");
  expect(result).toEqual([true, true, true, true, true]);
  /*
  expect(result).toEqual(
    expect.arrayContaining([true])
  );
  */
});

it("Test password validation, invalid string", () => {
  expect.assertions(2);
  const result = checkPassword("password", 10, ["tero", "test"]);
  //console.log(result);
  expect(typeof result).toBe("object");
  expect(result).toEqual([false, false, false, false, false]);
});

it("Test phone number validation, valid number", () => {
  expect.assertions(2);
  const result = isValidNumber("+358407077102");
  console.log(result);
  //expect(typeof result).toBe("object");
  expect(typeof result).toEqual("object");
  expect(Object.keys(result).length).toBeGreaterThan(0);
});
it("Test phone number validation, invalid number", () => {
  expect.assertions(2);
  const result = isValidNumber("0407077102");
  console.log(result);
  //expect(typeof result).toBe("object");
  expect(typeof result).toEqual("object");
  expect(Object.keys(result).length).toBe(0);
});
//const { validEmail } = require("../src/lib/utils");

/*
test('renders learn react link', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
  */
/*
it("Test email validation", () => {
  expect.assertions(1);
  const result = validEmail("tero@prifina.com");

  expect(result).toBe(true);
});
*/
/*
it('Test faker function,transaction ', async () => {
    expect.assertions(1);
    const {getData} = require('./get/FakerData');
    const random = await getData('transaction');
    //console.log(random);
    expect(typeof random).toBe('object');
});
*/
/*
describe("NewsContent", () => {
  it.todo("Should render a normal string"); // This will show up as a todo in our test suite! Woohoo!
});
*/
