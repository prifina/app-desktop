import * as React from "react";
const SvgDevConsole = props => (
  <svg
    width={78}
    height={78}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#dev-console_svg__a)">
      <rect
        x={8}
        y={4}
        width={62}
        height={62}
        rx={13}
        fill="url(#dev-console_svg__b)"
      />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 27.5a7.5 7.5 0 0 1 7.5-7.5h15a7.5 7.5 0 0 1 7.5 7.5v15a7.5 7.5 0 0 1-7.5 7.5h-15a7.5 7.5 0 0 1-7.5-7.5v-15Zm7.5-4.5a4.5 4.5 0 0 0-4.5 4.5v15a4.5 4.5 0 0 0 4.5 4.5h15a4.5 4.5 0 0 0 4.5-4.5v-15a4.5 4.5 0 0 0-4.5-4.5h-15Zm0 19.5A1.5 1.5 0 0 1 33 41h12a1.5 1.5 0 1 1 0 3H33a1.5 1.5 0 0 1-1.5-1.5Zm2.56-14.56a1.501 1.501 0 0 0-2.578 1.055 1.501 1.501 0 0 0 .457 1.066l3.44 3.439-3.44 3.44a1.501 1.501 0 0 0 1.056 2.578 1.501 1.501 0 0 0 1.066-.458l4.5-4.5a1.5 1.5 0 0 0 0-2.12l-4.5-4.5Z"
      fill="#F5F8F7"
    />
    <defs>
      <linearGradient
        id="dev-console_svg__b"
        x1={39}
        y1={4}
        x2={39}
        y2={66}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#AA076B" />
        <stop offset={1} stopColor="#61045F" />
      </linearGradient>
      <filter
        id="dev-console_svg__a"
        x={0}
        y={0}
        width={78}
        height={78}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={4} />
        <feColorMatrix values="0 0 0 0 0.356863 0 0 0 0 0.360784 0 0 0 0 0.356863 0 0 0 0.35 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
);
export default SvgDevConsole;

