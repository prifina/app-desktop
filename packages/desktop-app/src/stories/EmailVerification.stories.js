/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { action } from '@storybook/addon-actions';
//import { actions } from '@storybook/addon-actions';

import { ToastContextProvider, useToast } from "@blend-ui/toast";
import EmailVerification from "../pages/EmailVerification-v2";

import { useTranslate, } from "@prifina-apps/utils";
import { MockStore } from "./MockPrifinaStore";
import { useStore } from "../stores/PrifinaStore";
import shallow from 'zustand/shallow'
//import { rest } from 'msw'
//import { worker } from './mocks/browser'


const sleep = ms => new Promise(r => setTimeout(r, ms));

const supportLink = "/support";

export default {
  title: "Pages Sub/EmailVerification",
  component: EmailVerification,
  args: {
    invalidLink: supportLink
  },
  argTypes: {
    backClick: { action: "Back Click" },
    verifyClick: { action: "Verify Click" },
    resendClick: { action: "Resend Click" },
    //onClickSave: actionSave ,
  },

};


// This will lead to { onClick: action('onClick'), ... }
//const eventsFromNames = actions('onClick', 'onMouseOver');

// This will lead to { onClick: action('clicked'), ... }
//const eventsFromObject = actions({ onClick: 'clicked', onMouseOver: 'hovered' });



const Template = args => <EmailVerification {...args} />;
export const EmailVerificationSB = Template.bind({});

// this works, but is not stopping href navigation... 
//EmailVerificationSB.parameters = { actions: { handles: ['click .link'] } };

EmailVerificationSB.storyName = "SB";

const toastProviderDecorator = (Story) => (
  <ToastContextProvider ><Story /></ToastContextProvider>
);

/*
const actionSave = (data) => {
  console.log("SAVE ACTION ", data);
  //console.log("LOG" ,action("Update action"));
  // action return the handler which allows to update logging... 
  const actionHandler = action();
  actionHandler("save action", data)
  return Promise.resolve(true);
}
*/

const AddListener = () => {
  const [link, setLink] = useState("")
  const preventClick = (e) => {
    //console.log('A link was clicked');
    //console.log("LINK ", e.target.href);
    setLink(e.target.href);
    const actionHandler = action();
    actionHandler("Support link clicked");
    e.preventDefault();
  }
  useEffect(() => {

    const link = document.querySelector('a.link');
    const listener = link.addEventListener('click', preventClick);
    return () => {
      if (listener) {
        link.removeEventListener("click", preventClick);
      }
    }
  })
  return <div>{link}</div>
}

const verificationDecorator = (story, ctx) => {

  //console.log("CTX ",ctx.parameters)
  const { __ } = useTranslate();

  ctx.parameters["invalidTxt"] = __("codeDigitsError");

  return <><MockStore >{story()}</MockStore>
    <AddListener />
  </>
}

// Use Storybook decorators and MSW runtime handlers
// to handle the same HTTP call differently for this particular story.
/*
const linkDecorator = (story, ctx) => {
  worker.use(
    rest.get(supportLink, (req, res, ctx) => {

      return res(ctx.json({ message: 'OK' }))
    })
  )
  return <>{story()}</>
}
*/
/*
EmailVerificationSB.parameters = {
  msw: {
    handlers: [
      rest.get(supportLink, (req, res, ctx) => {
        return res(
          ctx.text("OK")
        )
      }),
    ]
  },
}
*/

EmailVerificationSB.decorators = [toastProviderDecorator, verificationDecorator]


export const EmailVerificationSBInteractive = Template.bind({});


const activeMockupDecorator = (story, ctx) => {

  //console.log("CTX ",ctx.parameters)
  const { __ } = useTranslate();
  ctx.parameters["invalidTxt"] = __("codeDigitsError");
  // can change verifyResult by using prop "verifyResult", default is true 
  return <><MockStore ><div>{story()}</div></MockStore></>
}


// copy args...
EmailVerificationSBInteractive.args = { ...EmailVerificationSB.args }

EmailVerificationSBInteractive.decorators = [toastProviderDecorator, verificationDecorator]

EmailVerificationSBInteractive.storyName = "Interactive";

const PlayTest = async ({ args, canvasElement, parameters }) => {

  console.log("ARGS ", args, parameters);

  const canvas = within(canvasElement);
  const input = canvas.getByTestId('verificationCode');
  console.log("INP ", input);
  const wrongCode = '1234a';
  const goodCode = '123456';

  await userEvent.click(canvas.getByRole("back-click"));
  await expect(args.backClick).toHaveBeenCalled();

  const verifyButton = canvas.getByRole("verify-click");

  // should be still disabled...
  expect(verifyButton.disabled).toBe(true)

  await userEvent.type(input, wrongCode);
  await waitFor(async () => {
    await expect(screen.getByText(parameters.invalidTxt)).toBeInTheDocument();
  });

  //await userEvent.click(canvas.getByRole("verify-click"));
  // should be disabled...
  //await expect(args.verifyClick).not.toHaveBeenCalled();

}


EmailVerificationSBInteractive.play = PlayTest;



// to mockup HOC-component which calls EmailVerification
const ActiveTemplate = args => {

  // this doesn't work in decorator level ... why toast works?
  const { resendCode, verifyCode } = useStore((state) => ({ verifyCode: state.verifyCode, resendCode: state.resendCode }),
    shallow
  );

  const { __ } = useTranslate();
  const alerts = useToast();

  //console.log("STORE", checkCognitoAttributeQuery);

  args.resendClick = () => {
    const actionHandler = action();
    actionHandler("Resend clicked", "email");
    resendCode("email").then(res => {
      alerts.info(__("emailVerificatioSent"), {});
    });
  }

  args.verifyClick = (code) => {
    const actionHandler = action();
    actionHandler("Verify clicked", code);
    verifyCode(code).then(res => {
      console.log("Verified...", res);
    })

  }
  //console.log("ACIVE MOCKUP", args);


  return <>
    <EmailVerification {...args} />
    <AddListener />
  </>
};

export const EmailVerificationSBActive = ActiveTemplate.bind({});


// copy args...
EmailVerificationSBActive.args = { ...EmailVerificationSB.args }

EmailVerificationSBActive.decorators = [toastProviderDecorator, activeMockupDecorator]

EmailVerificationSBActive.storyName = "Active";
