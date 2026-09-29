import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#732244', // Your brand plum color
      light: '#fbf0f3',
      dark: '#591a35',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fcf8f6', // Light beige background matching your mockup
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Rounded pill buttons globally
          textTransform: 'none', // Prevents uppercase text conversion
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Curved card borders globally
          borderColor: '#f0e6e1',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;