import React from "react";
import { within, userEvent, fireEvent, waitFor, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import Dashboard from "../components/sidebars/Dashboard";

export default {
  title: "Layout Areas/Sidebar/Dashboard/SB",
  component: Dashboard,
  argTypes: {
    navigate: { action: "navigation action" },
  },
  //excludeStories: ["Template",'PlayTest',"VersionPlayTest"]
};
const Template = args => <Dashboard {...args} />;

export const DashboardSidebar = Template.bind({});

DashboardSidebar.storyName = "Mockups";

export const DashboardSidebarSBInteractive = Template.bind({});
/*
ViewSchemaContentSBInteractive.decorators = [
  (story,ctx) => {
    //console.log("CONTEXT ",ctx)
  return <MockStore {...ctx.args}>{story()}</MockStore>
  }
]
*/
DashboardSidebarSBInteractive.storyName = "Interactive";


const PlayTest = async ({ args, canvasElement }) => {

  const canvas = within(canvasElement);
  /*
  const nameInput = canvas.getByTestId('name-inp', {
    selector: 'input',
  });
  const namePrev = canvas.getByTestId('name-prev');
*/
  await userEvent.click(canvas.getByRole("dashboard-nav"));
  await expect(args.navigate).toHaveBeenCalledWith("/dashboard", { "replace": true });

  await userEvent.click(canvas.getByRole("users-nav"));
  await expect(args.navigate).toHaveBeenCalledWith("/users", { "replace": true });

  await userEvent.click(canvas.getByRole("tables-nav"));
  await expect(args.navigate).toHaveBeenCalledWith("/tables", { "replace": true });

  await userEvent.click(canvas.getByRole("logout-nav"));
  await expect(args.navigate).toHaveBeenCalledWith("/logout", { "replace": true });
};


DashboardSidebarSBInteractive.play = PlayTest;