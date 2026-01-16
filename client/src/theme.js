// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme(
  {
    components: {
      MuiGrid: {
        defaultProps: {
          disableEqualOverflow: true,
        },
      },
    },
  },
  {
    unstable_disableGridV2: true, // ✅ This works now!
  }
);

export default theme;
