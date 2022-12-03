import { theme as defaultTheme } from "@blend-ui/core";

const basePrimary = "#1E1D1D";
const baseSecondary = "#AA076B";
const baseTertiary = "#272727";

const textSecondary = "#ADA9AB";

const brandAccent = "#E33FA4";

const baseWhite = "#F5F8F7DE";
const baseHover = "#c91684";
const baseMuted = "#292828";

const borderPrimary = "#C3C2C2";

const baseBright = "#4B4B4B";

const subtleHiover = "#373436";

const textMuted = "#969595";

const landingGradient =
  "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(180deg, #A80A6B 0%, #2E002D 100%)";

const gradientPurple = "linear-gradient(180deg, #AA076B 0%, #61045F 100%)";

const sandboxGradient =
  "linear-gradient(90deg, #83205D 9.68%, #B21F7A 26.87%, rgba(53, 5, 131, 0.73) 100%)";



const colors = {
  textPrimary: baseWhite,
  textMuted: textMuted,
  textSecondary: textSecondary,
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
  sandboxGradient,
  baseBright,
  subtleHiover,
  landingGradient,
  text: {
    muted: baseBright,
  },
  borderPrimary,
};

console.log("default theme", defaultTheme);

const sizeOptions = defaultTheme.sizeOptions;
const radii = defaultTheme.radii;
const fontSizes = defaultTheme.fontSizes;

const borderWidths = { ...sizeOptions.borderWidths };

const borders = {
  input: {
    base: `${borderWidths["2xs"]} solid ${colors.borderPrimary}`,
    borderRadius: radii["input"],
    disabled: `${borderWidths["2xs"]} solid ${colors.baseWhite}`,
    error: `${borderWidths["2xs"]} solid ${colors.baseError}`,
    hover: `${borderWidths["2xs"]} solid ${colors.baseSecondary}`,
    active: `${borderWidths["2xs"]} solid ${colors.baseSecondary}`,
  },
  select: {
    base: `${borderWidths["2xs"]} solid ${colors.baseMuted}`,
    borderRadius: radii["input"],
  },
  button: {
    base: `${borderWidths["2xs"]} solid ${colors.baseSecondary}`,
    disabled: `${borderWidths["2xs"]} solid ${colors.baseMuted}`,
    hover: `${borderWidths["2xs"]} solid ${colors.baseHover}`,
    hoverError: `${borderWidths["2xs"]} solid ${colors.baseErrorHover}`,
    borderRadius: radii["input"],
  },
};

const baseProps = {
  fontSize: fontSizes["xs"],
  /*lineHeight: sizeOptions[29], */
  lineHeight: sizeOptions[17],
  border: borders.input.base,
  borderRadius: borders.input.borderRadius,
  paddingLeft: sizeOptions[10],
  paddingRight: sizeOptions[10],
  paddingTop: sizeOptions[7],
  paddingBottom: sizeOptions[7],
  backgroundColor: "transparent",
  color: colors.textPrimary,
};

const componentStyles = {
  button: {
    fill: {
      backgroundColor: brandAccent,
      color: colors.textPrimary,
      border: "0.0625rem solid #c91684",
    },
    outline: {
      backgroundColor: "transparent",
      color: brandAccent,
      border: "0.0625rem solid #c91684",
    },
    link: {
      color: brandAccent,
    },
    file: {
      color: brandAccent,
    },
  },
  input: {
    base: {
      ...baseProps,
      height: sizeOptions.componentSizes["base"].height,
      backgroundColor: "transparent",
    },
  },
  textarea: {
    base: {
      backgroundColor: "transparent",
      border: `1px solid ${baseBright}`,
      color: colors.textPrimary,
    },
  },
};

const theme = {
  colors,
  componentStyles,
  borders,
};
export default theme;
