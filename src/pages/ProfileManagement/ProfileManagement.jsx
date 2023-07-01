import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import useUserStore from '../../stores/userStore'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { changePassword, changeUsername, deleteUserAccount, getUser } from '../../data/users'
import { useNavigate } from 'react-router'
import { get_password_suggestion, validate_password_strength } from '../../data/passwords'
import { useSnackbar } from 'notistack'

function ProfileManagement() {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const [username, setUsername] = useState(user ? user.username : '')
  const password = '*********'
  const [editingUsername, setEditingUsername] = useState(false)
  const [confirmUsernameDialogOpen, setConfirmUsernameDialogOpen] = useState(false)
  const navigate = useNavigate()
  const toggleConfirmUsernameDialog = () => {
    setConfirmPassword('')
    setUsername(user.username)
    setConfirmUsernameDialogOpen(!confirmUsernameDialogOpen)
  }
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changePasswordDialogOpen, setPasswordChangeDialogOpen] = useState(false)
  const togglePasswordChangeDialogOpen = () => {
    setPasswordChangeDialogOpen(!changePasswordDialogOpen)
  }
  const [changePasswordDialogValue, setChangePasswordDialogValue] = useState({
    originalPassword: '',
    newPassword1: '',
    newPassword2: '',
  })
  const validateChangePasswordValue = () => {
    return changePasswordDialogValue.originalPassword !== '' && changePasswordDialogValue.newPassword1 !== ''
  }
  const validateChangePasswordMatch = () => {
    return changePasswordDialogValue.newPassword1 === changePasswordDialogValue.newPassword2
  }
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  return (
    <>
      <Dialog open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)}>
        <DialogContent>
          <DialogContentText sx={{ pb: 2 }}>
            Deleting your account will delete all rulesets that you have written, and cannot be undone. If you{"'"}re
            certain, enter your password again to delete your account.
          </DialogContentText>
          <TextField
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            type="password"
            error={confirmPassword === ''}
            label="Password"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteUserAccount(user.id, { password: confirmPassword })
                .then((response) => {
                  if (Object.keys(response).includes('Success')) setUser(null)
                  return response
                })
                .then((response) => {
                  if (Object.keys(response).includes('Failure')) enqueueSnackbar(response.Failure, { variant: 'error' })
                  else {
                    navigate('/home')
                    enqueueSnackbar(response.Success, { variant: 'info' })
                  }
                })
            }}
            sx={{ backgroundColor: 'red', color: 'white' }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              setConfirmPassword('')
              setDeleteAccountOpen(false)
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmUsernameDialogOpen} onClose={toggleConfirmUsernameDialog}>
        <DialogContent>
          <DialogContentText>Enter your password to confirm username change to:</DialogContentText>
          <DialogContentText textAlign="center">{username}</DialogContentText>
          <TextField
            error={confirmPassword === ''}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            label="Password"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              changeUsername(user.id, {
                newUsername: username,
                password: confirmPassword,
              })
                .then((response) => {
                  return !Object.keys(response).includes('Failure') ? getUser(user.id) : response
                })
                .then((value) => {
                  if (Object.keys(value).includes('Failure')) {
                    enqueueSnackbar(value.Failure, { variant: 'error' })
                  } else {
                    enqueueSnackbar('Username successfully changed', { variant: 'success' })
                    setUsername(value.username)
                    setUser(value)
                  }
                })
              toggleConfirmUsernameDialog()
            }}
            disabled={confirmPassword === ''}
          >
            Confirm
          </Button>
          <Button onClick={toggleConfirmUsernameDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog sx={{ minWidth: '500px' }} open={changePasswordDialogOpen} onClose={togglePasswordChangeDialogOpen}>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <DialogContentText sx={{ pb: 2 }}>Change password</DialogContentText>
            <TextField
              type="password"
              sx={{ pb: 1 }}
              label="Enter current password:"
              error={changePasswordDialogValue.originalPassword === ''}
              value={changePasswordDialogValue.originalPassword}
              onChange={(event) =>
                setChangePasswordDialogValue({ ...changePasswordDialogValue, originalPassword: event.target.value })
              }
            />
            <TextField
              type="password"
              sx={{ pb: 1 }}
              value={changePasswordDialogValue.newPassword1}
              label="Enter new password:"
              required
              helperText={
                changePasswordDialogValue.newPassword1 != ''
                  ? get_password_suggestion(changePasswordDialogValue.newPassword1, user).warning
                    ? get_password_suggestion(changePasswordDialogValue.newPassword1, user).warning
                    : ''
                  : ''
              }
              error={changePasswordDialogValue.newPassword1 === ''}
              onChange={(event) =>
                setChangePasswordDialogValue({ ...changePasswordDialogValue, newPassword1: event.target.value })
              }
            />
            <LinearProgress
              sx={{
                my: 2,
              }}
              variant="determinate"
              color={(() => {
                if (changePasswordDialogValue.newPassword1 === '') return 'inherit'
                switch (validate_password_strength(changePasswordDialogValue.newPassword1, user)) {
                  case 0:
                    return 'primary'
                  case 1:
                    return 'primary'
                  case 2:
                    return 'secondary'
                  case 3:
                    return 'secondary'
                  case 4:
                    return 'secondary'
                }
              })()}
              value={(() => validate_password_strength(changePasswordDialogValue.newPassword1, user) * 25)()}
            ></LinearProgress>
            <TextField
              type="password"
              sx={{ pb: 1 }}
              label="Confirm new password:"
              error={changePasswordDialogValue.newPassword2 === '' || !validateChangePasswordMatch()}
              helperText={
                changePasswordDialogValue.newPassword2 !== '' && !validateChangePasswordMatch()
                  ? 'Passwords do not match'
                  : null
              }
              value={changePasswordDialogValue.newPassword2}
              onChange={(event) =>
                setChangePasswordDialogValue({ ...changePasswordDialogValue, newPassword2: event.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              changePassword(changePasswordDialogValue, user.id).then((response) => {
                if (Object.keys(response).includes('Failure')) {
                  enqueueSnackbar(response.Failure, { variant: 'error' })
                } else if (Object.keys(response).includes('Success')) {
                  enqueueSnackbar(response.Success, { variant: 'success' })
                  setPasswordChangeDialogOpen(false)
                }
              })
              setChangePasswordDialogValue({
                originalPassword: '',
                newPassword1: '',
                newPassword2: '',
              })
            }}
            disabled={
              !validateChangePasswordValue() ||
              !validateChangePasswordMatch() ||
              validate_password_strength(changePasswordDialogValue.newPassword1, user) <= 1
            }
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              setChangePasswordDialogValue({
                originalPassword: '',
                newPassword1: '',
                newPassword2: '',
              })
              togglePasswordChangeDialogOpen()
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Container sx={{ mt: 5 }}>
        <Paper
          elevation={5}
          sx={{
            maxWidth: '75%',
            margin: 'auto',
          }}
        >
          <Box display="flex" flexDirection="column" padding={2}>
            <Typography sx={{ pb: 2 }} variant="h4">
              Manage Profile
            </Typography>
            <Grid container>
              <Grid item xs={8}>
                <TextField
                  InputProps={{
                    readOnly: !editingUsername,
                  }}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  label="Username"
                  fullWidth
                  sx={{ pb: 2 }}
                />
              </Grid>
              <Grid item xs={4} display="flex" flexDirection="row">
                <Button
                  sx={{ color: editingUsername ? 'green' : null }}
                  disabled={editingUsername && username === user.username}
                  fullWidth
                  onClick={() => {
                    if (editingUsername) setConfirmUsernameDialogOpen(true)
                    setEditingUsername(!editingUsername)
                  }}
                >
                  {editingUsername ? 'Accept' : 'Change Username'}
                </Button>
                {editingUsername ? (
                  <IconButton onClick={() => setEditingUsername(!editingUsername)}>
                    <CloseIcon />
                  </IconButton>
                ) : null}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={8}>
                <TextField disabled value={password} type="password" label="password" fullWidth sx={{ pb: 2 }} />
              </Grid>
              <Grid item xs={4}>
                <Button onClick={togglePasswordChangeDialogOpen} fullWidth>
                  Change Password
                </Button>
              </Grid>
            </Grid>
            <Button onClick={() => setDeleteAccountOpen(true)} sx={{ backgroundColor: 'red', color: 'white' }}>
              Delete Account
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
export default ProfileManagement
