import type { Theme as MUITheme } from '@mui/material';

// Module augmentation MUI
declare module '@mui/material/styles' {
  // interface Palette {
  //   command: Palette['primary'];
  // }
  // interface PaletteOptions {
  //   command: PaletteOptions['primary'];
  // }
};

// Module augmentation emotion
declare module "@emotion/react" {
  export interface Theme extends MUITheme { }
};
