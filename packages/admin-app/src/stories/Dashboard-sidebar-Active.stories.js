import React, { useContext, createContext } from "react";
import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { useNavigate } from "react-router";

import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "../components/sidebars/Dashboard";

/*
const ActiveContext = createContext(null);

export function useActiveContext() {
  return useContext(ActiveContext);
}
*/

export default {
  title: "Layout Areas/Sidebar/Dashboard",
  component: Dashboard,
  excludeStories: ["useActiveContext"]
};

//const Template = (args) =>  <Routes><Route path='/visualisation/mfeApp2' element={<Dashboard {...args} 
//contentArea={{ name: args.contentArea }}/>}/></Routes>; 
/*
const MockElement = () => {
  return <><div>ROUTE</div><button onClick={() => {
    backTo()
  }}>Back</button>
  </>
}
*/
const NavMock = (props) => {
  //console.log("PROPS ", props);
  //const backTo = linkTo("Layout Areas/Sidebar/Dashboard/Active")
  //const { backTo } = props;
  //console.log("HOOK ", useActiveContext())
  //const { name } = useActiveContext();
  // console.log("NAME ", localStorage.getItem("Nav-Story"))
  const location = useLocation();
  const navigate = useNavigate();
  //console.log("LOC ", location)

  return <><div>{location.pathname}</div><button role="nav-back" onClick={() => {
    navigate("/", { replace: true })
  }}>Back</button>
  </>
};

/*
const Template = args => <Routes><Route path="/" element={<Dashboard {...args} />} />
  <Route path="/users" element={<AutoLinkTo kind="NavMockups" story="Users" />} />
  <Route path="/tables" element={<AutoLinkTo kind="NavMockups" story="Tables" />} />
  <Route path="/logout" element={<AutoLinkTo kind="NavMockups" story="Logout" />} />
</Routes>;
*/
const Template = args => <Routes><Route path="/" element={<Dashboard {...args} />} />
  <Route path="/users" element={<NavMock />} />
  <Route path="/tables" element={<NavMock />} />
  <Route path="/logout" element={<NavMock />} />
</Routes>;
export const DashboardSidebarActive = Template.bind({});

const decorator = [
  (story, ctx) => {
    console.log("CONTEXT ", ctx.name)
    //console.log("STORY ", story)
    ctx.args['storyName'] = ctx.name;
    if (ctx.name === "Active") {
      ctx.args['navigate'] = useNavigate();
    }
    // for some reason routing is not working as expected with Interactive stories
    if (ctx.name === "Interactive") {
      ctx.args['navigate'] = (path, opt) => {
        localStorage.setItem("Nav-Path", path);
        return null;
      };
    }

    return <> {story()}</>
    // return <><ActiveContext.Provider value={{ name: ctx.name }}> {story()} </ActiveContext.Provider></>
  }
];
DashboardSidebarActive.decorators = decorator;

DashboardSidebarActive.storyName = "Active";

export const DashboardSidebarActiveInteractive = Template.bind({});

DashboardSidebarActiveInteractive.decorators = decorator;
DashboardSidebarActiveInteractive.storyName = "Interactive";


const PlayTest = async ({ args, canvasElement }) => {

  console.log("ARGS ", args);
  const canvas = within(canvasElement);
  //console.log("CANVAS ", canvas.getByRole("users-nav"))
  //args.navigate("/users", { replace: true });
  await userEvent.click(canvas.getByRole("users-nav"));
  //await expect(args.navigate).toHaveBeenCalled();

  //console.log("LOCAL STORAGE ", localStorage.getItem("Nav-Path"));
  let navPath = localStorage.getItem("Nav-Path");
  expect(navPath).toStrictEqual("/users");

  await userEvent.click(canvas.getByRole("tables-nav"));
  navPath = localStorage.getItem("Nav-Path");
  expect(navPath).toStrictEqual("/tables");
  await userEvent.click(canvas.getByRole("logout-nav"));
  navPath = localStorage.getItem("Nav-Path");
  expect(navPath).toStrictEqual("/logout");

  //toStrictEqual
  //await fireEvent.click(screen.getByRole("users-nav"));

  //await expect(screen.getByText("Back")).toBeInTheDocument();

  /*
  await waitFor(async () => {
    await expect(canvas.getByText("/users")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("nav-back"));

  });
  */



  ///await userEvent.click(canvas.getByRole("users-nav"));
  //await expect(args.navigate).toHaveBeenCalledWith("/users", { "replace": true });
  /*
  await waitFor(async () => {
    await expect(screen.getByText("USERS")).toBeVisible()

  });
  */

}

DashboardSidebarActiveInteractive.play = PlayTest;
