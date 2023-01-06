/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";

import { Routes, Route, Outlet, useNavigate, useLocation, useParams, } from "react-router-dom";


import { MockStore } from "./MockPrifinaStore";

import { useStore } from "../stores/PrifinaStore";

import CreateAccount from "../pages/CreateAccount-v2";

import { Router } from "./utils";

import { ToastContextProvider, useToast } from "@blend-ui/toast";

const PageLogin = () => {
  const activeIndex = useStore(state => state.activeIndex);
  console.log("ROUTE PAGE LOGIN ", activeIndex);
  return <><div>Page Login
  </div>
  </>
}

const PageA = () => {
  const activeIndex = useStore(state => state.activeIndex);
  console.log("ROUTE PAGE A ", activeIndex);
  return <><div>Page A
  </div>
    {/* 
    <Outlet />
    */}
  </>
}



const PageAI = () => "Page AI";
const PageAWithHash = () => "Page A with Hash";
const PageB = () => "Page B";
const PageC = () => "Page C";


const Routing = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  console.log("ROUTE ", pathname, id);
  const setActiveIndex = useStore(state => state.setActiveIndex);
  //console.log("HIST ", window.history)
  return <><Routes>
    <Route path="/test" element={<PageA />} />
    <Route path="/login" element={<PageLogin />} />

    <Route path="/register/*" element={<CreateAccount />} />

  </Routes>
    <button onClick={() => {
      setActiveIndex(0);
      navigate("/register", { replace: true });
    }}>REGISTER</button>
    <button onClick={() => {
      setActiveIndex(1);
      navigate("/register/terms-of-use", { replace: true });
    }}>PAGE B</button>
    <button onClick={() => {
      setActiveIndex(2);
      navigate("/register/email-verification", { replace: true });
    }}>PAGE C</button>
    <button onClick={() => {
      setActiveIndex(2);
      navigate("/register/phone-verification", { replace: true });
    }}>PAGE D</button>
    <button onClick={() => {
      setActiveIndex(1);
      navigate("./");
      //navigate("./");
    }}>BACK1</button>
    <button onClick={() => {
      setActiveIndex(0);
      navigate("../");
    }}>BACK2</button>
  </>

}

export default {
  title: "Pages /CreateAccount",
  component: Routing,

};



const Template = args => <Routing {...args} />;
export const CreateAccountSB = Template.bind({});

CreateAccountSB.storyName = "SB";


const activeMockupDecorator = (story, ctx) => {

  //console.log("CTX ",ctx.parameters)
  // can change verifyResult by using prop "verifyResult", default is true 
  return <><MockStore ><div>{story()}</div></MockStore></>
}


const toastProviderDecorator = (Story) => (
  <ToastContextProvider ><Story /></ToastContextProvider>
);

const routerDecorator = (story, ctx) => {
  return <><Router entries={["/register"]}>
    {story()}
  </Router></>
}


CreateAccountSB.decorators = [routerDecorator, activeMockupDecorator, toastProviderDecorator]
/*
const hashRouterProviderDecorator = (Story) => (
  <Routes>
    <Story />
  </Routes>
);


CreateAccountSB.decorators = [hashRouterProviderDecorator]
*/