import '../styles/globals.css';
import { useMemo } from 'react';
import {
  createMuiTheme,
  useMediaQuery,
  ThemeProvider,
  CssBaseline,
  Container,
} from '@material-ui/core';

function MyApp({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#009688',
          },
          secondary: {
            main: '#b2ebf2',
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Component {...pageProps} />
      </Container>
    </ThemeProvider>
  );
}

export default MyApp;
