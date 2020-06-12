import { Box, Container, CssBaseline } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { SWRConfig } from 'swr';

axios.defaults.baseURL = 'http://localhost:3000';

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
      dark: 'hsl(241, 82%, 43%)',
      light: 'hsl(241, 82%, 90%)'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  },
  spacing: 8
});

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Statpad</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          
          <SWRConfig
            value={{ fetcher: (url: string) => axios(url).then(r => r.data) }}
          >
            <Container maxWidth={false} style={{backgroundColor: theme.palette.primary.dark}}>
                <Component {...pageProps} />
            </Container>
          </SWRConfig>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}