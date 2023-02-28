import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { blue, pink, purple, grey } from '@mui/material/colors';

const rawDarkTheme = createTheme({
  typography: {
    htmlFontSize: 10,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: blue[500],
    },
    secondary: {
      main: pink[500],
    },
    background: {
      paper: grey[800]
    }
  },
});

export const DarkTheme = responsiveFontSizes(rawDarkTheme);
