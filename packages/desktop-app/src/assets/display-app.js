import * as React from "react";
const SvgDisplayApp = props => (
  <svg
    width={78}
    height={78}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#display-app_svg__a)">
      <rect
        x={8}
        y={4}
        width={62}
        height={62}
        rx={13}
        fill="url(#display-app_svg__b)"
      />
    </g>
    <path
      d="M51.596 26.095a1.406 1.406 0 0 0-1.786-.167c-2.105 1.434-12.659 8.646-13.793 9.78a4.224 4.224 0 0 0 0 5.967A4.206 4.206 0 0 0 39 42.907c1.08 0 2.16-.411 2.983-1.233 1.135-1.135 8.346-11.689 9.78-13.793.381-.559.31-1.309-.167-1.787Zm-11.602 13.59a1.408 1.408 0 0 1-1.988 0 1.408 1.408 0 0 1 0-1.988c.44-.435 3.437-2.572 7.123-5.135-2.562 3.687-4.7 6.683-5.135 7.124Z"
      fill="#F5F8F7"
    />
    <path
      d="m27.485 45.232-1.736.847a15.112 15.112 0 0 1-.948-12.78l1.99.955a1.407 1.407 0 0 0 1.216-2.536l-1.964-.942c2.44-3.981 6.664-6.757 11.55-7.208v2.115a1.406 1.406 0 0 0 2.813 0v-2.116c1.676.153 3.297.58 4.836 1.274a1.406 1.406 0 0 0 1.157-2.563A17.864 17.864 0 0 0 39 20.69a17.882 17.882 0 0 0-12.728 5.272c-3.4 3.4-5.272 7.92-5.272 12.728 0 3.553 1.055 7.009 3.05 9.993a1.406 1.406 0 0 0 1.785.482l2.883-1.406a1.406 1.406 0 1 0-1.233-2.528ZM55.413 31.293a1.406 1.406 0 1 0-2.563 1.157 15.067 15.067 0 0 1 1.337 6.241 15.08 15.08 0 0 1-1.942 7.398l-1.812-.863a1.406 1.406 0 0 0-1.21 2.54l2.954 1.406a1.403 1.403 0 0 0 1.773-.488A17.93 17.93 0 0 0 57 38.69c0-2.577-.534-5.067-1.587-7.399Z"
      fill="#F5F8F7"
    />
    <defs>
      <linearGradient
        id="display-app_svg__b"
        x1={39.689}
        y1={4}
        x2={39.689}
        y2={66}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9400D3" />
        <stop offset={1} stopColor="indigo" />
      </linearGradient>
      <filter
        id="display-app_svg__a"
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
export default SvgDisplayApp;

