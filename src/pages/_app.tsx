import { Box, Container, CssBaseline } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Router from 'next/dist/client/router';

NProgress.configure({showSpinner: false})

Router.events.on('routeChangeStart', () => {
  NProgress.start()
})

Router.events.on('routeChangeComplete', () => {
  NProgress.done()
})

Router.events.on('routeChangeError', () => {
  NProgress.done()
})

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
      dark: 'hsl(241, 82%, 43%)',
      light: 'hsl(241, 82%, 90%)'
    },
    error: {
      main: red.A400,
      light: 'hsla(348, 91%, 55%, .9)'
    },
    success: {
      main: 'hsl(140, 81%, 31%)',
      light: 'hsl(140, 81%, 40%)'
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
          <style jsx global>{`
            #nprogress .bar {
              background: hsl(301, 77%, 40%);
              height: .2rem
            }
          `}</style>
            <Container maxWidth={false} style={{backgroundColor: theme.palette.primary.dark}}>
                <Component {...pageProps} />
            </Container>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}