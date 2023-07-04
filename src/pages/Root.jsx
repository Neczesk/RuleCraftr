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
} from '@mui/material'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import UserToolbarInterface from './utils/UserToolbarInterface'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRulesetStore from '../stores/rulesetStore'
import useUserStore from '../stores/userStore'
import { logoutUser } from '../data/users'
import { useSnackbar } from 'notistack'

function Root() {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const clearRuleset = useRulesetStore((state) => state.clearRuleset)
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const { enqueueSnackbar } = useSnackbar()

  const handleLogout = async () => {
    try {
      const response = await logoutUser()
      if (Object.keys(response).includes('Failure')) {
        enqueueSnackbar(response.Failure, { variant: 'error' })
        return false
      } else {
        enqueueSnackbar(response.Success, { variant: 'success' })
        setUser(null)
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
  return (
    <>
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
