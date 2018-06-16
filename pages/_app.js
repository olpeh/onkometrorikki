import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import theme from '../theme';

/* Use this file to customise your app's layout and shared providers */
export default class extends React.Component {
  render() {
    const { render, routes } = this.props;

    // You might need this if you have a navigation bar of some kind
    const route = routes.find(
      route => route.path === this.props.location.pathname,
    );

    // Here, we wrap the app with emotion's theme provider, to offer access to styled-system values
    return (
      <ThemeProvider theme={theme}>
        <React.Fragment>{render()}</React.Fragment>
      </ThemeProvider>
    );
  }
}
