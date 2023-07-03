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
  }
  return (
    <>
      <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
        <MenuItem onClick={handleEditProfile}>Edit user profile</MenuItem>
        <MenuItem
          onClick={async () => {
            closeMenu()
            const success = await props.onLogout()

            if (success) navigate('/home')
          }}
        >
          Switch User
        </MenuItem>
        <MenuItem
          onClick={async () => {
            closeMenu()
            const success = await props.onLogout()
            if (success) navigate('/home')
          }}
        >
          Logout
        </MenuItem>
      </Menu>
      <Button
        onClick={handleMainButtonClick}
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
