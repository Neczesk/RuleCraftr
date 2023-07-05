export const getDesignTokens = (mode, themeName) => {
  let theme
  switch (themeName) {
    case 'cherry':
      theme = cherryTheme(mode)
      break
    case 'vapor':
      theme = vaporwaveTheme(mode)
      break
    default:
      theme = cherryTheme(mode)
  }
  return {
    palette: {
      mode,
      ...theme,
    },
  }
}

const cherryTheme = (mode) =>
  mode === 'light'
    ? {
        primary: {
          main: '#A14979',
        },
        secondary: {
          main: '#582C18',
        },
        primaryContainer: {
          main: '#FAF7F8',
          dark: '#EED3D9',
          light: '#FFFFFF',
        },
        background: {
          default: '#F8F8F8',
          paper: '#FFFFFF',
        },
        secondaryContainer: {
          main: '#FFFFEB',
          dark: '#F2F2E1',
        },
        paperBorder: {
          main: '#BBBBBB',
        },
      }
    : {
        primary: {
          main: '#FF9EB1',
        },
        secondary: {
          main: '#D1AB88',
        },
        primaryContainer: {
          main: '#1F1819',
          light: '#36282A',
          dark: '#2B1217',
        },
        background: {
          default: '#1F1819',
          paper: '#141414',
        },
        secondaryContainer: {
          main: '#101710',
          dark: '#F2F2E1',
        },
        paperBorder: {
          main: '#777777',
        },
      }

const vaporwaveTheme = (mode) =>
  mode === 'light'
    ? {
        primary: {
          main: '#049DF3',
        },
        secondary: {
          main: '#E3256B',
        },
        primaryContainer: {
          main: '#E6ECF0',
          dark: '#D7EBF5',
          light: '#FFFFFF',
        },
        background: {
          default: '#E6ECF0',
          paper: '#FFFFFF',
        },
        secondaryContainer: {
          main: '#FFFFEB',
          dark: '#F2F2E1',
        },
        paperBorder: {
          main: '#BBBBBB',
        },
      }
    : {
        primary: {
          main: '#8FA7FF',
        },
        secondary: {
          main: '#DB0037',
        },
        primaryContainer: {
          main: '#00141F',
          light: '#002336',
          dark: '#2B1217',
        },
        background: {
          default: '#00141F',
          paper: '#141414',
        },
        secondaryContainer: {
          main: '#101710',
          dark: '#F2F2E1',
        },
        paperBorder: {
          main: '#777777',
        },
      }
