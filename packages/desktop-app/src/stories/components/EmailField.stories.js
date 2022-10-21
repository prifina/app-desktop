/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { ToastContextProvider } from "@blend-ui/toast";
import { useTranslate, } from "@prifina-apps/utils";
import EmailField from "../../components/EmailField";

import { MockStore } from "../MockPrifinaStore";

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default {
  title: "Components Input/EmailField",
  component: EmailField,
  args: {
    options: { value: "", checkExists: false, toast: false },
    toast: false,
    checkExists: false,
  }
  /*
  argTypes: {
    navigate: { action: "navigation action" },
  },
  */
  //excludeStories: ["Template",'PlayTest',"VersionPlayTest"]
};

const Template = args => <EmailField {...args} />;
export const EmailFieldSB = Template.bind({});

EmailFieldSB.storyName = "SB";

const toastProviderDecorator = (Story) => (
  <ToastContextProvider ><Story /></ToastContextProvider>
);

const initTexts = (t) => {
  return { "invalidTxt": t("invalidEmail"), "placeholderTxt": t("emailPlaceholder"), "promptTxt": t("emailPrompt") };
}


const emailFieldDecorator = (story, ctx) => {
  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options = Object.assign(ctx.args.options, initTexts(__));
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.options.checkExists = ctx.args.checkExists;
  ctx.args.ref = inputRef;

  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);

  };


  return <><MockStore><div>{story()}</div></MockStore><div><button onClick={() => {
    console.log("INPUT ", inputRef.current.dataset, inputRef.current.value);
  }}>CHECK</button></div></>
}
EmailFieldSB.decorators = [toastProviderDecorator, emailFieldDecorator]


export const EmailFieldSBInteractive = Template.bind({});

const emailFieldInteractiveDecorator = (story, ctx) => {
  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options = Object.assign(ctx.args.options, initTexts(__));
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.options.checkExists = ctx.args.checkExists;
  ctx.args.ref = inputRef;


  const [inputIsValid, setInputIsValid] = useState(true);
  const [emailStatus, setEmailStatus] = useState(true);
  const [emailValue, setEmailValue] = useState("");

  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);
    console.log("REF DATA ", inputRef.current.dataset['isvalid'])
    //console.log("EVENT ", event.target.id);
    setEmailStatus("STATUS:" + inputRef.current.dataset['isvalid']);
    setEmailValue("VALUE:" + inputRef.current.value);

    setInputIsValid(input.dataset['isvalid']);
  };


  return <><MockStore><div>{story()}</div></MockStore><div><button role="check-entry" onClick={() => {
    console.log("INPUT ", inputRef.current.dataset, inputRef.current.value);
    //setEmailStatus(inputRef.current.dataset['isvalid']);
    // setEmailValue(inputRef.current.value);

  }}>CHECK</button></div>
    <div>{emailStatus}</div>
    <div>{emailValue}</div>

    <div>STATE:{inputIsValid.toString()}</div>
  </>
}

EmailFieldSBInteractive.decorators = [toastProviderDecorator, emailFieldInteractiveDecorator]

EmailFieldSBInteractive.storyName = "Interactive";


const PlayTest = async ({ args, canvasElement }) => {

  const canvas = within(canvasElement);
  const input = canvas.getByTestId('email');

  const wrongEmail = 'anybody@anywhere';
  const goodEmail = 'anybody@anywhere.org';
  await userEvent.type(input, wrongEmail);
  // test onBlur
  await userEvent.tab();
  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    await expect(canvas.getByText("STATUS:false")).toBeVisible();
    await expect(canvas.getByText("VALUE:" + wrongEmail)).toBeVisible();
    await userEvent.clear(input);
  });

  await userEvent.type(input, goodEmail);
  // enter pressed
  await userEvent.keyboard('{Enter}');
  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    await expect(canvas.getByText("STATUS:true")).toBeVisible();
    await expect(canvas.getByText("VALUE:" + goodEmail)).toBeVisible();
    await userEvent.clear(input);
  });

  /*
    await userEvent.keyboard('{End}');
    await userEvent.type(nameInput,"-test");
    await userEvent.keyboard('{Enter}');
    // auto update delay is 5secs
    await sleep(5100);
  */
}

