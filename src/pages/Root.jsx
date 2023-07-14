import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItem,
  SvgIcon,
} from '@mui/material';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import UserToolbarInterface from './utils/UserToolbarInterface';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import CopyrightOutlinedIcon from '@mui/icons-material/CopyrightOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import useRulesetStore from '../stores/rulesetStore';
import useUserStore from '../stores/userStore';
import { logoutUser, updateUser } from '../data/users';
import { useSnackbar } from 'notistack';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { ColorModeContext } from './App';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { getCurrentVersion } from '../data/version';
import NewVersionDialog from './utils/NewVersionDialog';
import PrivacyDialogue from './utils/PrivacyDialogue';

function Root() {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const clearRuleset = useRulesetStore((state) => state.clearRuleset);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const { enqueueSnackbar } = useSnackbar();
  const [appVersion, setAppVersion] = useState('Beta');
  useEffect(() => {
    getCurrentVersion().then((value) => setAppVersion(value));
  }, []);

  const discordIcon = (
    <SvgIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-discord"
        viewBox="0 0 16 16"
      >
        <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
      </svg>
    </SvgIcon>
  );

  const navigate = useNavigate();

  const handleLogout = async (path) => {
    try {
      const response = await logoutUser();
      if (Object.keys(response).includes('Failure')) {
        enqueueSnackbar(response.Failure, { variant: 'error' });
        return false;
      } else {
        enqueueSnackbar(response.Success, { variant: 'success' });
        setUser(null);
        navigate(path);
      }
      return true;
    } catch (error) {
      // You can handle any errors here
      console.error(error);
    }
  };
  const colorModeContext = useContext(ColorModeContext);

  useEffect(() => {
    if (!user) return;
    const { theme_preference } = user;
    if (colorModeContext.themeName !== theme_preference) colorModeContext.setColorTheme(theme_preference);
  }, [user, colorModeContext]);

  useEffect(() => {
    if (!user) return;
    const { prefer_dark_mode } = user;
    if (prefer_dark_mode) {
      if (colorModeContext.colorMode === 'light') colorModeContext.toggleColorMode();
    } else {
      if (colorModeContext.colorMode === 'dark') colorModeContext.toggleColorMode();
    }
  }, [user, colorModeContext]);

  const setUserColorMode = async () => {
    if (colorModeContext) {
      if (user) {
        const newUser = await updateUser(user.id, { prefer_dark_mode: !user.prefer_dark_mode });
        await setUser(newUser);
      } else {
        colorModeContext.toggleColorMode();
      }
    }
  };

  const setUserTheme = async (newTheme) => {
    if (colorModeContext) {
      if (user) {
        const newUser = await updateUser(user.id, { theme_preference: newTheme });
        await setUser(newUser);
      } else {
        colorModeContext.setColorTheme(newTheme);
      }
    }
  };

  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState(null);
  const [newVersionDialogOpen, setNewVersionDialogOpen] = useState(false);
  const [privacyDialogueOpen, setPrivacyDialogueOpen] = useState(false);

  return (
    <>
      <PrivacyDialogue open={privacyDialogueOpen} onClose={() => setPrivacyDialogueOpen(false)} />
      <NewVersionDialog
        open={newVersionDialogOpen}
        onClose={() => setNewVersionDialogOpen(false)}
        currentVersion={appVersion}
      />
      <Menu
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(themeMenuAnchorEl)}
        anchorEl={themeMenuAnchorEl}
        onClose={() => setThemeMenuAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setUserTheme('cherry');
          }}
        >
          Cherry
        </MenuItem>
        <MenuItem
          onClick={() => {
            setUserTheme('vapor');
          }}
        >
          Vaporwave
        </MenuItem>
      </Menu>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box display="flex" flexDirection="column" height="100%">
          <List>
            <ListItemButton onClick={toggleDrawer}>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <ListItemText primary="Close this menu" />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              onClick={() => {
                toggleDrawer();
              }}
              to={'home/'}
            >
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Home Page" />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              onClick={() => {
                toggleDrawer();
                clearRuleset();
              }}
              to={user ? 'user/' + user.id.toString() + '/rulesets' : 'view-rulesets'}
            >
              <ListItemIcon>
                <ListOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={user ? 'View and Manage Rulesets' : 'View Rulesets'} />
            </ListItemButton>
            <ListItemButton onClick={setUserColorMode}>
              <ListItemIcon>
                {colorModeContext?.colorMode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </ListItemIcon>
              <ListItemText
                primary={colorModeContext?.colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              ></ListItemText>
            </ListItemButton>
            <ListItemButton onClick={(event) => setThemeMenuAnchorEl(event.currentTarget)}>
              <ListItemIcon>
                <PaletteOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Change theme" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/about">
              <ListItemIcon>
                <InfoOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItemButton>
            <ListItemButton href="https://discord.gg/fdAZtwSsER" target="_blank">
              <ListItemIcon>{discordIcon}</ListItemIcon>
              <ListItemText primary="Join us on Discord!" />
            </ListItemButton>
          </List>
          <Box flexGrow={1} display="flex" />
          <List>
            <ListItemButton onClick={() => setNewVersionDialogOpen(true)}>
              <ListItemIcon size="small">
                <NumbersOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={'Version: ' + appVersion.toString()}
                primaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItemButton>
            <ListItem>
              <ListItemIcon size="small">
                <CopyrightOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="caption">&copy; 2023 Kyle Haltermann</Typography>
            </ListItem>
            <ListItemButton onClick={() => setPrivacyDialogueOpen(true)}>
              <ListItemIcon size="small">
                <HelpOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  variant: 'caption',
                }}
                primary="Privacy Information"
              ></ListItemText>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <AppBar position="sticky" color="primary">
          <Toolbar variant="dense">
            <IconButton component={RouterLink} to="/home" color="inherit">
              <HomeOutlinedIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {ruleset.rn_name ? ruleset.rn_name : 'RuleCrafter'}
            </Typography>
            <UserToolbarInterface onLogout={handleLogout} user={user} />
            <IconButton
              onClick={toggleDrawer}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
export default Root;
