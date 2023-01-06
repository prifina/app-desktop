import * as React from "react";
const SvgDataConsole = props => (
  <svg
    width={78}
    height={78}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#data-console_svg__a)">
      <rect
        x={8}
        y={4}
        width={62}
        height={62}
        rx={13}
        fill="url(#data-console_svg__b)"
      />
    </g>
    <path
      d="M50.025 32.06C49.005 26.885 44.46 23 39 23c-4.335 0-8.1 2.46-9.975 6.06A8.991 8.991 0 0 0 21 38c0 4.965 4.035 9 9 9h19.5c4.14 0 7.5-3.36 7.5-7.5 0-3.96-3.075-7.17-6.975-7.44ZM49.5 44H30c-3.315 0-6-2.685-6-6s2.685-6 6-6h1.065c.99-3.465 4.155-6 7.935-6 4.56 0 8.25 3.69 8.25 8.25V35h2.25c2.49 0 4.5 2.01 4.5 4.5S51.99 44 49.5 44Z"
      fill="#F5F8F7"
    />
    <defs>
      <linearGradient
        id="data-console_svg__b"
        x1={39.689}
        y1={66}
        x2={39.689}
        y2={4}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#C84E89" />
        <stop offset={1} stopColor="#F15F79" />
      </linearGradient>
      <filter
        id="data-console_svg__a"
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
export default SvgDataConsole;

