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
          Alpha 3
        </Typography>
        <Typography variant="body1">
          The second major update of the public release. This update focused on adding new features to the article tree.
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
          <li>The context menus do not work as smoothly as I would like, but they should be fully functional.</li>
        </ul>

        <Typography variant="h6" fontWeight="bold">
          New Features:
        </Typography>
        <ul>
          <li>
            Added support for folders. These are articles whose content is not editable and will only be exported as a
            title, but can still contain other articles so you can organize your work more intuitively.
          </li>
          <li>
            Added the option to toggle if an article should be exported or not. If an article is not exported, none of
            its descendants will be exported either. This could be useful if you need to separate notes from the content
            that should actually be in the ruleset.
          </li>
          <li>
            You can set custom icons to show up next to an article&apos;s title in the tree. There are only a few
            available now but as I come across ideas for useful ones to be added, I will add more.
          </li>
          <li>You can now reorder articles within their containing article finally.</li>
          <li>
            (Alpha 2)Added support for tables to the editor. This includes any number of columns and rows, and resizing
            the column widths. The tables are not responsive to screen width so be cautious if making the table fill the
            page.
          </li>
          <li>
            (Alpha 2)Added support for ordered and unordered lists. They are not customizable at the moment however.
          </li>
          <li>(Alpha 2)Added a custom context menu for the editor.</li>
          <li>
            (Alpha 2)Removed the automatic indenting of paragraphs and instead introduced tab spacing like other text
            editors.
          </li>
        </ul>
        <Typography variant="h6" fontWeight="bold">
          Bug Fixes:
        </Typography>
        <ul>
          <li>The article tree has been made more responsive and more intuitive to use in general.</li>
          <li>
            (Alpha 2)Minimum size of references has been reduced, avoiding the extranous spacing. The references may not
            be quite as clearly interactive so this may get revisited.
          </li>
          <li>(Alpha 2)Error when saving a ruleset with no tags has been prevented</li>
        </ul>

        <Typography variant="h6" fontWeight="bold">
          What&apos;s Next:
        </Typography>
        <ul>
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
