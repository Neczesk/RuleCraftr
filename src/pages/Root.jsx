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
} from '@mui/material'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import UserToolbarInterface from './utils/UserToolbarInterface'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import useRulesetStore from '../stores/rulesetStore'
import useUserStore from '../stores/userStore'
import { logoutUser, updateUser } from '../data/users'
import { useSnackbar } from 'notistack'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { ColorModeContext } from './App'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'

function Root() {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const clearRuleset = useRulesetStore((state) => state.clearRuleset)
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const { enqueueSnackbar } = useSnackbar()

  const navigate = useNavigate()

  const handleLogout = async (path) => {
    try {
      const response = await logoutUser()
      if (Object.keys(response).includes('Failure')) {
        enqueueSnackbar(response.Failure, { variant: 'error' })
        return false
      } else {
        enqueueSnackbar(response.Success, { variant: 'success' })
        setUser(null)
        navigate(path)
      }
      return true
    } catch (error) {
      // You can handle any errors here
      console.error(error)
    }
  }
  const location = useLocation()
  useEffect(() => {
    clearRuleset()
  }, [location, clearRuleset])
  const colorModeContext = useContext(ColorModeContext)

  useEffect(() => {
    if (!user) return
    const { theme_preference } = user
    if (colorModeContext.themeName !== theme_preference) colorModeContext.setColorTheme(theme_preference)
  }, [user, colorModeContext])

  useEffect(() => {
    if (!user) return
    const { prefer_dark_mode } = user
    if (prefer_dark_mode) {
      if (colorModeContext.colorMode === 'light') colorModeContext.toggleColorMode()
    } else {
      if (colorModeContext.colorMode === 'dark') colorModeContext.toggleColorMode()
    }
  }, [user, colorModeContext])

  const setUserColorMode = async () => {
    if (colorModeContext) {
      if (user) {
        const newUser = await updateUser(user.id, { prefer_dark_mode: !user.prefer_dark_mode })
        await setUser(newUser)
      } else {
        colorModeContext.toggleColorMode()
      }
    }
  }

  const setUserTheme = async (newTheme) => {
    if (colorModeContext) {
      if (user) {
        const newUser = await updateUser(user.id, { theme_preference: newTheme })
        await setUser(newUser)
      } else {
        colorModeContext.setColorTheme(newTheme)
      }
    }
  }

  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState(null)
  return (
    <>
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
            setUserTheme('cherry')
          }}
        >
          Cherry
        </MenuItem>
        <MenuItem
          onClick={() => {
            setUserTheme('vapor')
          }}
        >
          Vaporwave
        </MenuItem>
      </Menu>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <List>
          <ListItemButton
            component={RouterLink}
            onClick={() => {
              toggleDrawer()
              clearRuleset()
            }}
            to={user ? 'user/' + user.id.toString() + '/rulesets' : ''}
          >
            <ListItemIcon>
              <ListOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Rulesets" />
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
        </List>
      </Drawer>
      <CssBaseline />
      <Box>
        <AppBar position="sticky" color="primary">
          <Toolbar variant="dense">
            <IconButton component={RouterLink} to="/home" color="inherit">
              <HomeOutlinedIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {ruleset.rn_name}
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
        <div>
          <Outlet />
        </div>
      </Box>
    </>
  )
}
export default Root
