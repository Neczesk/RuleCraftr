import { PropTypes } from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function NewVersionDialog(props) {
  const { currentVersion, onClose, ...others } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      {...others}
      onClose={onClose}
      fullScreen={fullScreen}
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
          Beta Release Candidate 1
        </Typography>
        <Typography variant="body1">
          This update focuses on the experience of finding and viewing public rulesets, as well as cleaning up the
          website around the app. As a release candidate, there are several known issues that prevent this from being
          the actual beta 1 release. These and others found during testing will be fixed before this is the final
          release of the beta version of the app.
        </Typography>
        <Divider sx={{ my: 2 }}></Divider>
        <Typography variant="h6" fontWeight="bold">
          Known Issues:
        </Typography>
        <ul>
          <li>
            The ruleset is prematurely cleared when you use the navigation drawer to leave the editor while the editor
            has unsaved changes
          </li>
          <li>
            Due to the redirect from root / to /home on first loading the site, the back button does not work as
            expected.
          </li>
          <li>
            The export has a few issues related to keywords:
            <ul>
              <li>The dummy keywords used to implement the keyword tag system are being exported</li>
              <li>The keyword labels are not being exported correctly</li>
            </ul>
          </li>
          <li>Editing the title of an article has a one character lag time when typing.</li>
          <li>
            When typing in an article&apos;s content, the text is forced to break on the edge of the editor. Since this
            is due to handling excessively long words that are unlikely to come up, most likely I will just revert that
            and accept that words longer than the width of the editor will break.
          </li>
        </ul>
        <Typography variant="h6" fontWeight="bold">
          New Features:
        </Typography>
        <ul>
          <li>
            The ruleset manager has been replaced by a new grid based manager that separates rulesets into your own
            rulesets and public rulesets while still providing the functionality to create a new ruleset.
          </li>
          <li>
            On your own rulesets you can now add and edit tags associated with the ruleset. If the ruleset is public,
            these tags can be used to find the ruleset.
          </li>
          <li>
            In the public ruleset viewer, you can click on a tag to filter by tag, click on a user to filter by that
            ruleset, and type in the search box to filter by the name of the ruleset.
          </li>
          <li>A discord link has been added to the navigation drawer for users to find where to contact me.</li>
          <li>The home page has been completely revamped to help introduce new users to the app and its features.</li>
        </ul>
        {/* <Typography variant="h6" fontWeight="bold">
          Bug Fixes:
        </Typography> */}

        <Typography variant="h6" fontWeight="bold">
          What&apos;s Next:
        </Typography>
        <ul>
          <li>
            Beta 2: Editor overhaul, including tables and lists and possibly images to be added to the article editor
          </li>
          <li>
            Beta 3: Article Tree overhaul, including article moving, typing of articles, adding folders and categories
            as well as marking if an article should be exported or not.
          </li>
          <li>
            Beta 4: Database overhaul, hopefully allowing for recovery of deleted rulesets, articles, and keywords as
            well as autosave and versioning.
          </li>
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
