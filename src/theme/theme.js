import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0094AD',
      dark: '#007a8f',
      light: '#33a9be',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F08100',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0f0f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#303c47',
      secondary: '#707070',
    },
    divider: '#BCBCCB',
  },

  typography: {
    fontFamily: '"Proxima Nova", "Inter", "Roboto", sans-serif',
    fontSize: 14,
    h1: { fontWeight: 700, fontSize: '1.75rem' },
    h2: { fontWeight: 700, fontSize: '1.5rem' },
    h3: { fontWeight: 600, fontSize: '1.25rem' },
    h4: { fontWeight: 600, fontSize: '1.125rem' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.875rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.75rem', color: '#707070' },
  },

  shape: { borderRadius: 8 },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 6,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#15599F',
          '& .MuiTableCell-head': {
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.8125rem',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#f5f9ff' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          borderRadius: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, fontSize: '0.75rem' },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
  },
});

// Custom sidebar tokens accessible anywhere via theme
theme.sidebar = {
  bg: '#1D2B36',
  activeBg: '#0094AD',
  hoverBg: 'rgba(0,148,173,0.12)',
  text: '#b0bec5',
  activeText: '#ffffff',
  width: 240,
  collapsedWidth: 64,
};

export default theme;
