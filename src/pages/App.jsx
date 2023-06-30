import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import EditorPage from './ArticleEditor/EditorPage'

import useRulesetStore from '../stores/rulesetStore'
import Home from './HomePage/Home'
import useUserStore from '../stores/userStore'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import RulesetManager from './RulesetManager/RulesetManager'
import UserToolbarInterface from './utils/UserToolbarInterface'
import LoginPage from './LoginPage/LoginPage'
import { createAccount, loginUser, logoutUser } from '../data/users'
import ProfileManagement from './ProfileManagement/ProfileManagement'
import { useSnackbar } from 'notistack'

function App() {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const clearRuleset = useRulesetStore((state) => state.clearRuleset)
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  function ListItemLink(props) {
    return <ListItemButton component={RouterLink} {...props} />
  }

  const RedirectToHome = () => {
    const navigate = useNavigate()
    useEffect(() => {
      navigate('/home')
    })
    return null
  }

  const handleLogout = () => {
    logoutUser().then((response) => {
      if (Object.keys(response).includes('Failure')) {
        enqueueSnackbar(response.Failure, { variant: 'error' })
        return false
      } else {
        enqueueSnackbar(response.Success, { variant: 'success' })
        setUser(null)
      }
      return true
    })
  }

  const { enqueueSnackbar } = useSnackbar()

  const login = async (form) => {
    const newUser = await loginUser(form)
    if (Object.keys(newUser).includes('Failure')) {
      enqueueSnackbar('Either the username or password is incorrect', { variant: 'error' })
      return newUser
    } else {
      setUser(newUser)
      return newUser
    }
  }

  const signup = async (form) => {
    const newUser = await createAccount(form)
    if (Object.keys(newUser).includes('Failure')) {
      const message = newUser.Failure
      enqueueSnackbar(message, { variant: 'error' })
      return newUser
    } else {
      setUser(newUser)
      return newUser
    }
  }

  return (
    <>
      <Router>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItemLink
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
            </ListItemLink>
          </List>
        </Drawer>
        <CssBaseline />
        <Box>
          <AppBar position="sticky">
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
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
        <Routes>
          <Route path="/" element={<RedirectToHome />} />
          <Route exact path="/home" element={<Home />}></Route>
          <Route path="/login" element={<LoginPage handleLogin={login} handleCreateAccount={signup} />} />
          <Route path="/user/:user/rulesets/:id/editor" element={<EditorPage />}></Route>
          <Route path="user/:user/rulesets/" element={<RulesetManager />} />
          <Route path="user/:userid/profile" element={<ProfileManagement />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
