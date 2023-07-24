import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { findArticleInRuleset, getAncestry } from '../../../data/rulesets';
import SelectArticleTree from './SelectArticleTree';
import useRulesetStore from '../../../stores/rulesetStore';
import _ from 'lodash';
function DuplicateDialog(props) {
  const { onClose, anchorId } = props;
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const ruleset = useRulesetStore((state) => state.ruleset);
  const addArticle = useRulesetStore((state) => state.addArticle);
  const [newTitle, setNewTitle] = useState('');

  const duplicateArticle = () => {
    const duplicatingArticle = findArticleInRuleset(anchorId, ruleset.articles);
    const newParent = selectedArticleId === 'Null Article' ? null : selectedArticleId;
    const newArticle = _.cloneDeep(duplicatingArticle);
    newArticle.id = crypto.randomUUID();
    newArticle.parent = newParent;
    newArticle.sort = 9999;
    newArticle.posted = false;
    newArticle.synched = false;
    newArticle.title = newTitle != '' ? newTitle : newArticle.title + ' Copy';
    addArticle(newArticle);
    onClose();
  };
  const [article, setArticle] = useState(null);
  useEffect(() => {
    setArticle(findArticleInRuleset(anchorId, ruleset.articles));
  }, [anchorId, ruleset.articles]);

  return (
    <Dialog open={!!anchorId} onClose={onClose} PaperProps={{ sx: { minWidth: '350px' } }}>
      <DialogTitle>Duplicate Article: {article ? article.title : ''}</DialogTitle>
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
          <TextField
            size="small"
            sx={{ mt: 1 }}
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            label="New Title"
            placeholder="Enter the title for the copied article"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="warning" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={duplicateArticle}>
          Duplicate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
DuplicateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  anchorId: PropTypes.string,
};
export default DuplicateDialog;