EmailFieldSBInteractive.play = PlayTest;


export const EmailFieldSBInteractiveToast = Template.bind({});

const emailFieldInteractiveToastDecorator = (story, ctx) => {
  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options = Object.assign(ctx.args.options, initTexts(__));
  //ctx.args.options.toast = ctx.args.toast;
  //ctx.args.options.checkExists = ctx.args.checkExists;
  ctx.args.options.toast = true;
  ctx.args.options.checkExists = false;
  ctx.args.ref = inputRef;
  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);

  };


  return <><MockStore><div>{story()}</div></MockStore>
  </>
}

EmailFieldSBInteractiveToast.decorators = [toastProviderDecorator, emailFieldInteractiveToastDecorator]

EmailFieldSBInteractiveToast.storyName = "Interactive with Toast";



const PlayTestToast = async ({ args, canvasElement }) => {

  //console.log("ARGS ", args);
  const canvas = within(canvasElement);
  const input = canvas.getByTestId('email');

  const wrongEmail = 'anybody@anywhere';

  await userEvent.type(input, wrongEmail);
  // test onBlur
  await userEvent.tab();
  await waitFor(async () => {
    await expect(screen.getByText(args.options.invalidTxt)).toBeInTheDocument();
  });


  /*
    await userEvent.keyboard('{End}');
    await userEvent.type(nameInput,"-test");
    await userEvent.keyboard('{Enter}');
    // auto update delay is 5secs
    await sleep(5100);
  */
}

EmailFieldSBInteractiveToast.play = PlayTestToast;




export const EmailFieldSBCheckEmail = Template.bind({});

//EmailFieldSBInteractiveToast.decorators = [toastProviderDecorator,
EmailFieldSBCheckEmail.parameters = { checkEmail: false };

const emailFieldSBCheckEmailDecorator = (story, ctx) => {
  console.log("CONTEXT ", ctx.parameters)
  const inputRef = useRef();

  const { __ } = useTranslate();

  //const { __ } = useTranslate();
  ctx.args.options = Object.assign(ctx.args.options, initTexts(__));
  /*
  ctx.args.options["invalidEmail"] = __("invalidEmail");
  ctx.args.options["emailPlaceholder"] = __("emailPlaceholder");
  ctx.args.options["emailPrompt"] = __("emailPrompt");
*/
  ctx.args.options.toast = false;
  ctx.args.options.checkExists = true;
  ctx.args.ref = inputRef;


  const [inputIsValid, setInputIsValid] = useState(true);
  const [emailStatus, setEmailStatus] = useState(true);
  const [emailValue, setEmailValue] = useState("");

  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);
    console.log("REF DATA ", inputRef.current.dataset['isvalid'])
    //console.log("EVENT ", event.target.id);
    setEmailStatus("STATUS:" + inputRef.current.dataset['isvalid']);
    setEmailValue("VALUE:" + inputRef.current.value);

    setInputIsValid(input.dataset['isvalid']);
  };

  return <MockStore checkEmail={ctx.parameters.checkEmail}><div>{story()}</div>


    <div><button role="check-entry" onClick={() => {
      console.log("INPUT ", inputRef.current.dataset, inputRef.current.value);


    }}>CHECK</button></div>
    <div>{emailStatus}</div>
    <div>{emailValue}</div>

    <div>STATE:{inputIsValid.toString()}</div>
  </MockStore>
}

EmailFieldSBCheckEmail.decorators = [toastProviderDecorator, emailFieldSBCheckEmailDecorator]


EmailFieldSBCheckEmail.storyName = "Check Email Exists, false";

// Check email exists....
export const EmailFieldSBCheckEmailTrue = Template.bind({});
EmailFieldSBCheckEmailTrue.parameters = { checkEmail: true };
EmailFieldSBCheckEmailTrue.decorators = [toastProviderDecorator, emailFieldSBCheckEmailDecorator]
EmailFieldSBCheckEmailTrue.storyName = "Check Email Exists, true";
