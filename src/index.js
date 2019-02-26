import './main.css';
import { Elm } from './Main.elm';

const THEME_KEY = 'theme';
const LANG_KEY = 'language';
// Map a theme to the accent colour
const themes = {
  light: '#ff6600',
  dark: '#f18e71'
};

const theme = window.localStorage.getItem(THEME_KEY);
if (theme) {
  handleThemeChanged(theme, false);
}

const language = window.localStorage.getItem(LANG_KEY);

//
// INIT

console.log(language);

const app = Elm.Main.init({
  node: document.getElementById('root'),
  flags: {
    apiBaseUrl: process.env.ELM_APP_API_URL || 'https://api.onkometrorikki.fi',
    theme,
    language
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
      console.warn('Unknown msg from Elm: ', msg);
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

app.ports.setLanguage.subscribe(function(str) {
  localStorage.setItem(LANG_KEY, str);
  document
    .getElementsByTagName('html')[0]
    .setAttribute('lang', str.toLowerCase());
});
