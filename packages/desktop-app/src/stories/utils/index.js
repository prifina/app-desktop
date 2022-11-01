import React from "react";
import { MemoryRouter, } from 'react-router-dom';


function ColorToHex(color) {
  var hexadecimal = parseInt(color).toString(16);
  return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

export function ConvertRGBtoHex(red, green, blue) {
  return ("#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue)).toUpperCase();
}


export const Router = ({ entries, children }) => {

  return <MemoryRouter initialEntries={entries}>
    {children}
  </MemoryRouter>
}
