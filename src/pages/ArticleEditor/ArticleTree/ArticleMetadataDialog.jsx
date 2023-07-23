import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tooltip,
  Switch,
  Grid,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import useRulesetStore from '../../../stores/rulesetStore';
import { findArticleInRuleset } from '../../../data/rulesets';
import { useEffect, useMemo, useState } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconChoice from './IconChoice';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import GradeIcon from '@mui/icons-material/Grade';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

function ArticleMetadataDialog(props) {
  const { metadataDialogAnchor, onClose } = props;
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setSingleArticle = useRulesetStore((state) => state.setSingleArticle);
  const article = findArticleInRuleset(metadataDialogAnchor, ruleset.articles);
  const [titleValue, setTitleValue] = useState('');
  const options = useMemo(
    () => [
      { label: 'No Icon', icon_name: '' },
      {
        label: 'Note',
        icon_name: 'note',
        icon: <StickyNote2Icon fontSize="1em" sx={{ marginLeft: 'auto', marginRight: 2 }} />,
      },
      {
        label: 'Important',
        icon_name: 'important',
        icon: <GradeIcon fontSize="1em" sx={{ marginLeft: 'auto', marginRight: 2 }} />,
      },
      {
        label: 'Question Mark',
        icon_name: 'question',
        icon: <QuestionMarkIcon fontSize="1em" sx={{ marginLeft: 'auto', marginRight: 2 }} />,
      },
    ],
    []
  );
  useEffect(() => {
    setTitleValue(article ? article.title : '');
  }, [article]);
  const [descriptionValue, setDescriptionValue] = useState('');
  useEffect(() => {
    setDescriptionValue(article?.article_description ? article.article_description : '');
  }, [article]);
  const [noExportValue, setNoExportValue] = useState(false);
  useEffect(() => {
    setNoExportValue(article ? article.no_export : false);
  }, [article]);
  const [folderValue, setFolderValue] = useState(false);
  useEffect(() => {
    setFolderValue(article ? article.is_folder : false);
  }, [article]);
  const [iconNameValue, setIconNameValue] = useState(options.find((option) => option.icon_name === ''));
  useEffect(() => {
    setIconNameValue(
      article && article.icon_name
        ? options.find((option) => option.icon_name === article.icon_name)
        : options.find((option) => option.icon_name === '')
    );
  }, [article, options]);

  const handleIconNameChange = (event, value) => {
    const { icon_name } = value;

    if (icon_name) {
      setIconNameValue(value);
    } else setIconNameValue({ label: 'No Icon', icon_name: '' });
  };

  return article ? (
    <Dialog open={!!metadataDialogAnchor} onClose={onClose}>
      <DialogTitle>Edit Article Metadata: {article.title}</DialogTitle>
      <DialogContent>
        <Grid container columns={{ xs: 6, sm: 9, md: 12 }} spacing={2}>
          <Grid item xs={6}>
            <TextField
              sx={{ mt: 1 }}
              size="small"
              value={titleValue}
              onChange={(event) => setTitleValue(event.target.value)}
              label={
                <Box display="flex" flexDirection="row">
                  {'Article Title'}
                  <Tooltip title="Set a new title for the article">
                    <HelpOutlineIcon fontSize="1em" />
                  </Tooltip>
                </Box>
              }
              placeholder="Enter a title for the article"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              multiline
              size="small"
              sx={{ mt: 1, maxWidth: '300px' }}
              value={descriptionValue}
              onChange={(event) => setDescriptionValue(event.target.value)}
              label={
                <Box display="flex" flexDirection="row">
                  {'Article Description'}
                  <Tooltip title="Set a new description for the article. This will be used as the tooltip for any reference to this article, but will not be exported. If no description is provided, the path to the article will be used as the description.">
                    <HelpOutlineIcon fontSize="1em" />
                  </Tooltip>
                </Box>
              }
              placeholder="Enter a description"
            />
          </Grid>
          <Grid item xs={6}>
            <Box marginTop={2} flexDirection="row" display="flex">
              Make this article a folder?
              <Tooltip title="A folder cannot have its content edited and does not have its contents exported. It acts only as a container for other articles.">
                <HelpOutlineIcon fontSize="1em" />
              </Tooltip>
              <Switch checked={folderValue} onChange={(event) => setFolderValue(event.target.checked)}></Switch>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box marginTop={2} flexDirection="row" display="flex">
              Prevent this article from being exported?
              <Tooltip title="An article that is not exported will not be in the exported version. This includes all children of the article.">
                <HelpOutlineIcon fontSize="1em" />
              </Tooltip>
              <Switch checked={noExportValue} onChange={(event) => setNoExportValue(event.target.checked)}></Switch>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <IconChoice options={options} value={iconNameValue} onChange={handleIconNameChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="warning" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const newArticle = {
              ...article,
              title: titleValue,
              article_description: descriptionValue,
              no_export: noExportValue,
              is_folder: folderValue,
              icon_name: iconNameValue.icon_name ? iconNameValue.icon_name : null,
            };
            setSingleArticle(metadataDialogAnchor, newArticle);
            onClose();
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  ) : null;
}
ArticleMetadataDialog.propTypes = {
  metadataDialogAnchor: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
export default ArticleMetadataDialog;
