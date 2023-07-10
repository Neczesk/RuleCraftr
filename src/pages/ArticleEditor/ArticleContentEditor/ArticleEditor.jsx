// Import React dependencies.
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

//Slate Dependencies
import { Transforms } from 'slate';
import { Slate, Editable } from 'slate-react';
// Custome slate dependencies
// Material Dependencies
import { Box, TextField, styled, Paper, useTheme } from '@mui/material';

// Local modules
import useRulesetStore from '../../../stores/rulesetStore';
import { findArticleInRuleset, updateArticle } from '../../../data/rulesets';
import { useGenstaff } from '../SlateComponents/GenstaffEditor';

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontSize: '24px', // Set the font size you need
    textAlign: 'center', // This is to center the text
  },
  '& .MuiInputLabel-root': {
    fontSize: '22px', // Set the font size you need
  },
});

export default function ArticleEditor({
  initialValue,
  articleId,
  selectArticle,
  inspectKeyword,
  elevation,
  editor,
  setKeywordRefMenuOpen,
  setArticleRefMenuOpen,
  setArticleRefMenuPosition,
  setKeywordRefMenuPosition,
  setCurrentSelection,
  saveArticle,
}) {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setRuleset = useRulesetStore((state) => state.setRuleset);
  const [article, setArticle] = useState(null);
  const { renderElement, renderLeaf, onKeyDown } = useGenstaff(
    editor,
    selectArticle,
    inspectKeyword,
    setKeywordRefMenuOpen,
    setArticleRefMenuOpen,
    setArticleRefMenuPosition,
    setKeywordRefMenuPosition,
    saveArticle
  );

  const setArticleChanged = () => {
    setRuleset(updateArticle(articleId, ruleset, editor.children, null));
  };

  useEffect(() => {
    Transforms.deselect(editor);
  }, [articleId, editor]);

  useEffect(() => {
    if (articleId) {
      const newArticle = findArticleInRuleset(articleId, ruleset.articles);
      if (newArticle) {
        setArticle(newArticle);
        setArticleTitle(newArticle.title);
      }
    } else {
      setArticleTitle('No Article Selected');
    }
  }, [articleId, ruleset.articles, initialValue]);

  const [articleTitle, setArticleTitle] = useState('No Article Selected');
  const handleTitleChange = (event) => {
    setRuleset(updateArticle(articleId, ruleset, null, event.target.value));
    setArticleTitle(event.target.value);
  };

  const theme = useTheme();

  return (
    <>
      <Paper
        sx={{
          borderRadius: 0,
          height: '100%',
          overflowY: 'auto',
          borderLeft: `1px solid ${theme.palette.paperBorder.main}`,
          borderRight: `1px solid ${theme.palette.paperBorder.main}`,
          borderTop: `1px solid ${theme.palette.paperBorder.main}`,
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          flexDirection: 'column',
          paddingX: 5,
        }}
        elevation={elevation}
      >
        <Box flexGrow="1" padding={1} display="flex" flexDirection="column">
          <Box alignContent="center" justifyContent="center" display="flex" sx={{ mt: 1, mb: 1 }}>
            <StyledTextField
              id="article-title"
              label="Title"
              variant="outlined"
              fullWidth
              value={articleTitle ? articleTitle : ' '}
              onChange={handleTitleChange}
            />
          </Box>
          <Box display="flex" flexGrow={1} flexDirection="column">
            <Slate
              style={{
                height: '100%',
              }}
              editor={editor}
              initialValue={initialValue}
              onChange={() => {
                if (
                  article &&
                  JSON.stringify(article.content) != JSON.stringify(editor.children) &&
                  article.id == articleId
                ) {
                  setArticleChanged();
                }
                const { selection } = editor;
                if (selection) {
                  setCurrentSelection(selection);
                }
              }}
            >
              <Editable
                style={{
                  height: '100%',
                  wordBreak: 'break-all',
                }}
                renderLeaf={renderLeaf}
                renderElement={renderElement}
                onKeyDown={onKeyDown}
              />
            </Slate>
          </Box>
        </Box>
      </Paper>
    </>
  );
}

ArticleEditor.propTypes = {
  onEditorChange: PropTypes.func,
  initialValue: PropTypes.array.isRequired,
  articleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectArticle: PropTypes.func,
  inspectKeyword: PropTypes.func,
  elevation: PropTypes.number,
  editor: PropTypes.object,
  setArticleRefMenuOpen: PropTypes.func.isRequired,
  setKeywordRefMenuOpen: PropTypes.func.isRequired,
  setArticleRefMenuPosition: PropTypes.func.isRequired,
  setKeywordRefMenuPosition: PropTypes.func.isRequired,
  setCurrentSelection: PropTypes.func.isRequired,
  saveArticle: PropTypes.func.isRequired,
};
