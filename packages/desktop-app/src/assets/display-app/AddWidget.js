import * as React from "react";
const SvgAddWidget = props => (
  <svg
    width={122}
    height={122}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx={61}
      cy={61}
      r={61}
      fill="#DFDFDF"
      style={{
        mixBlendMode: "darken",
      }}
    />
    <circle
      cx={61}
      cy={61}
      r={31}
      fill="#ACACAC"
      style={{
        mixBlendMode: "darken",
      }}
    />
    <circle cx={104} cy={25} r={17} fill="#6B0796" />
    <path
      d="M104.833 20.838h-1.667v3.334h-3.333v1.666h3.333v3.334h1.667v-3.334h3.333v-1.666h-3.333v-3.334Zm-.834-4.166a8.336 8.336 0 0 0-8.333 8.333c0 4.6 3.733 8.334 8.333 8.334s8.334-3.734 8.334-8.334-3.734-8.333-8.334-8.333Zm0 15a6.675 6.675 0 0 1-6.666-6.667 6.675 6.675 0 0 1 6.666-6.666 6.676 6.676 0 0 1 6.667 6.666 6.676 6.676 0 0 1-6.667 6.667Z"
      fill="#FAFAFA"
    />
    <path
      d="M46 45.996h13.333v7.233l9.434-9.416 9.416 9.416-9.416 9.434H76v13.333H62.667V62.663h6.1l-9.434-9.434v6.1H46V45.996Zm0 16.666h13.333v13.334H46V62.663Z"
      fill="#4D5150"
    />
  </svg>
);
export default SvgAddWidget;
