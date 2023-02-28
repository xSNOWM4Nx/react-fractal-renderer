import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { blue, pink, purple, grey } from '@mui/material/colors';

const rawLightTheme = createTheme({
  typography: {
    htmlFontSize: 10,
  },
  palette: {
    mode: 'light',
    primary: {
      main: blue[500],
    },
    secondary: {
      main: pink[500],
    },
    background: {
      paper: grey[200]
    }
  },
});

export const LightTheme = responsiveFontSizes(rawLightTheme);
