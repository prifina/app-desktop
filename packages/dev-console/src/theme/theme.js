import { color } from "styled-system";

const basePrimary = "#08011C";
const baseSecondary = "#AA076B";
const baseTertiary = "#141020";

const brandAccent = "#AA1370";

const baseWhite = "#F5F8F7DE";
const baseHover = "#c91684";
const baseMuted = "#1D152C";

const textMuted = "#ADADAD";

const gradientPurple = "linear-gradient(180deg, #AA076B 0%, #61045F 100%)";

const colors = {
  textPrimary: baseWhite,
  textMuted: textMuted,
  brandAccent,
  brandAccentGradient: gradientPurple,
  basePrimary,
  baseSecondary,
  baseTertiary,
  baseMuted,
  baseWhite,
  componentPrimary: brandAccent,
  componentAccent: brandAccent,
  backroundAccent: brandAccent,
  baseHover,
};

const componentStyles = {
  button: {
    fill: {
      backgroundColor: brandAccent,
      color: "#F5F8F7",
      border: "0.0625rem solid #c91684",
    },
    outline: {
      backgroundColor: baseTertiary,
      color: "#F5F8F7",
      border: "0.0625rem solid #c91684",
    },
    link: {
      color: brandAccent,
    },
    file: {
      color: brandAccent,
    },

    input: {
      base: {
        border: "1px solid red",
      },
    },
  },
  textarea: {
    base: {
      backgroundColor: "transparent",
      border: `1px solid ${baseWhite}`,
      color: colors.textPrimary,
    },
  },
};

// const baseProps = {
//   fontSize: fontSizes["xs"],
//   /*lineHeight: sizeOptions[29], */
//   lineHeight: sizeOptions[17],
//   border: borders.input.base,
//   borderRadius: borders.input.borderRadius,
//   paddingLeft: sizeOptions[10],
//   paddingRight: sizeOptions[10],
//   paddingTop: sizeOptions[7],
//   paddingBottom: sizeOptions[7],
//   backgroundColor: colors.baseWhite,
//   color: colors.text.primary,
// };

const theme = {
  colors,
  componentStyles,
};
export default theme;
