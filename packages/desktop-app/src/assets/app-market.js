import * as React from "react";
const SvgAppMarket = props => (
  <svg
    width={78}
    height={78}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#app-market_svg__a)">
      <rect
        x={8}
        y={4}
        width={62}
        height={62}
        rx={13}
        fill="url(#app-market_svg__b)"
      />
    </g>
    <path
      d="m52.177 39.91 3.973-13.304a1.208 1.208 0 0 0-1.157-1.549H29.506l-1.313-4.396-.191.057.191-.057a1.207 1.207 0 0 0-1.157-.86h-4.029c-.666 0-1.207.538-1.207 1.204 0 .666.541 1.204 1.207 1.204h3.13l1.305 4.373.015.049 3.513 11.766a4.133 4.133 0 0 0-3.607 4.09 4.134 4.134 0 0 0 4.134 4.123h.854a3.809 3.809 0 0 0 3.606 2.59c1.676 0 3.1-1.086 3.606-2.59h5.051a3.809 3.809 0 0 0 3.607 2.59c1.676 0 3.1-1.086 3.606-2.59h1.151c.666 0 1.207-.538 1.207-1.204 0-.666-.54-1.205-1.207-1.205h-1.15a3.808 3.808 0 0 0-3.607-2.59 3.808 3.808 0 0 0-3.607 2.59h-5.05a3.808 3.808 0 0 0-3.607-2.59 3.808 3.808 0 0 0-3.606 2.59h-.854a1.72 1.72 0 0 1-1.72-1.715 1.72 1.72 0 0 1 1.72-1.714H51.02c.534 0 1.005-.35 1.158-.861Zm-5.702-12.443h6.898l-1.267 4.243h-5.631v-4.243Zm0 6.652h4.912l-1.267 4.243h-3.645V34.12Zm-7.454-6.652h5.039v4.243h-5.039v-4.243Zm0 6.652h5.039v4.243h-5.04V34.12Zm-2.415 4.243H33.48l-1.267-4.243h4.394v4.243Zm-6.38-10.895h6.38v4.243h-5.113l-1.267-4.243ZM48.22 44.02c.766 0 1.39.622 1.39 1.385a1.389 1.389 0 0 1-2.78 0c0-.763.623-1.385 1.39-1.385Zm-12.264 0c.767 0 1.39.622 1.39 1.385a1.389 1.389 0 0 1-2.78 0c0-.763.624-1.385 1.39-1.385Z"
      fill="#F5F8F7"
      stroke="#F5F8F7"
      strokeWidth={0.4}
    />
    <defs>
      <linearGradient
        id="app-market_svg__b"
        x1={39}
        y1={4}
        x2={39}
        y2={66}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFE259" />
        <stop offset={1} stopColor="#FFA751" />
      </linearGradient>
      <filter
        id="app-market_svg__a"
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
export default SvgAppMarket;

