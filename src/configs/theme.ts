import createTheme from "@mui/material/styles/createTheme";
import useMuiTheme from "@mui/material/styles/useTheme";

declare module "@mui/material/styles" {
  interface Palette {
    line: string;
  }
  interface PaletteOptions {
    line: string;
  }
}

export const light = createTheme({
  palette: {
    primary: {
      light: '#fd9561',
      main: '#FD6A00',
      dark: '#BA6930',
    },
    secondary: {
      light: '#B1E9EA',
      main: '#14CACA',
      dark: '#00ACAC',
    },
    background: {
      default: '#F9F9F9',
      paper: '#FFFFFF',
    },
    line: '#DEE3EB',
    common: {
      black: '#404040',
      white: '#eaecec',
    },
  },
});

export const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#ad6650',
      main: '#AC4800',
      dark: '#864313',
    },
    secondary: {
      light: '#B1E9EA',
      main: '#14CACA',
      dark: '#00ACAC',
    },
    background: {
      default: '#1A2027',
      paper: '#23272c',
    },
    text: {
      primary: '#EAECEC',
      secondary: '#fff',
    },
    line: '#5a6576',
    common: {
      black: '#202020',
      white: '#eaecec',
    },
  },
});

export const useTheme = useMuiTheme;
