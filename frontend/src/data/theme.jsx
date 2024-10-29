import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define your dark theme colors
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc',   // primary color
    },
    secondary: {
      main: '#70c9e8',   // secondary color
    },
    background: {
      default: '#121212', // main background
      paper: '#1e1e1e',   // background for cards and paper components
    },
    text: {
      primary: '#eef',    // primary text color
      secondary: '#dde',  // secondary text color
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#bb86fc',   // primary color
    },
    secondary: {
      main: '#70c9e8',   // secondary color
    },
    background: {
      default: '#f5f5f5', // main background
      paper: '#ffffff',    // background for cards and paper components
    },
    text: {
      primary: '#000',    // primary text color
      secondary: '#333',  // secondary text color
    },
  },
});
