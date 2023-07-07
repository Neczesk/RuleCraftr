import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import { findArticleInRuleset, serializeRuleset } from '../../data/rulesets';
import { useContext, useEffect, useState } from 'react';
import { serializeArticle } from '../../data/articles';
import { ColorModeContext } from '../App';

function ExportDialog(props) {
  const colorModeContext = useContext(ColorModeContext);
  const { type, articleId, onClose, ruleset, ...others } = props;
  const article = articleId ? findArticleInRuleset(articleId, ruleset.articles) : null;
  const [exportReady, setExportReady] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);
  useEffect(() => {
    if (ruleset) {
      if (type === 'article' && article) {
        serializeArticle(
          article,
          ruleset,
          colorModeContext ? colorModeContext.colorMode === 'dark' : false,
          colorModeContext ? colorModeContext.themeName : 'cherry'
        ).then((url) => {
          setExportReady(true);
          setExportUrl(url);
        });
      } else if (type === 'ruleset') {
        serializeRuleset(
          ruleset,
          colorModeContext ? colorModeContext.colorMode === 'dark' : false,
          colorModeContext ? colorModeContext.themeName : 'cherry'
        ).then((url) => {
          setExportReady(true);
          setExportUrl(url);
        });
      }
    }
  }, [type, article, ruleset, colorModeContext]);
  useEffect(() => {
    setExportReady(false);
  }, [type]);

  const handleClose = () => {
    if (exportUrl) URL.revokeObjectURL(exportUrl);
    onClose();
  };

  let dialogTitle = 'Exporting ';
  if (type === 'article') dialogTitle += 'Article ' + article ? article.title : '';
  if (type === 'ruleset') dialogTitle += 'Ruleset ' + ruleset.rn_name;
  return (
    <Dialog keepMounted={false} onClose={handleClose} {...others}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This may take some time. When the export is ready, click the button below.
        </DialogContentText>
        <Grid container sx={{ width: '100%' }} spacing={3} alignItems="center">
          <Grid item xs={9}>
            <LinearProgress
              variant={exportReady ? 'determinate' : 'indeterminate'}
              value={exportReady ? 100 : 0}
            ></LinearProgress>
          </Grid>
          <Grid item>
            <Button variant="contained" target="_blank" disabled={!exportReady} href={exportUrl}>
              Open
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
ExportDialog.propTypes = {
  type: PropTypes.string,
  articleId: PropTypes.string,
  onClose: PropTypes.func,
  ruleset: PropTypes.object,
};
export default ExportDialog;
