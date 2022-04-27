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
      backgroundColor: "transparent",
    },
    input: {
      base: {
        border: "1px solid red",
      },
    },
  },
};

const theme = {
  colors,
  componentStyles,
};
export default theme;
