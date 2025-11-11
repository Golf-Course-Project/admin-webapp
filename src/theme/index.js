import { responsiveFontSizes } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import shadows from './shadows';
import palette from './palette';

const getTheme = (mode, paletteType) =>
  responsiveFontSizes(
    createTheme({
      palette: palette(mode, paletteType),
      layout: {
        contentWidth: 1236,
      },
      shadows: shadows(mode),
      typography: {
        fontFamily: '"Inter", sans-serif',
        button: {
          textTransform: 'none',
          fontWeight: 'medium',
        },
      },
      zIndex: {
        appBar: 1100,
        drawer: 1200,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            label: {
              fontWeight: 600,
            },
            containedSecondary: mode === 'light' ? { color: 'white' } : {},
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
      },
    }),
  );

export default getTheme;
