// Import React dependencies.
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import objectHash from 'object-hash';

//Slate Dependencies
import { Slate, Editable } from 'slate-react';
import { Editor } from 'slate';
// Custome slate dependencies
// Material Dependencies
import { Box, TextField, styled, Paper, useTheme } from '@mui/material';

// Local modules
import useRulesetStore from '../../../stores/rulesetStore';
import { findArticleInRuleset } from '../../../data/rulesets';
import { useGenstaff } from '../SlateComponents/GenstaffEditor';

import { debounce } from 'lodash';
import RulesetEditor from '../SlateComponents/RulesetEditor';
import useEditorStore from '../../../stores/editorStore';

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
  openArticleRefMenu,
  openKeywordRefMenu,
  setCurrentSelection,
  saveArticle,
}) {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setSingleArticle = useRulesetStore((state) => state.setSingleArticle);
  const { renderElement, renderLeaf, onKeyDown } = useGenstaff(
    editor,
    selectArticle,
    inspectKeyword,
    openArticleRefMenu,
    openKeywordRefMenu,
    saveArticle
  );
  const { setBoldActive, setUnderlineActive, setItalicsActive, setCurrentStyle } = useEditorStore();

  const fetchMarks = useCallback(() => {
    if (!Editor.marks(editor)) return [];
    return Object.keys(Editor.marks(editor));
  }, [editor]);

  const handleChange = () => {
    if (articleId) {
      if (editor.selection) {
        const currentStyle = RulesetEditor.getCurrentElementType(editor);
        setCurrentStyle(currentStyle ? currentStyle : 'No Selection');
      }
      const marks = fetchMarks();
      setItalicsActive(marks.includes('italic'));
      setUnderlineActive(marks.includes('underline'));
      setBoldActive(marks.includes('bold'));

      const article = findArticleInRuleset(articleId, ruleset.articles);
      if (objectHash.sha1(editor.children) !== objectHash.sha1(article.content)) {
        setArticleChanged(article);
      }
    }
  };
  const debouncedHandleChange = debounce(handleChange, 200);

  const setArticleChanged = (article) => {
    const updateData = { ...article, content: editor.children };
    setSingleArticle(article.id, updateData);
  };
  const [oldArticle, setOldArticle] = useState(null);
  useEffect(() => {
    if (oldArticle === articleId) return;
    setOldArticle(articleId);
    if (articleId) {
      const newArticle = findArticleInRuleset(articleId, ruleset.articles);
      if (newArticle) {
        setArticleTitle(newArticle.title);
        RulesetEditor.replaceContents(editor, newArticle.content);
        // setArticleHash(objectHash.sha1(newArticle.content));
      }
    } else {
      RulesetEditor.replaceContents(editor, initialValue);
      setArticleTitle('No Article Selected');
    }
  }, [articleId, ruleset.articles, initialValue, editor, oldArticle]);

  const [articleTitle, setArticleTitle] = useState('No Article Selected');
  const handleTitleChange = (event) => {
    setSingleArticle(articleId, { id: articleId, title: articleTitle });
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
              onChange={debouncedHandleChange}
            >
              <Editable
                onBlur={() => {
                  setCurrentSelection(editor.selection);
                }}
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
  setCurrentSelection: PropTypes.func.isRequired,
  saveArticle: PropTypes.func.isRequired,
  openArticleRefMenu: PropTypes.func.isRequired,
  openKeywordRefMenu: PropTypes.func.isRequired,
};
