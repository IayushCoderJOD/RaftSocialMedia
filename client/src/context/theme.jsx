import { createContext, useState } from 'react';

export const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => { },
  buttonSize: 'mini'
});

function ThemeProvider(props) {
  const currentTheme = localStorage.getItem('isDarkTheme') === 'false' ? false : true;

  const buttonSize = window.screen.width > 400 ? 'medium' : 'mini';

  const [isDarkTheme, setIsDarkTheme] = useState(currentTheme);

  if (isDarkTheme) {
    document.body.classList.contains('dark') ? document.body.classList.toggle('dark') : document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }

  function toggleTheme() {
    setIsDarkTheme(!isDarkTheme)
    localStorage.setItem('isDarkTheme', !isDarkTheme)
  }

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, buttonSize }}
      {...props}
    />
  )
}

export default ThemeProvider