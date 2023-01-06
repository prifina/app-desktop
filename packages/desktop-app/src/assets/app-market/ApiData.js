import * as React from "react";
const SvgApiData = props => (
  <svg
    width={284}
    height={213}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width={284} height={213} rx={8} fill="url(#api-data_svg__a)" />
    <defs>
      <linearGradient
        id="api-data_svg__a"
        x1={0}
        y1={0}
        x2={284}
        y2={213}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F8FAFC" />
        <stop offset={1} stopColor="#F3F7FA" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgApiData;
