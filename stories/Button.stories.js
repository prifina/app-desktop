import React from "react";
import Button from "../src/components/Button";



export default {
  title: 'Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color'},
    color: { control: 'color'},
    btnType: { control: 'btnType'},
    variant:{control:'variant'},
    fullWidth:{control:'fullWidth'}
  },
};

const Template = (args) => <Button {...args} />;

export const DefaultButton = Template.bind({});
DefaultButton.args = {
  label: 'Default Button',
  btnType: 'default',
  variant: '',
  size:'medium',
  fullWidth:false
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  label: 'Install',
  btnType: 'primary',
  variant: 'solid',
  size:'medium',
  fullWidth:false
};

export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
  label: 'Report App Issues',
  btnType: 'secondary',
  variant: '',
  size:'medium',
  fullWidth:false
};


export const OutlineButton = Template.bind({});
OutlineButton.args = {
  label: 'Report App Issues',
  btnType: 'secondary',
  variant: 'outline',
  size:'medium',
  fullWidth:false
};

export const SmallButton = Template.bind({});
SmallButton.args = {
  label: 'Report App Issues',
  btnType: 'primary',
  variant: 'solid',
  size:'small',
  fullWidth:false
};

export const MediumButton = Template.bind({});
MediumButton.args = {
  label: 'Report App Issues',
  btnType: 'primary',
  variant: 'solid',
  size:'medium',
  fullWidth:false
};
export const LargeButton = Template.bind({});
LargeButton.args = {
  label: 'Report App Issues',
  btnType: 'primary',
  variant: 'solid',
  size:'large',
  fullWidth:false
};

export const FullWidthButton = Template.bind({});
FullWidthButton.args = {
  label: 'Report App Issues',
  btnType: 'primary',
  variant: 'solid',
  size:'large',
  fullWidth:true
};
