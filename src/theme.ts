import { createTheme, alpha } from '@mui/material/styles';

const commonPalette = {
  primary: {
    main: '#4F6BED', // calm accent
    light: '#7C8CF1',
    dark: '#2E4DD6',
  },
  secondary: {
    main: '#22A699',
  },
  divider: alpha('#000', 0.08),
};

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F7F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1C28',
      secondary: '#5F6C7B',
    },
    ...commonPalette,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h3: { letterSpacing: -0.5 },
    h4: { letterSpacing: -0.25 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow:
            '0 1px 2px rgba(16,24,40,0.05), 0 8px 28px rgba(16,24,40,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            '0 1px 2px rgba(16,24,40,0.05), 0 12px 40px rgba(16,24,40,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 16,
        },
      },
    },
  },
});


