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
          Update Alpha.4
        </Typography>
        <Typography variant="body1">
          No new features in this update, but the performance of large rulesets (many articles or keywords) should be
          vastly improved.
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          New Features:
        </Typography>
        <ul>
          <li>
            (Alpha 3) The two side panels (article tree and keyword manager) are now sliding panels that you can open or
            close
          </li>
          <li>
            (Alpha 3) Keyword long definitions are now fully featured editors supporting the basic formatting marks as
            well as referencing articles and other keywords.
          </li>
          <li>(Alpha 3) The formatted long definition should export correctly as well</li>
          <li>(Alpha 3) The keyword interface has been completely overhauled.</li>
          <li>
            (Alpha 3) The keyword manager now lets you organize your keywords into tags, move keywords between tags,
            rename your tags, delete keywords, delete tags, etc
          </li>
          <li>
            (Alpha 3) The Keyword manager also lets you search through your keywords and only show the relevant ones.
          </li>
        </ul>
        <Typography variant="h6" fontWeight="bold">
          Bug Fixes:
        </Typography>
        <ul>
          <li>
            (Alpha 3) Extremely long words were breaking the export as well as the editor. While this is unlikely to
            come up in practice, I{"'"}m still fixing it by breaking long words
          </li>
          <li>
            (Alpha 3) If you had too many articles, it would cause the main page to grow beyond the editor. The article
            tree now has an internal scroll for both this vertical case, and in the case of too deeply nested articles
            it should scroll to the side as well.
          </li>
          <li>
            The editor toolbar was incorrectly showing the active formatting elements if the keyboard shortcuts were
            used
          </li>
        </ul>
        <Typography variant="h6" fontWeight="bold">
          What{"'"}s Next:
        </Typography>
        <ul>
          <li>Beta 1: Ruleset Manager update, including searching, tagging, and pagination of rulesets</li>
          <li>
            Beta 2: Editor overhaul, including tables and lists and possibly images to be added to the article editor
          </li>
          <li>
            Beta 3: Article Tree overhaul, including article moving, typing of articles, adding folders and categories
            as well as marking if an article should be exported or not.
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
