/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import usePasswordPopup from "../../components/usePasswordPopup";
import { ConvertRGBtoHex } from "../utils";

const PasswordPopup = (props) => {

  const { reference, TooltipComponent } = usePasswordPopup({ ...props });


  return <><div style={{
    display: "flex", height: "500px", width: "100%", justifyContent: "center",
    alignItems: "center",
  }}>
    <p ref={reference}>Testing</p>
    {TooltipComponent}
  </div></>
}

export default {
  title: "Components UI/PasswordPopup",
  component: PasswordPopup,
  args: {
    verifications: Array(4).fill(false)
  }

};

//console.log(ConvertRGBtoHex(255, 100, 200));

const Template = args => <PasswordPopup {...args} />;
export const PasswordPopupSB = Template.bind({});

PasswordPopupSB.storyName = "SB";

export const PasswordPopupSBInteractive = Template.bind({});

PasswordPopupSBInteractive.storyName = "Interactive";


const verificationsDecorator = (story, ctx) => {

  const { verifications } = ctx.args;
  //console.log(verifications);
  // set first one tested...
  verifications[0] = true;
  ctx.args.verifications = verifications;


  return <>{story()}</>
}


PasswordPopupSBInteractive.decorators = [verificationsDecorator]

const PlayTest = async ({ args, canvasElement, parameters }) => {

  console.log("ARGS ", args, parameters);

  const canvas = within(canvasElement);
  const testMe = canvas.getByTestId('condition-1');

  const testedColor = "#00847A";  // should get this from theme....

  const result = getComputedStyle(testMe, ":before").color;   // returns rgb color
  const rbgValues = result.match(/\d+/g);
  const hexColor = ConvertRGBtoHex(...rbgValues);
  expect(hexColor).toBe(testedColor);
  /*
  console.log("INP ", input.classList);
  for (let i = 0; i < input.classList.length; i++) {
    const cls = document.querySelector("." + input.classList[i]);
    console.log("STYLE CLASS ", input.classList[i], cls);
    const result = getComputedStyle(cls, ":before").color;
    console.log("STYLE RES ", result);
  }
  */

};

PasswordPopupSBInteractive.play = PlayTest;

/*
const toastProviderDecorator = (Story) => (
  <ToastContextProvider ><Story /></ToastContextProvider>
);

const verificationFieldDecorator = (story, ctx) => {
  // console.log("CTX SB ", ctx);
  const inputRef = useRef();

  const { __ } = useTranslate();

  ctx.args.options.txt = Object.assign(ctx.args.options.txt, initTexts(__));
  ctx.args.options.toast = ctx.args.toast;
  ctx.args.ref = inputRef;
  const [inputIsValid, setInputIsValid] = useState(true);
  ctx.args.inputState = [inputIsValid, setInputIsValid];
  return <><MockStore ><div>{story()}</div></MockStore><div><button onClick={() => {
    console.log("INPUT ", inputRef.current.dataset, inputRef.current.value, inputIsValid);
  }}>CHECK</button></div></>
}

*/