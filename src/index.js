import './main.css';
import { Elm } from './Main.elm';

//
// INIT

var app = Elm.Main.init({
  node: document.getElementById('root'),
  flags: {
    apiBaseUrl: process.env.ELM_APP_API_URL || 'https://api.onkometrorikki.fi'
  }
});

//
// ELM MESSAGES

app.ports.themePort.subscribe(function({ msg, data }) {
  switch (msg) {
    case 'ThemeChanged':
      handleThemeChanged(data);
      break;

    default:
      console.warn('Unknown msg from Elm: ', fromElm.msg);
  }
});

//
// THEME HANDLING

// Map a theme to the accent colour
var themes = {
  light: '#ff6600',
  dark: '#f18e71'
};

/** Change the head's theme-color to match the theme */
function handleThemeChanged(theme) {
  if (themes[theme]) {
    document
      .getElementById('theme-color')
      .setAttribute('content', themes[theme]);
  } else {
    console.warn('Unknown theme: ', theme);
  }
}
