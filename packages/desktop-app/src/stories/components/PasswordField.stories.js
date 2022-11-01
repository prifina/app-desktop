/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { ToastContextProvider } from "@blend-ui/toast";
import { useTranslate, } from "@prifina-apps/utils";
import PasswordField from "../../components/PasswordField-v2";

import { ConvertRGBtoHex } from "../utils";

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default {
  title: "Components Input/PasswordField",
  component: PasswordField,
  args: {
    options: { addPopup: true, value: "", txt: {}, checkList: () => ["firstName", "lastName", "userName"] },
    toast: false
  },

};

const Template = args => <PasswordField {...args} />;
export const PasswordFieldSB = Template.bind({});

PasswordFieldSB.storyName = "SB";

const toastProviderDecorator = (Story) => (
  <ToastContextProvider ><Story /></ToastContextProvider>
);


const initTexts = (t) => {
  return { "invalidTxt": "", "invalidEntry": t("invalidEntry"), "passwordQuality": t("passwordQuality"), "placeholderTxt": t("passwordPlaceholder"), "promptTxt": "" };
}


const PasswordFieldDecorator = (story, ctx) => {
  // console.log("CTX SB ", ctx);
  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts(__));
  ctx.args.options.toast = ctx.args.toast;

  ctx.args.ref = inputRef;
  ctx.args.id = "password";
  ctx.args.name = "password";

  const [inputIsValid, setInputIsValid] = useState(true);

  const [passwordStatus, setPasswordStatus] = useState(true);
  const [passwordValue, setPasswordValue] = useState("");

  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);
    console.log("REF DATA ", inputRef.current.dataset['isvalid'])
    //console.log("EVENT ", event.target.id);
    setPasswordStatus("STATUS:" + inputRef.current.dataset['isvalid']);
    setPasswordValue("VALUE:" + inputRef.current.value);

    setInputIsValid(input.dataset['isvalid']);
  };



  return <><div style={{
    display: "flex", height: "600px", width: "100%", justifyContent: "center",
    alignItems: "center",
  }}>
    <div style={{ display: "block", }}>
      <div style={{ marginBottom: "20px" }}><input role="blur-input" autoFocus={true} /></div>
      <div>{story()}</div>
    </div>
  </div><div><button role="check-entry" onClick={() => {
    //console.log("INPUT ", inputRef.current.dataset, inputRef.current.value, inputIsValid);
    console.log("INPUT ", inputRef, inputRef.current);
    //setPasswordStatus(inputRef.current.dataset['isvalid']);
    //setPasswordValue(inputRef.current.value);
    //setInputStatus(inputIsValid);
  }}>CHECK</button></div>
    <div>{passwordStatus}</div>
    <div>{passwordValue}</div>
    <div>STATE:{inputIsValid.toString()}</div>
  </>
}


PasswordFieldSB.decorators = [toastProviderDecorator, PasswordFieldDecorator]


export const PasswordFieldConfirmationSB = Template.bind({});


const initTexts2 = (t) => {
  return { "invalidTxt": "", "invalidEntry": t("invalidPassword"), "placeholderTxt": t("confirmPlaceholder"), "promptTxt": "" };
}
const PasswordFieldConfirmationDecorator = (story, ctx) => {
  // console.log("CTX SB ", ctx);
  const inputRef = useRef();

  const { __ } = useTranslate();
  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts2(__));
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.options.addPopup = false; // confirmation doesn't show popup..
  ctx.args.options.accoutPassword = () => {
    return "Password121#";
  }

  ctx.args.ref = inputRef;
  ctx.args.id = "passwordConfirm";
  ctx.args.name = "passwordConfirm";

  const [inputIsValid, setInputIsValid] = useState(true);

  const [passwordStatus, setPasswordStatus] = useState(true);
  const [passwordValue, setPasswordValue] = useState("");

  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);
    console.log("REF DATA ", inputRef.current.dataset['isvalid'])
    //console.log("EVENT ", event.target.id);
    setPasswordStatus("STATUS:" + inputRef.current.dataset['isvalid']);
    setPasswordValue("VALUE:" + inputRef.current.value);

    setInputIsValid(input.dataset['isvalid']);
  };



  return <><div style={{
    display: "flex", height: "600px", width: "100%", justifyContent: "center",
    alignItems: "center",
  }}>
    <div style={{ display: "block", }}>
      <div style={{ marginBottom: "20px" }}><input ref={accountRef} role="blur-input" autoFocus={true} /></div>
      <div>{story()}</div>
    </div>
  </div><div><button role="check-entry" onClick={() => {
    //console.log("INPUT ", inputRef.current.dataset, inputRef.current.value, inputIsValid);
    console.log("INPUT ", inputRef, inputRef.current);
    //setPasswordStatus(inputRef.current.dataset['isvalid']);
    //setPasswordValue(inputRef.current.value);
    //setInputStatus(inputIsValid);
  }}>CHECK</button></div>
    <div>{passwordStatus}</div>
    <div>{passwordValue}</div>
    <div>STATE:{inputIsValid.toString()}</div>
  </>
}


