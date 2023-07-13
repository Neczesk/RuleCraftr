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
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { validate_password_strength, get_password_suggestion } from '../../data/passwords';
import { createAccount, loginUser } from '../../data/users';
import { useSnackbar } from 'notistack';
import useUserStore from '../../stores/userStore';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const validateLogin = () => {
    return username !== '' && password !== '';
  };
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const validateAccountCreate = () => {
    //First check that there are values in all the fields
    let status = username !== '' && password !== '' && inviteCode !== '';
    if (validate_password_strength(password, username) <= 1) status = false;
    if (confirmPassword == '') status = false;
    return status;
  };
  const shouldDisplayPasswordMatchError = () => {
    if (password !== '' && confirmPassword !== '' && password !== confirmPassword) return true;
    else return false;
  };

  const [currentTab, setCurrentTab] = useState(0);
  const handleNewTab = (event, newValue) => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setInviteCode('');
    setCurrentTab(newValue);
  };

  const prepareCreateAccountForm = () => {
    return {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
      inviteCode: cleanInviteCode(inviteCode),
    };
  };

  const cleanInviteCode = (keyWDashes) => {
    return keyWDashes.replace(/-/g, '');
  };

  const displayInviteCode = (value) => {
    // Remove all dashes
    let cleaned = value.replace(/-/g, '');

    // Insert dashes between every 4 characters
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 5 === 0) {
        formatted += '-';
      }
      formatted += cleaned[i];
    }

    return formatted;
  };

  const { enqueueSnackbar } = useSnackbar();
  const setUser = useUserStore((state) => state.setUser);

  const login = async (form) => {
    const newUser = await loginUser(form);
    if (Object.keys(newUser).includes('Failure')) {
      enqueueSnackbar('Either the username or password is incorrect', { variant: 'error' });
      return newUser;
    } else {
      setUser(newUser);
      enqueueSnackbar('Successfully logged in', { variant: 'success' });
      const path = '../user/' + newUser.id.toString() + '/rulesets';
      navigate(path);
    }
  };

  const signup = async (form) => {
    const newUser = await createAccount(form);
    if (Object.keys(newUser).includes('Failure')) {
      const message = newUser.Failure;
      enqueueSnackbar(message, { variant: 'error' });
      return newUser;
    } else {
      setUser(newUser);
      enqueueSnackbar('Successfully Created Account', { variant: 'success' });
      const path = '../user/' + newUser.id.toString() + '/rulesets';
      navigate(path);
    }
  };

  const handleKeys = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      switch (currentTab) {
        case 0:
          if (validateLogin()) login({ username, password });
          break;
        case 1:
          if (validateAccountCreate()) signup(prepareCreateAccountForm());
      }
    }
  };

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
              if (password === '') return 'inherit';
              switch (validate_password_strength(password, username)) {
                case 0:
                  return 'primary';
                case 1:
                  return 'primary';
                case 2:
                  return 'secondary';
                case 3:
                  return 'secondary';
                case 4:
                  return 'secondary';
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
              if (event.target.value.length < 30) setInviteCode(displayInviteCode(event.target.value));
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
            signup(prepareCreateAccountForm());
          }}
          disabled={!validateAccountCreate() || shouldDisplayPasswordMatchError()}
          variant="contained"
        >
          Create
        </Button>
      </CardActions>
    </>
  );

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
            login({ username, password });
          }}
          variant="contained"
          disabled={!validateLogin()}
        >
          Login
        </Button>
      </CardActions>
    </>
  );

  return (
    <Container
      onKeyDown={handleKeys}
      sx={{
        mt: { xs: 0, md: 3, lg: 5 },
        padding: { xs: 0, sm: 1, md: 2 },
        height: { xs: '100%', md: 'fit-content' },
      }}
    >
      <Card
        elevation={5}
        sx={{
          width: { xs: '100%', sm: '90%', md: '75%' },
          margin: 'auto',
          height: { xs: '100%', md: 'fit-content' },
        }}
      >
        <Tabs value={currentTab} onChange={handleNewTab}>
          <Tab label="Login to existing account"></Tab>
          <Tab label="Create new account"></Tab>
        </Tabs>
        {(() => {
          switch (currentTab) {
            case 0:
              return loginCard;
            case 1:
              return createAccountCard;
          }
        })()}
      </Card>
    </Container>
  );
}

export default LoginPage;
