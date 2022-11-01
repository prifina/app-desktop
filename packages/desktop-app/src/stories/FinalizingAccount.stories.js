/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { action } from '@storybook/addon-actions';
//import { actions } from '@storybook/addon-actions';

import { Routes, Route, } from "react-router-dom";


import { ToastContextProvider, useToast } from "@blend-ui/toast";
import FinalizingAccount from "../pages/FinalizingAccount-v2";

import { MockStore } from "./MockPrifinaStore";
import { useStore } from "../stores/PrifinaStore";
import shallow from 'zustand/shallow'

import { Router } from "./utils";

const newUser = {
  username: "xxxx-zzzz-vvvv-aaaa",
  password: "password",
  emailVerified: "troxxxx@gmail.com",
  phoneVerified: "+35812345678",
  lastName: "last-name",
  firstName: "first-name",
  preferred_username: "login-username"
};


const PageLogin = () => {

  const actionHandler = action();
  actionHandler("NAV LOGIN");

  return <><div>Page Login
  </div>
  </>
}


const Routing = () => {

  return <><Routes>

    <Route path="/login" element={<PageLogin />} />

    <Route path="/register/*" element={<FinalizingAccount currentUser={newUser} />} />

  </Routes>

  </>

}

export default {
  title: "Pages Sub/FinalizingAccount",
  component: Routing,

};



const Template = args => <Routing {...args} />;
export const FinalizingAccountSB = Template.bind({});


FinalizingAccountSB.storyName = "SB";

const toastProviderDecorator = (Story) => (
  <ToastContextProvider ><Story /></ToastContextProvider>
);


const activeMockupDecorator = (story, ctx) => {

  return <><MockStore ><div>{story()}</div></MockStore></>
}

const routerDecorator = (story, ctx) => {
  return <><Router entries={["/register"]}>
    {story()}
  </Router></>
}
FinalizingAccountSB.decorators = [toastProviderDecorator, activeMockupDecorator, routerDecorator]



const Template2 = args => <FinalizingAccount {...args} />;
export const FinalizingAccountNoRoutingSB = Template2.bind({});

FinalizingAccountNoRoutingSB.args = { currentUser: newUser };

FinalizingAccountNoRoutingSB.storyName = "SB-NoRouting";


FinalizingAccountNoRoutingSB.decorators = [toastProviderDecorator, activeMockupDecorator, routerDecorator]