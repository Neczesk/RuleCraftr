import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  CardActions,
  Button,
  TextField,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material'
import { useState } from 'react'
import { PropTypes } from 'prop-types'
import { useNavigate } from 'react-router'
import { validate_password_strength, get_password_suggestion } from '../../data/passwords'
import { enqueueSnackbar } from 'notistack'

function LoginPage(props) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const validateLogin = () => {
    return username !== '' && password !== ''
  }
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const validateAccountCreate = () => {
    return username !== '' && password !== '' && inviteCode !== ''
  }
  const shouldDisplayPasswordMatchError = () => {
    if (password !== '' && confirmPassword !== '' && password !== confirmPassword) return true
    else return false
  }

  const [currentTab, setCurrentTab] = useState(0)
  const handleNewTab = (event, newValue) => {
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setInviteCode('')
    setCurrentTab(newValue)
  }

  const prepareCreateAccountForm = () => {
    return {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
      inviteCode: cleanInviteCode(inviteCode),
    }
  }

  const cleanInviteCode = (keyWDashes) => {
    return keyWDashes.replace(/-/g, '')
  }

  const displayInviteCode = (value) => {
    // Remove all dashes
    let cleaned = value.replace(/-/g, '')

    // Insert dashes between every 4 characters
    let formatted = ''
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 5 === 0) {
        formatted += '-'
      }
      formatted += cleaned[i]
    }

    return formatted
  }

  const handleKeys = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      switch (currentTab) {
        case 0:
          if (validateLogin())
            props.handleLogin({ username, password }).then((user) => {
              const path = '../user/' + user.id.toString() + '/rulesets'
              navigate(path)
            })
          break
        case 1:
          if (validateAccountCreate())
            props.handleCreateAccount(prepareCreateAccountForm()).then((user) => {
              const path = '../user/' + user.id.toString() + '/rulesets'
              navigate(path)
            })
      }
    }
  }

  const createAccountCard = (
    <>
      <CardHeader titleTypographyProps={{ textAlign: 'left' }} title="Create a new account"></CardHeader>
      <CardContent>
        <Box display="flex" flexDirection="column">
          <TextField
            error={username === ''}
            sx={{
              mb: 2,
              maxWidth: '400px',
            }}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            label="Username"
            required
            id="username-field"
          />
          <TextField
            error={password === ''}
            value={password}
            sx={{
              mb: 1,
              maxWidth: '400px',
            }}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            label="Password"
            required
            id="password-field"
            helperText={
              password != ''
                ? get_password_suggestion(password, username).warning
                  ? get_password_suggestion(password, username).warning
                  : ' '
                : ' '
            }
          />
          <LinearProgress
            sx={{ mb: 2, maxWidth: '400px' }}
            variant="determinate"
            color={(() => {
              if (password === '') return 'inherit'
              switch (validate_password_strength(password, username)) {
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
            value={(() => validate_password_strength(password, username) * 25)()}
          />
          <TextField
            error={confirmPassword === '' || shouldDisplayPasswordMatchError()}
            value={confirmPassword}
            helperText={shouldDisplayPasswordMatchError() ? 'Passwords do not match' : ' '}
            sx={{
              mb: 2,
              maxWidth: '400px',
            }}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            label="Confirm password"
            required
            id="confirm-password-field"
          />
          <TextField
            error={inviteCode === ''}
            value={inviteCode}
            helperText="You should have received an invite code if you know that this app exists, otherwise ask me for one."
            sx={{
              maxWidth: '400px',
            }}
            onChange={(event) => {
              if (event.target.value.length < 30) setInviteCode(displayInviteCode(event.target.value))
            }}
            type="text"
            label="Invite Code"
            required
            id="invite-code-field"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => {
            props.handleCreateAccount(prepareCreateAccountForm()).then((user) => {
              if (!Object.keys(user).includes('Failure')) {
                enqueueSnackbar('Successfully Created Account', { variant: 'success' })
                const path = '../user/' + user.id.toString() + '/rulesets'
                navigate(path)
              }
            })
          }}
          disabled={!validateAccountCreate() || shouldDisplayPasswordMatchError()}
          variant="contained"
        >
          Create
        </Button>
      </CardActions>
    </>
  )

  const loginCard = (
    <>
      <CardHeader titleTypographyProps={{ textAlign: 'left' }} title="Login to your account"></CardHeader>
      <CardContent>
        <Box display="flex" flexDirection="column">
          <TextField
            error={username === ''}
            sx={{
              mb: 2,
              maxWidth: '400px',
            }}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            label="Username"
            required
            id="username-field"
          />
          <TextField
            error={password === ''}
            value={password}
            sx={{
              maxWidth: '400px',
            }}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            label="Password"
            required
            id="password-field"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => {
            props.handleLogin({ username, password }).then((user) => {
              if (!Object.keys(user).includes('Failure')) {
                enqueueSnackbar('Successfully logged in', { variant: 'success' })
                const path = '../user/' + user.id.toString() + '/rulesets'
                navigate(path)
              }
            })
          }}
          variant="contained"
          disabled={!validateLogin()}
        >
          Login
        </Button>
      </CardActions>
    </>
  )

  return (
    <Container onKeyDown={handleKeys}>
      <Card sx={{ mt: 5 }} elevation={5}>
        <Tabs value={currentTab} onChange={handleNewTab}>
          <Tab label="Login to existing account"></Tab>
          <Tab label="Create new account"></Tab>
        </Tabs>
        {(() => {
          switch (currentTab) {
            case 0:
              return loginCard
            case 1:
              return createAccountCard
          }
        })()}
      </Card>
    </Container>
  )
}
LoginPage.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleCreateAccount: PropTypes.func.isRequired,
}

export default LoginPage
