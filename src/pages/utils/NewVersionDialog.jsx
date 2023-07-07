import { PropTypes } from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function NewVersionDialog(props) {
  const { currentVersion, onClose, ...others } = props;
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
          <li>
            Added exporting html versions of your rulesets. You can also view the html versions of public rulesets even
            though you can{"'"}t edit them.
          </li>
          <li>Rulesets will respect both your theme and your color mode preference when exporting.</li>
          <li>Exported rulesets have a table of contents.</li>
          <li>Added a close button to the hamburger navigation menu on the top right</li>
        </ul>
        <Typography variant="h6" fontWeight="bold">
          Bug Fixes:
        </Typography>
        <ul>
          <li>A few miscellaneous bug fixes (Thank you Greg)</li>
          <li>
            Canny users may have been able to attempt editing a public ruleset even though the backend rejected the
            changes. That should be harder now.
          </li>
        </ul>
        <Typography variant="h6" fontWeight="bold">
          What{"'"}s Next:
        </Typography>
        <ul>
          <li>Allowing the two side panels to collapse</li>
          <li>Pagination and searching of rulesets</li>
          <li>Keyword inspector overhaul</li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
NewVersionDialog.propTypes = {
  currentVersion: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default NewVersionDialog;
