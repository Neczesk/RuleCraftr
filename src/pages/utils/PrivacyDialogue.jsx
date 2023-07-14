// We take precautions to protect your information. When you submit sensitive information via the website or app, your information is protected both online and offline.

import { PropTypes } from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Stack, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';

function PrivacyDialogue(props) {
  const { onClose, ...others } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      {...others}
      fullScreen={fullScreen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '600px',
          maxWidth: { xs: undefined, md: '600px' },
          maxHeight: { xs: undefined, md: '700px' },
          overflow: 'auto',
        },
      }}
    >
      <DialogTitle>
        Privacy Notice{' '}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={3}>
          <Typography variant="body1">
            This privacy notice discloses the privacy practices for RuleCrafter. This privacy notice applies solely to
            information collected by this website and app.
          </Typography>
          <Typography variant="h5">Information Collection, Use, and Sharing</Typography>
          <Typography variant="body1">
            We collect and have access to information that you voluntarily provide us via signing up on our website/app
            or other direct contacts from you. The types of personal information collected are:
          </Typography>
          <ul>
            <li>
              <Typography>Username</Typography>
            </li>
            <li>
              <Typography>Color theme preferences</Typography>
            </li>
            <li>
              <Typography>Dark mode preferences</Typography>
            </li>
            <li>
              <Typography>Rulesets created on the app</Typography>
            </li>
          </ul>
          <Typography variant="body1">
            We are the sole owners of the information collected on this site and app. We only have access to collect
            information that you voluntarily give us. We will not sell or rent this information to anyone.
          </Typography>
          <Typography variant="body1">
            Your information is used to provide you with a personalized user experience in our app and for the core
            functionality of the app. We will not share your information with any third party outside of our
            organization.
          </Typography>
          <Typography variant="h5">Cookies and Local Storage</Typography>
          <Typography variant="body1">
            We use &quot;cookies&quot; on this site and app. A cookie is a piece of data stored on a site visitor&apos;s
            hard drive to help us improve your access to our site and app and identify repeat visitors. Usage of a
            cookie is in no way linked to any personally identifiable information on our site.
          </Typography>
          <Typography variant="body1">
            We also store some of your preferences and data in your browser&apos;s local storage to enhance your user
            experience.
          </Typography>
          <Typography variant="h5">Security</Typography>
          <Typography variant="body1">
            We take precautions to protect your information. When you submit sensitive information via the website or
            app, your information is protected both online and offline.
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
PrivacyDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default PrivacyDialogue;
