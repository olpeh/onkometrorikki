import './main.css';
import { Elm } from './Main.elm';

var app = Elm.Main.init({ node: document.getElementById('root') });

// Listen for Elm messages
app.ports.themePort.subscribe(function({ msg, data }) {
  switch (msg) {
    case 'ThemeChanged':
      handleThemeChanged(data);
      break;

    default:
      console.warn('Unknown msg from Elm: ', fromElm.msg);
  }
  localStorage.setItem('cache', JSON.stringify(data));
});

// Map a theme to the accent colour
var themes = {
  light: '#ff6600',
  dark: '#f18e71'
};

function handleThemeChanged(theme) {
  if (themes[theme]) {
    document
      .getElementById('theme-color')
      .setAttribute('content', themes[theme]);
  } else {
    console.warn('Unknown theme: ', theme);
  }
}
