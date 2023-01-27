import * as React from "react";
const SvgDataCloudBanner = props => (
  <svg
    width={171}
    height={215}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <path fill="url(#data-cloud-banner_svg__a)" d="M0 0h171v215H0z" />
    <defs>
      <pattern
        id="data-cloud-banner_svg__a"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use
          xlinkHref="#data-cloud-banner_svg__b"
          transform="matrix(.0003 0 0 .0003 0 0)"
        />
      </pattern>
      <image
        id="data-cloud-banner_svg__b"
        width={3256}
        height={4096}
      />
    </defs>
  </svg>
);
export default SvgDataCloudBanner;