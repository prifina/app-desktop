import * as React from "react";
const SvgPhone = props => (
  <svg
    width={69}
    height={135}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M.5 6a6 6 0 0 1 6-6h54a8 8 0 0 1 8 8v121a6 6 0 0 1-6 6h-54a8 8 0 0 1-8-8V6Z"
      fill="#0B1A5B"
    />
    <rect x={0.5} width={66} height={133} rx={5} fill="#1F3AB2" />
    <rect x={2.5} y={6} width={62} height={116} rx={5} fill="#F5F8F7" />
    <rect x={24.5} y={125} width={18} height={5} rx={2.5} fill="#F5F8F7" />
    <rect x={24.5} y={3} width={18} height={1} rx={0.5} fill="#F5F8F7" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M46.5 49v9h-3.62a12.963 12.963 0 0 1-9.38 4 12.963 12.963 0 0 1-9.38-4H20.5v-9c0-7.18 5.82-13 13-13s13 5.82 13 13Z"
      fill="#0B1A5B"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42.5 49a9 9 0 1 0-18 0v9h18v-9Z"
      fill="#F5F8F7"
    />
    <rect x={14.5} y={58} width={38} height={34} rx={3} fill="#1F3AB2" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M35.5 74.236a3 3 0 1 0-4 0V80a2 2 0 1 0 4 0v-5.764Z"
      fill="#0B1A5B"
    />
  </svg>
);
export default SvgPhone;
