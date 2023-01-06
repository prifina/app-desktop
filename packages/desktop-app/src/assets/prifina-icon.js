import * as React from "react";
const SvgPrifinaIcon = props => (
  <svg
    width={79}
    height={79}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#prifina-icon_svg__a)">
      <rect
        x={8.563}
        y={4.01}
        width={62}
        height={62}
        rx={13}
        fill="url(#prifina-icon_svg__b)"
      />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.563 38.591v-4.224l18 10.561 7.2-4.224v4.224l-7.2 4.225-18-10.562Zm10.799-6.337 7.2-4.224 18 10.561v4.225l-10.8-6.337-7.2 4.224-7.2-4.224-10.8-6.337v-4.224l10.8 6.337Zm3.6 2.113 3.6 2.112 3.6-2.112-3.6-2.112-3.6 2.112Zm21.6-4.225v4.225l-18-10.561-7.2 4.224v-4.225l7.2-4.224 18 10.561Z"
      fill="#F5F8F7"
    />
    <defs>
      <linearGradient
        id="prifina-icon_svg__b"
        x1={40.251}
        y1={4.01}
        x2={40.251}
        y2={66.01}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#28D8D1" />
        <stop offset={1} stopColor="#00847A" />
      </linearGradient>
      <filter
        id="prifina-icon_svg__a"
        x={0.563}
        y={0.01}
        width={78}
        height={78}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={4} />
        <feColorMatrix values="0 0 0 0 0.356863 0 0 0 0 0.360784 0 0 0 0 0.356863 0 0 0 0.35 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_9477_41833"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_9477_41833"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default SvgPrifinaIcon;

