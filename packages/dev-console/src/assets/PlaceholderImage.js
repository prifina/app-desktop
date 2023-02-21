import * as React from "react";
const SvgPlaceholderImage = props => (
  <svg
    width={152}
    height={114}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x={1} y={0.5} width={150} height={113} rx={7.5} fill="#373436" />
    <path
      d="M94 41.25a4.5 4.5 0 0 1 4.5 4.5v22.5a4.5 4.5 0 0 1-4.5 4.5H58a4.5 4.5 0 0 1-4.5-4.5v-22.5c0-2.498 2.002-4.5 4.5-4.5h36ZM60.25 66h31.5L81.625 52.5 73.75 62.625l-5.625-6.75L60.25 66Z"
      fill="#272626"
    />
    <rect x={1} y={0.5} width={150} height={113} rx={7.5} stroke="#343233" />
  </svg>
);
export default SvgPlaceholderImage;
