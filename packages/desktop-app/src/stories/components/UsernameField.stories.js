/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { ToastContextProvider } from "@blend-ui/toast";
import { useTranslate, } from "@prifina-apps/utils";
import UsernameField from "../../components/UsernameField";

import { MockStore } from "../MockPrifinaStore";

import config from "../../config";

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default {
  title: "Components Input/UsernameField",
  component: UsernameField,
  args: {
    options: { value: "", txt: {} },
    toast: false,
    checkExists: false,
  },
  /*
  argTypes: {

    toast: {
      control: 'boolean'
    }

  }
*/
  /*
  argTypes: {
    navigate: { action: "navigation action" },
  },
  */
  //excludeStories: ["Template",'PlayTest',"VersionPlayTest"]
};
/*
argTypes:{
  contentArea: {
    table: {
      disable: true,
    },
  },
}  
*/
const Template = args => <UsernameField {...args} />;
export const UsernameFieldSB = Template.bind({});

UsernameFieldSB.storyName = "SB";

const toastProviderDecorator = (Story) => (
  <ToastContextProvider ><Story /></ToastContextProvider>
);

const initTexts = (t) => {
  return { "invalidTxt": "", "usernameError": t("usernameError", { length: config.usernameLength }), "usernameError2": t("usernameError2"), "usernameExists": t("usernameExists"), "placeholderTxt": t("usernamePlaceholder"), "promptTxt": "" };
}


const usernameFieldDecorator = (story, ctx) => {
  // console.log("CTX SB ", ctx);
  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts(__));
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.options.checkExists = ctx.args.checkExists;
  ctx.args.ref = inputRef;

  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);

  };

  return <><MockStore checkUser={ctx.parameters.checkUser}><div>{story()}</div></MockStore><div><button onClick={() => {
    console.log("INPUT ", inputRef.current.dataset, inputRef.current.value);
  }}>CHECK</button></div></>
}
UsernameFieldSB.parameters = { checkUser: false };

UsernameFieldSB.decorators = [toastProviderDecorator, usernameFieldDecorator]


export const UsernameFieldSBCheckUserTrue = Template.bind({});

UsernameFieldSBCheckUserTrue.storyName = "SB, user exists";
UsernameFieldSBCheckUserTrue.parameters = { checkUser: true };
/*
const usernameFieldCheckUserTrueDecorator = (story, ctx) => {
  console.log("CTX SB ", ctx);
  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts(__));
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.options.checkExists = ctx.args.checkExists;
  ctx.args.ref = inputRef;
  return <><MockStore checkUser={ctx.parameters.checkUser}><div>{story()}</div></MockStore><div><button onClick={() => {
    console.log("INPUT ", inputRef.current.dataset, inputRef.current.value);
  }}>CHECK</button></div></>
}
*/

UsernameFieldSBCheckUserTrue.decorators = [toastProviderDecorator, usernameFieldDecorator]

export const UsernameFieldSBInteractive = Template.bind({});


UsernameFieldSBInteractive.parameters = { checkUser: true };

// copy args...
UsernameFieldSBInteractive.args = { ...UsernameFieldSB.args }

const usernameFieldInteractiveDecorator = (story, ctx) => {

  console.log("CTX ", ctx);

  const { __ } = useTranslate();

  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts(__));
  const inputRef = useRef();
  ctx.args.ref = inputRef;
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.options.checkExists = ctx.args.checkExists;


  const [inputIsValid, setInputIsValid] = useState(true);

  const [usernameStatus, setUsernameStatus] = useState(true);
  const [usernameValue, setUsernameValue] = useState("");

  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input, input.dataset);
    console.log("REF DATA ", inputRef.current.dataset['isvalid'])
    //console.log("EVENT ", event.target.id);
    setUsernameStatus("STATUS:" + inputRef.current.dataset['isvalid']);
    setUsernameValue("VALUE:" + inputRef.current.value);

    setInputIsValid(input.dataset['isvalid']);
  };



  return <><MockStore checkUser={ctx.parameters.checkUser}><div>{story()}</div></MockStore><div><button role="check-entry" onClick={() => {
    console.log("INPUT ", inputRef.current.dataset, inputRef.current.value);


  }}>CHECK</button></div>
    <div>{usernameStatus}</div>
    <div>{usernameValue}</div>
    <div>STATE:{inputIsValid.toString()}</div>
  </>
}

UsernameFieldSBInteractive.decorators = [toastProviderDecorator, usernameFieldInteractiveDecorator]

UsernameFieldSBInteractive.storyName = "Interactive";

const PlayTest = async ({ args, canvasElement, parameters }) => {

  console.log("ARGS ", args);

  const canvas = within(canvasElement);
  const input = canvas.getByTestId('username');

  const wrongName = '1234';
  const goodName = 'anybody';
  await userEvent.type(input, wrongName);
  // test onBlur
  await userEvent.tab();

  if (args.options.toast && !args.options.checkExists) {
    await waitFor(async () => {
      await expect(screen.getByText(args.options.txt.usernameError)).toBeInTheDocument();
    });
  }


  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    await expect(canvas.getByText("STATUS:false")).toBeVisible();
    await expect(canvas.getByText("VALUE:" + wrongName)).toBeVisible();
    await userEvent.clear(input);
  });



  await userEvent.type(input, goodName);
  // enter pressed
  await userEvent.keyboard('{Enter}');



  console.log("ARGS2 ", args.options.checkExists, parameters.checkUser);
  let statusText = "STATUS:true";
  if (args.options.checkExists && parameters.checkUser) {
    statusText = "STATUS:false";
    await waitFor(async () => {
      await expect(screen.getByText(args.options.txt.usernameExists)).toBeInTheDocument();
    });
  }

  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    await expect(canvas.getByText(statusText)).toBeVisible();
    await expect(canvas.getByText("VALUE:" + goodName)).toBeVisible();
    await userEvent.clear(input);
  });


}

UsernameFieldSBInteractive.play = PlayTest;

