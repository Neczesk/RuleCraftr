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
          Beta Release Candidate 3
        </Typography>
        <Typography variant="body1">
          This update focuses on the experience of finding and viewing public rulesets, as well as cleaning up the
          website around the app. As a release candidate, there may be issues that will prevent this from being
          officially released to the public. I have fixed the ones I knew about, but the more it is tested the more I
          can be sure there aren&apos;t any showstopper issues.
        </Typography>
        <Divider sx={{ my: 2 }}></Divider>
        {/* <Typography variant="h6" fontWeight="bold">
          Known Issues:
        </Typography> */}

        <Typography variant="h6" fontWeight="bold">
          New Features:
        </Typography>
        <ul>
          <li>
            (RC 3)Changed the editor font to be a serif font instead of a sans-serif font. In the future this will be
            user choosable, but for now serif fonts are recommended for long text on the web.
          </li>
          <li>
            (RC 2)Changed the toolbar slightly to add tooltips and better format them similarly to other text editors.
          </li>
          <li>(RC 2)Changed the article reference shortcut to Ctrl L instead of Ctrl A</li>
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
        <Typography variant="h6" fontWeight="bold">
          Bug Fixes:
        </Typography>
        <ul>
          <li>(RC 2)The logo at the top now functions correctly as a home page link</li>
          <li>
            (RC 2)The redirect has been fixed to no longer trap the user from going back to the site they were using
            before RuleCrafter
          </li>
          <li>(RC 2)The keyword export has been fixed</li>
          <li>(RC 2)Deleting the last keyword has been fixed</li>
        </ul>

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
