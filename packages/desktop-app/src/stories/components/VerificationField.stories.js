/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { ToastContextProvider } from "@blend-ui/toast";
import { useTranslate, } from "@prifina-apps/utils";
import VerificationField from "../../components/VerificationField";

import { MockStore } from "../MockPrifinaStore";


const sleep = ms => new Promise(r => setTimeout(r, ms));

export default {
  title: "Components Input/VerificationField",
  component: VerificationField,
  args: {
    options: { value: "", txt: {} },
    toast: false
  },

};

const Template = args => <VerificationField {...args} />;
export const VerificationFieldSB = Template.bind({});

VerificationFieldSB.storyName = "SB";

const toastProviderDecorator = (Story) => (
  <ToastContextProvider ><Story /></ToastContextProvider>
);


const initTexts = (t) => {
  return { "invalidTxt": "", "codeLengthError": t("codeLengthError"), "codeDigitsError": t("codeDigitsError"), "placeholderTxt": t("codePrompt"), "promptTxt": "" };
}


const verificationFieldDecorator = (story, ctx) => {
  // console.log("CTX SB ", ctx);
  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts(__));
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.ref = inputRef;

  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);
  }

  return <><MockStore ><div>{story()}</div></MockStore><div><button onClick={() => {
    console.log("INPUT ", inputRef.current.dataset, inputRef.current.value);
  }}>CHECK</button></div></>
}

VerificationFieldSB.decorators = [toastProviderDecorator, verificationFieldDecorator]



export const VerificationFieldSBInteractive = Template.bind({});


// copy args...
VerificationFieldSBInteractive.args = { ...VerificationFieldSB.args }

const verificationFieldInteractiveDecorator = (story, ctx) => {

  console.log("CTX ", ctx);

  const { __ } = useTranslate();

  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts(__));
  const inputRef = useRef();
  ctx.args.ref = inputRef;
  ctx.args.options.toast = ctx.args.toast;



  const [inputIsValid, setInputIsValid] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(true);
  const [verificationValue, setVerificationValue] = useState("");

  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);
    console.log("REF DATA ", inputRef.current.dataset['isvalid'])
    //console.log("EVENT ", event.target.id);
    setVerificationStatus("STATUS:" + inputRef.current.dataset['isvalid']);
    setVerificationValue("VALUE:" + inputRef.current.value);

    setInputIsValid(input.dataset['isvalid']);
  };

  return <><MockStore ><div>{story()}</div></MockStore><div><button role="check-entry" onClick={() => {
    console.log("INPUT INTERACTIVE ", inputRef.current.dataset, inputRef.current.value, inputIsValid);

  }}>CHECK</button></div>
    <div>{verificationStatus}</div>
    <div>{verificationValue}</div>

    <div>STATE:{inputIsValid.toString()}</div>

  </>
}

VerificationFieldSBInteractive.decorators = [toastProviderDecorator, verificationFieldInteractiveDecorator]

VerificationFieldSBInteractive.storyName = "Interactive";


const PlayTest = async ({ args, canvasElement, parameters }) => {

  console.log("ARGS ", args);

  const canvas = within(canvasElement);
  const input = canvas.getByTestId('verificationCode');

  const wrongCode = '1234';
  const goodCode = '123456';
  await userEvent.type(input, wrongCode + "a");

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



}

VerificationFieldSBInteractive.play = PlayTest;