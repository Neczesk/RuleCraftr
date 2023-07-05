import { PropTypes } from 'prop-types'
import { useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import useUserStore from '../../stores/userStore'
import { useNavigate } from 'react-router'

function UserToolbarInterface(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const closeMenu = () => {
    setAnchorEl(null)
  }

  const navigate = useNavigate()

  const handleMainButtonClick = (event) => {
    if (props.user) {
      setAnchorEl(event.currentTarget)
    } else {
      navigate('/login')
    }
  }

  const user = useUserStore((state) => state.user)
  const handleEditProfile = () => {
    if (user) {
      navigate('/user/' + user.id.toString() + '/profile')
    }
    closeMenu()
  }

  const handleSwitchUser = () => {
    closeMenu()
    props.onLogout('/login')
  }

  // const signup = async (form) => {
  //   const newUser = await createAccount(form)
  //   if (Object.keys(newUser).includes('Failure')) {
  //     const message = newUser.Failure
  //     enqueueSnackbar(message, { variant: 'error' })
  //     return newUser
  //   } else {
  //     setUser(newUser)
  //     enqueueSnackbar('Successfully Created Account', { variant: 'success' })
  //     const path = '../user/' + newUser.id.toString() + '/rulesets'
  //     navigate(path)
  //   }
  // }

  const handleLogout = () => {
    closeMenu()
    props.onLogout('/home')
  }
  return (
    <>
      <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
        <MenuItem onClick={handleEditProfile}>Edit user profile</MenuItem>
        <MenuItem onClick={(event) => handleSwitchUser(event)}>Switch User</MenuItem>
        <MenuItem onClick={(event) => handleLogout(event)}>Logout</MenuItem>
      </Menu>
      <Button
        onClick={(event) => handleMainButtonClick(event)}
        color="inherit"
        endIcon={props.user ? <AccountCircleOutlinedIcon /> : null}
      >
        {props.user ? props.user.username : 'Login / Create Account'}
      </Button>
    </>
  )
}
UserToolbarInterface.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
}

export default UserToolbarInterface
