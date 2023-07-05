import { PropTypes } from 'prop-types'
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

function NewVersionDialog(props) {
  const { currentVersion, onClose, ...others } = props
  return (
    <Dialog
      {...others}
      onClose={onClose}
      PaperProps={{ sx: { width: '600px', maxWidth: '600px', maxHeight: '700px', overflow: 'auto' } }}
    >
      <DialogTitle>
        Version {currentVersion.toString()}{' '}
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
        <Typography variant="h6" fontWeight="bold">
          New Features:
        </Typography>
        <ul>
          <li>Updated the app to use custom themes instead of the default theme from MUI</li>
          <li>Added light and dark modes. You can switch these using the menu in the upper right corner.</li>
          <li>
            Added option to set your preferred theme. This as well as dark mode preference are saved to your account and
            should persist anywhere you log in.
          </li>
          <li>
            If leaving the page would delete any unsaved work, you will be prompted to confirm that you want to leave
            the page
          </li>
          <li>
            Added this popup to communicate to users what has changed in the most recent update. When you close this, it
            should not reappear until you login with a different account or a new version is deployed. If that is not
            the case, please let me know!
          </li>
        </ul>
        <Typography variant="h6" fontWeight="bold">
          Bug Fixes:
        </Typography>
        <ul>
          <li>
            Buttons should now properly indicate if a text mark- such as bold or italic- will be added to text you type
          </li>
        </ul>
        <Typography variant="h6" fontWeight="bold">
          What{"'"}s Next:
        </Typography>
        <ul>
          <li>Exporting to HTML</li>
          <li>Allowing the two side panels to collapse</li>
        </ul>
      </DialogContent>
    </Dialog>
  )
}
NewVersionDialog.propTypes = {
  currentVersion: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}
export default NewVersionDialog
