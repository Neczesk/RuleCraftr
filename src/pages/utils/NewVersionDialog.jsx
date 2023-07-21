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
          Alpha 2
        </Typography>
        <Typography variant="body1">
          The first major update of the public release. This update focused on adding new features to the editor.
        </Typography>
        <Divider sx={{ my: 2 }}></Divider>
        <Typography variant="h6" fontWeight="bold">
          Known Issues:
        </Typography>
        <ul>
          <li>
            The editor is not at all mobile friendly. That may change in the future, but it is not on the immediate
            roadmap. You may be able to work around this on a tablet in landscape mode; as long as the screen is wide
            enough I believe it will work ok. The rest of the site is working on mobile devices though, so feel free to
            browse the public rulesets and view their exported versions!
          </li>
          <li>Copying and pasting tables and lists does not work.</li>
        </ul>

        <Typography variant="h6" fontWeight="bold">
          New Features:
        </Typography>
        <ul>
          <li>
            Added support for tables to the editor. This includes any number of columns and rows, and resizing the
            column widths. The tables are not responsive to screen width so be cautious if making the table fill the
            page.
          </li>
          <li>Added support for ordered and unordered lists. They are not customizable at the moment however.</li>
          <li>Added a custom context menu for the editor.</li>
          <li>
            Removed the automatic indenting of paragraphs and instead introduced tab spacing like other text editors.
          </li>
        </ul>
        <Typography variant="h6" fontWeight="bold">
          Bug Fixes:
        </Typography>
        <ul>
          <li>
            Minimum size of references has been reduced, avoiding the extranous spacing. The references may not be quite
            as clearly interactive so this may get revisited.
          </li>
          <li>Error when saving a ruleset with no tags has been prevented</li>
        </ul>

        <Typography variant="h6" fontWeight="bold">
          What&apos;s Next:
        </Typography>
        <ul>
          <li>
            Alpha 3: Article Tree overhaul, including article moving, typing of articles, adding folders and categories
            as well as marking if an article should be exported or not.
          </li>
          <li>
            Alpha 4: Database overhaul, hopefully allowing for recovery of deleted rulesets, articles, and keywords as
            well as autosave and versioning.
          </li>
          <li>Alpha 5: Copy and paste support for formatted elements in the editor</li>
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
