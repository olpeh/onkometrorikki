import './main.css';
import { Elm } from './Main.elm';

var THEME_KEY = 'theme';
// Map a theme to the accent colour
var themes = {
  light: '#ff6600',
  dark: '#f18e71'
};

var theme = window.localStorage.getItem(THEME_KEY);
if (theme) {
  handleThemeChanged(theme, false);
}

//
// INIT

var app = Elm.Main.init({
  node: document.getElementById('root'),
  flags: {
    apiBaseUrl: process.env.ELM_APP_API_URL || 'https://api.onkometrorikki.fi',
    theme
  }
});

//
// ELM MESSAGES

app.ports.themePort.subscribe(function({ msg, data }) {
  switch (msg) {
    case 'ThemeChanged':
      handleThemeChanged(data, true);
      break;

    default:
      console.warn('Unknown msg from Elm: ', fromElm.msg);
  }
});

//
// THEME HANDLING

/** Change the head's theme-color to match the theme */
function handleThemeChanged(theme, store) {
  if (themes[theme]) {
    document
      .getElementById('theme-color')
      .setAttribute('content', themes[theme]);
    if (store) {
      window.localStorage.setItem(THEME_KEY, theme);
    }
  } else {
    console.warn('Unknown theme: ', theme);
  }
}