PasswordFieldConfirmationSB.decorators = [toastProviderDecorator, PasswordFieldConfirmationDecorator]

PasswordFieldConfirmationSB.storyName = "Confirmation-SB";

// copy args...
//PasswordFieldConfirmationSB.args = { ...PasswordFieldSB.args }


export const PasswordFieldSBInteractive = Template.bind({});



// copy args...
PasswordFieldSBInteractive.args = { ...PasswordFieldSB.args }

PasswordFieldSBInteractive.decorators = [toastProviderDecorator, PasswordFieldDecorator]

PasswordFieldSBInteractive.storyName = "Interactive";


const PlayTest = async ({ args, canvasElement, parameters }) => {

  console.log("ARGS ", args);

  const canvas = within(canvasElement);
  const input = canvas.getByTestId('password');
  const wrongPass = '1234a';
  const goodPass = '1234Aa!xxxx';
  await userEvent.type(input, wrongPass);
  // enter pressed
  await userEvent.keyboard('{Enter}');

  if (args.options.toast) {
    await waitFor(async () => {
      await expect(screen.getByText(args.options.txt.passwordQuality)).toBeInTheDocument();
    });
  }

  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    await expect(canvas.getByText("STATUS:false")).toBeVisible();
    await expect(canvas.getByText("VALUE:" + wrongPass)).toBeVisible();
    await expect(canvas.getByText("STATE:false")).toBeVisible();
    await userEvent.clear(input);
  });


  await userEvent.type(input, goodPass);

  const testedColor = "#00847A";  // should get this from theme....
  const untestedColor = "#C3C2C2";
  // from popup
  const testMe = canvas.getByTestId('condition-1');  // this has to tested before onBlur... 
  //console.log("TEST ", testMe)

  const result = getComputedStyle(testMe, ":before").color;   // returns rgb color
  const rbgValues = result.match(/\d+/g);
  const hexColor = ConvertRGBtoHex(...rbgValues);
  expect(hexColor).toBe(testedColor);


  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    await expect(canvas.getByText("STATUS:true")).toBeInTheDocument();
    await expect(canvas.getByText("VALUE:" + goodPass)).toBeVisible();
    await expect(canvas.getByText("STATE:true")).toBeInTheDocument();
  });

  /*
    const result = getComputedStyle(testMe, ":before").color;   // returns rgb color
    const rbgValues = result.match(/\d+/g);
    const hexColor = ConvertRGBtoHex(...rbgValues);
    expect(hexColor).toBe(testedColor);
    */

  /*
  const testedColor = "#00847A";  // should get this from theme....
  const untestedColor ="#C3C2C2";
  // from popup
  const testMe = canvas.getByTestId('condition-1');

  const result = getComputedStyle(testMe, ":before").color;   // returns rgb color
  const rbgValues = result.match(/\d+/g);
  const hexColor = ConvertRGBtoHex(...rbgValues);
  expect(hexColor).toBe(testedColor);
  */

  /*
  const wrongCode = '1234a';
  const goodCode = '123456';
  await userEvent.type(input, wrongCode);

  if (args.options.toast) {
    await waitFor(async () => {
      await expect(screen.getByText(args.options.txt.codeDigitsError)).toBeInTheDocument();
    });
  }


  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    await expect(canvas.getByText("STATUS:false")).toBeVisible();
    await expect(canvas.getByText("VALUE:" + wrongCode)).toBeVisible();
    await expect(canvas.getByText("STATE:false")).toBeVisible();
    await userEvent.clear(input);
  });


  await userEvent.type(input, goodCode);


  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    await expect(canvas.getByText("STATUS:true")).toBeInTheDocument();
    await expect(canvas.getByText("STATE:true")).toBeInTheDocument();
  });

*/

}

PasswordFieldSBInteractive.play = PlayTest;
