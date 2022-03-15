import colors from "./colors";
import createColorStyles from "./createColorStyles";

// const theme = {
//   colors: {
//     listDividerColor: "EBEFF2",
//     activeListItemColor: "#109CF1",
//     listItemColor: "#334D6E",
//     disabledListItemColor: "#C2CFE0",
//     headerTitleColor: "#3C64B1",
//     logoColor: "#E436AB",
//   },
//   //   dashboard: {
//   //     backgroundColor: "#FFFFFF",
//   //     header: { height: "65px" },
//   //     footer: { height: "65px" },
//   //     sidebar: {
//   //       left: {
//   //         width: "230px",
//   //       },
//   //       right: {
//   //         width: "230px",
//   //       },
//   //     },
//   //   },
//   //   table: {
//   //     borderColor: "#ededed",
//   //     evenRowColor: "#fafafa",
//   //     hoverRowColor: "#f5f5f5",
//   //   },
// };
// export default theme;

export const colorStyles = createColorStyles({
  colors,
});

const theme = {
  colors,
};

export default theme;
