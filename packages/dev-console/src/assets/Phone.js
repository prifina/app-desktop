import * as React from "react";
const SvgPhone = props => (
  <svg
    width={57}
    height={112}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#phone_svg__a)">
      <path
        d="M.367 6.412a6 6 0 0 1 6-6h42a8 8 0 0 1 8 8v97.177a6 6 0 0 1-6 6h-42a8 8 0 0 1-8-8V6.412Z"
        fill="#4F0834"
      />
      <rect
        x={0.367}
        y={0.412}
        width={54.353}
        height={109.529}
        rx={5}
        fill="#B21F7A"
      />
      <rect
        x={2.014}
        y={5.354}
        width={51.059}
        height={95.529}
        rx={5}
        fill="#272626"
      />
      <rect
        x={20.133}
        y={103.354}
        width={14.823}
        height={4.118}
        rx={2.059}
        fill="#272626"
      />
      <rect
        x={20.133}
        y={2.883}
        width={14.823}
        height={0.824}
        rx={0.412}
        fill="#272626"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38.25 40.766v7.411h-2.98a10.675 10.675 0 0 1-7.726 3.294 10.675 10.675 0 0 1-7.726-3.294h-2.98v-7.411c0-5.913 4.793-10.706 10.706-10.706 5.912 0 10.706 4.793 10.706 10.706Z"
        fill="#4F0834"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.956 40.765v7.412H20.133v-7.412a7.412 7.412 0 0 1 14.823 0Z"
        fill="#272626"
      />
      <rect
        x={11.896}
        y={48.177}
        width={31.294}
        height={28}
        rx={3}
        fill="#B21F7A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.19 61.547a2.47 2.47 0 1 0-3.294 0v4.747a1.647 1.647 0 0 0 3.294 0v-4.747Z"
        fill="#4F0834"
      />
    </g>
    <defs>
      <clipPath id="phone_svg__a">
        <path
          fill="#fff"
          transform="translate(.367 .412)"
          d="M0 0h56v111.176H0z"
        />
      </clipPath>
    </defs>
  </svg>
);
export default SvgPhone;
