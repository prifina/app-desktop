/*
listDividerColor:'EBEFF2',
activeListItemColor:'#109CF1',
listItemColor:'#334D6E',
disabledListItemColor:'#C2CFE0',
headerTitleColor:'#3C64B1',
logoColor:'#E436AB'
*/

const theme = {
  colors: {
    listItemHover: "#aeaeae",
    listDividerColor: "#EBEFF2",
    activeListItemColor: "#109CF1",
    listItemColor: "#334D6E",
    disabledListItemColor: "#C2CFE0",
    headerTitleColor: "#3C64B1",
    logoColor: "#E436AB",
  },
  table: {
    borderColor: "#ededed",
    evenRowColor: "#fafafa",
    hoverRowColor: "#f5f5f5",
    linkColor: "#109CF1",
  },
  dashboard: {
    backgroundColor: "#FFFFFF",
    header: {
      height: "65px",
      borderBottom: "1px solid #E2E5E6",
    },
    footer: { height: "65px" },
    sidebar: {
      left: {
        width: "230px",
      },
      right: {
        width: "230px",
      },
    },
  },
};

export default theme;

/*
// theme/index.js
import { extendTheme } from '@chakra-ui/react'

// Global style overrides
import styles from './styles'

// Foundational style overrides
import borders from './foundations/borders'

// Component style overrides
import Button from './components/button'

const overrides = {
  styles,
  borders,
  // Other foundational style overrides go here
  components: {
    Button,
    // Other components go here
  },
}
*/

// export default theme;

export { theme };

/*
import { extendTheme } from '@chakra-ui/react'
const theme = extendTheme({})

// as default export
export default theme

// as named export
export { theme }

*/
