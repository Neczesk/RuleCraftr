import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import EditorPage from './ArticleEditor/EditorPage';

import Home from './HomePage/Home';
import RulesetManagerGrid from './RulesetManager/RulesetManagerGrid';
import LoginPage from './LoginPage/LoginPage';
import ProfileManagement from './ProfileManagement/ProfileManagement';
import Root from './Root';
import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { useMemo, useState, createContext, useEffect } from 'react';
import { getDesignTokens } from './utils/themes';
import useUserStore from '../stores/userStore';
import { getCurrentVersion } from '../data/version';
import { updateUser } from '../data/users';
import NewVersionDialog from './utils/NewVersionDialog';
import About from './AboutPage/AboutPage';
import RoadMap from './RoadMap/RoadMap';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [currentVersion, setCurrentVersion] = useState('No current version');
  const [newVersionDialogOpen, setNewVersionDialogOpen] = useState(false);
  const closeNewVersionDialogue = () => {
    if (user) {
      setUser({
        ...user,
        last_version_used: currentVersion,
      });
      updateUser(user.id, { last_version_used: currentVersion });
    }
    setNewVersionDialogOpen(false);
  };

  const RedirectToHome = () => {
    return <Navigate to="/home" />;
  };

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
          element: <RulesetManagerGrid />,
        },
        {
          path: '/view-rulesets',
          element: <RulesetManagerGrid />,
        },
        {
          path: '/user/:userid/profile',
          element: <ProfileManagement />,
        },
        {
          path: '/about',
          element: <About />,
        },
        {
          path: '/roadmap',
          element: <RoadMap />,
        },
      ],
    },
  ]);

  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const [themeName, setThemeName] = useState(import.meta.env.VITE_DEFAULT_THEME);
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      setColorTheme: (name) => {
        setThemeName(name);
      },
      colorMode: mode,
      themeName: themeName,
    }),
    [mode, themeName]
  );
  const theme = useMemo(() => createTheme(getDesignTokens(mode, themeName)), [mode, themeName]);

  const composedTheme = createTheme(theme, {});

  useEffect(() => {
    if (!user) return;
    const { last_version_used } = user;
    getCurrentVersion().then((version) => {
      setCurrentVersion(version);
      if (last_version_used != version || !last_version_used) setNewVersionDialogOpen(true);
    });
  }, [user, currentVersion]);

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={composedTheme}>
          <NewVersionDialog
            open={newVersionDialogOpen}
            onClose={closeNewVersionDialogue}
            currentVersion={currentVersion}
          />
          <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
