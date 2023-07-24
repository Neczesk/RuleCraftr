import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { findArticleInRuleset, getAncestry } from '../../../data/rulesets';
import SelectArticleTree from './SelectArticleTree';
import useRulesetStore from '../../../stores/rulesetStore';
function ReparentDialog(props) {
  const { onClose, anchorId } = props;
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setSingleArticle = useRulesetStore((state) => state.setSingleArticle);
  const reparentArticle = () => {
    const article = findArticleInRuleset(anchorId, ruleset.articles);
    const newParent = selectedArticleId === 'Null Article' ? null : selectedArticleId;
    setSingleArticle(anchorId, { ...article, parent: newParent });
    onClose();
  };
  const [article, setArticle] = useState(null);
  useEffect(() => {
    setArticle(findArticleInRuleset(anchorId, ruleset.articles));
  }, [anchorId, ruleset.articles]);
  return (
    <Dialog open={!!anchorId} onClose={onClose} PaperProps={{ sx: { minWidth: '300px' } }}>
      <DialogTitle>Move Article: {article ? article.title : ''}</DialogTitle>
      <DialogContent>
        <SelectArticleTree onChange={setSelectedArticleId} currentArticleId={anchorId} />
        <Box>
          <Typography variant="caption">Selected Article:</Typography>
          <Typography variant="body2">
            {(() => {
              const ancestry = article ? getAncestry(selectedArticleId, ruleset.articles, true) : null;
              const ancestryString = ancestry?.length
                ? 'Top Level > ' +
                  ancestry
                    .reverse()
                    .map((ancestor) => ancestor.title + ' > ')
                    .join('')
                : 'Top Level > ';
              return ancestryString;
            })()}
          </Typography>
          <Typography variant="body1">
            {(() => {
              return article?.title;
            })()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="warning" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={reparentArticle}>
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
}
ReparentDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  anchorId: PropTypes.string,
};
export default ReparentDialog;
