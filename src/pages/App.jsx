import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import EditorPage from './ArticleEditor/EditorPage'

import Home from './HomePage/Home'
import RulesetManager from './RulesetManager/RulesetManager'
import LoginPage from './LoginPage/LoginPage'
import ProfileManagement from './ProfileManagement/ProfileManagement'
import Root from './Root'
import { ThemeProvider, createTheme } from '@mui/material'

function App() {
  const RedirectToHome = () => {
    return <Navigate to="/home" />
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          index: true,
          element: <RedirectToHome />,
        },
        {
          path: '/home',
          element: <Home />,
        },
        {
          path: '/login',
          element: <LoginPage />,
        },
        {
          path: '/user/:user/rulesets/:id/editor',
          element: <EditorPage />,
        },
        {
          path: 'user/:user/rulesets/',
          element: <RulesetManager />,
        },
        {
          path: '/user/:userid/profile',
          element: <ProfileManagement />,
        },
      ],
    },
  ])

  const theme = createTheme({
    palette: {
      primary: {
        main: '#B30024',
      },
      secondary: {
        main: '#5C5C00',
      },
      tertiary: {
        main: '#385B70',
      },
      primaryContainer: {
        main: '#F9F0F2',
      },
      secondaryContainer: {
        main: '#FFFFEB',
        dark: '#F2F2E1',
      },
      tertiaryContainer: {
        main: '#F2FBFF',
      },
    },
  })

  const composedTheme = createTheme(theme, {})

  return (
    <>
      <ThemeProvider theme={composedTheme}>
        <RouterProvider router={router}></RouterProvider>
      </ThemeProvider>
    </>
  )
}

export default App
