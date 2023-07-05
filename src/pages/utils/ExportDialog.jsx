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
import useRulesetStore from '../../stores/rulesetStore';
import { findArticleInRuleset } from '../../data/rulesets';
import { useEffect, useState } from 'react';

function ExportDialog(props) {
  const { type, articleId, onClose, ...others } = props;
  const ruleset = useRulesetStore((state) => state.ruleset);
  const article = findArticleInRuleset(articleId, ruleset.articles);
  const [exportReady, setExportReady] = useState(false);
  useEffect(() => {
    if (type)
      setTimeout(() => {
        setExportReady(true);
      }, 5000);
  }, [type]);
  let dialogTitle = 'Exporting ';
  if (type === 'article') dialogTitle += 'Article ' + article ? article.title : '';
  if (type === 'ruleset') dialogTitle += 'Ruleset ' + ruleset.rn_name;
  return (
    <Dialog onClose={onClose} {...others}>
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
            <Button variant="contained" disabled={!exportReady}>
              Open
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
ExportDialog.propTypes = {
  type: PropTypes.string,
  articleId: PropTypes.string,
  onClose: PropTypes.func,
};
export default ExportDialog;
