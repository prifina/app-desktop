import React, { useState, useReducer, useEffect, useRef, useCallback } from "react";

import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import PhoneNumberField from "../../components/PhoneNumberField-v2";

import { useTranslate, } from "@prifina-apps/utils";

import { ToastContextProvider } from "@blend-ui/toast";

import { MockStore } from "../MockPrifinaStore";


const sleep = ms => new Promise(r => setTimeout(r, ms));
const defaultRegion = "+358";

export default {
  title: "Components Input/PhoneNumberField",
  component: PhoneNumberField,
  args: {
    selectOptions: [],

    id: "phoneNumber",
    name: "phoneNumber",
    options: {
      defaultRegion: defaultRegion,
      searchLength: 3,
      showList: true,
      selectOption: "key",
      value: "+358",
      txt: {},
    },
    toast: true,
    checkExists: true
  },
  argTypes: {
    id: {
      table: {
        disable: true,
      },
    },
    name: {
      table: {
        disable: true,
      },
    },
    inputState: {
      table: {
        disable: true,
      },
    },
  }

};

const Template = args => <PhoneNumberField {...args} />;
export const PhoneNumberFieldSB = Template.bind({});


const toastProviderDecorator = (Story) => (
  <ToastContextProvider ><Story /></ToastContextProvider>
);
const initTexts = (t) => {
  return { "invalidTxt": t("invalidPhoneNumber"), "placeholderTxt": t("phoneNumberPlaceholder"), "promptTxt": t("phonePrompt") };
}


const PhoneNumberFieldDecorator = (story, ctx) => {
  //const boxRef = useRef();
  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts(__));
  ctx.args.ref = inputRef;
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.options.checkExists = ctx.args.checkExists;

  const [inputIsValid, setInputIsValid] = useState(true);
  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input);
    console.log("REF DATA ", inputRef.current.dataset['isvalid'])
    //console.log("EVENT ", event.target.id);

    setInputIsValid(input);
  };
  //ctx.args.boxRef = boxRef;
  /*
  ctx.args.onChange = (e, code) => {
    console.log("CODE ", code);
  }
  */
  return <><MockStore checkPhone={ctx.parameters.checkPhone}>
    <div style={{ margin: "50px", width: "300px" }} >{story()}</div>
  </MockStore>
  </>
}

PhoneNumberFieldSB.parameters = { checkPhone: true };
PhoneNumberFieldSB.decorators = [toastProviderDecorator, PhoneNumberFieldDecorator]


PhoneNumberFieldSB.storyName = "SB";


export const PhoneNumberFieldSBInteractive = Template.bind({});


PhoneNumberFieldSBInteractive.parameters = { checkPhone: true };
// copy args...
PhoneNumberFieldSBInteractive.args = { ...PhoneNumberFieldSB.args }


/*
export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event) {
      //console.log("EVENT ", event);
      //console.log("EVENT ", event.target.id);
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
  ];
}
*/

const phoneNumberFieldInteractiveDecorator = (story, ctx) => {

  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts(__));
  ctx.args.ref = inputRef;
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.options.checkExists = ctx.args.checkExists;

  /*
 const setInputIsValid (inp) => {
    console.log(" STATE INP ", inp);
    inputIsValid = inp;
  }];
*/
  const [inputIsValid, setInputIsValid] = useState({});

  const [phoneStatus, setPhoneStatus] = useState(true);
  const [phoneValue, setPhoneValue] = useState("");

  /*
  const updateState = useCallback((input) => {
    onsole.log("STATE UPDATE", input);
    //console.log("EVENT ", event.target.id);
    setInputIsValid(input);
  })
  ctx.args.inputState = updateState;
*/

  // better to use callback function....instead of state
  ctx.args.inputState = function (input) {
    console.log("STATE UPDATE", input);
    console.log("REF DATA ", inputRef.current.dataset['isvalid'])
    //console.log("EVENT ", event.target.id);
    setPhoneStatus("STATUS:" + inputRef.current.dataset['isvalid']);
    setPhoneValue("VALUE:" + inputRef.current.value);

    setInputIsValid(input);
  };



  // const [inputStatus, setInputStatus] = useState({});

  return <><MockStore checkPhone={ctx.parameters.checkPhone}><div>{story()}</div></MockStore>
    <div><button role="check-entry" onClick={() => {
      console.log("INPUT ", inputRef.current.dataset, inputRef.current.value, inputIsValid);
      console.log("INPUT ", inputRef.current.dataset['isvalid']);
      /*
      setPhoneStatus(inputRef.current.dataset['isvalid']);
      setPhoneValue(inputRef.current.value);
      setInputStatus(inputIsValid);
      */

    }}>CHECK</button></div>
    <div>{phoneStatus}</div>
    <div>{phoneValue}</div>
    <div>{"STATE:" + JSON.stringify(inputIsValid)}</div>
  </>
}

PhoneNumberFieldSBInteractive.decorators = [toastProviderDecorator, phoneNumberFieldInteractiveDecorator]

PhoneNumberFieldSBInteractive.storyName = "Interactive";



const PlayTest = async ({ args, canvasElement, parameters }) => {

  console.log("ARGS ", args);

  const canvas = within(canvasElement);

  // doesn't work with searchSelect component???
  //const regionInput = canvas.getByTestId('regionCode');
  //console.log("REGION ", regionInput);

  const input = canvas.getByTestId('phonenumber');

  // check default region is used.... 
  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    // await expect(canvas.getByText("STATUS:false")).toBeVisible();
    await expect(canvas.getByText("VALUE:" + args.defaultRegion)).toBeVisible();
    //await expect(canvas.getByText("STATE:false")).toBeVisible();
    //await userEvent.clear(input);
  });

  const wrongPhone = '1234';
  const goodPhone = '407077111';

  await userEvent.type(input, wrongPhone);

  // Blur event is triggered... 
  await userEvent.click(canvas.getByRole("check-entry"));
  await sleep(500);

  if (args.options.toast) {
    await waitFor(async () => {
      const results = screen.getAllByText(args.options.txt.invalidTxt);
      console.log("ERROR MSGS ", results[1].innerText);
      //await expect().toBeInTheDocument();
      await expect(results[1].innerText).toBe(args.options.txt.invalidTxt);
    });

    // auto update delay is 5secs
    await sleep(5000);
  }

  await waitFor(async () => {
    await expect(canvas.getByText("STATUS:false")).toBeVisible();
    await expect(canvas.getByText("VALUE:" + args.defaultRegion + wrongPhone)).toBeVisible();
    await expect(canvas.getByText("STATE:{}")).toBeVisible();

    await userEvent.clear(input);
  });



  await userEvent.type(input, args.defaultRegion + goodPhone);

  // On blur event triggered.... 
  await userEvent.click(canvas.getByRole("check-entry"));

  await waitFor(async () => {
    await expect(canvas.getByText("STATUS:true")).toBeVisible();
    await expect(canvas.getByText("VALUE:" + args.defaultRegion + goodPhone)).toBeVisible();
    const goodResult = {
      "countryCode": "FI",
      "regionCode": "358",
      "number": defaultRegion + goodPhone,
      "nationalNumber": goodPhone
    }
    await expect(canvas.getByText("STATE:" + JSON.stringify(goodResult))).toBeVisible();

  });


}

PhoneNumberFieldSBInteractive.play = PlayTest;