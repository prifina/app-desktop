import * as React from "react";
const SvgViewingData = props => (
  <svg
    width={25}
    height={25}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      opacity={0.6}
      d="M20.313 25H4.688A4.687 4.687 0 0 1 0 20.312V4.688A4.687 4.687 0 0 1 4.688 0h15.625A4.687 4.687 0 0 1 25 4.688v15.625A4.687 4.687 0 0 1 20.312 25Z"
      fill="#FCEFC2"
    />
    <path
      d="M7.344 17.656a.469.469 0 0 1 .468-.468h9.375a.47.47 0 0 1 0 .937H7.813a.469.469 0 0 1-.468-.469ZM6.875 6.875h11.25S20 6.875 20 8.75v5.625s0 1.875-1.875 1.875H6.875S5 16.25 5 14.375V8.75s0-1.875 1.875-1.875Z"
      fill="#EDA436"
    />
  </svg>
);
export default SvgViewingData;
