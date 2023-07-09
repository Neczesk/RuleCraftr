import { useState, useMemo, useEffect, useCallback, useContext } from 'react';
import { Box, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { PropTypes } from 'prop-types';
import { Editable, Slate, withReact } from 'slate-react';
import { createEditor, Editor } from 'slate';
import { GenstaffEditor, useGenstaff } from './GenstaffEditor';
import { ReactEditor } from 'slate-react';
import RulesetEditor from './RulesetEditor';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { ColorModeContext } from '../../App';

function LongDefinitionEditor(props) {
  const {
    onChange,
    color,
    setKeywordRefMenuOpen,
    setArticleRefMenuOpen,
    setArticleRefMenuPosition,
    setKeywordRefMenuPosition,
    selectArticle,
    saveArticle,
    inspectKeyword,
    keyword,
    ...others
  } = props;
  const [editor] = useState(() => withReact(GenstaffEditor(createEditor())));
  const [focused, setFocused] = useState(false);
  const initialValue = useMemo(
    () => [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
    []
  );
  const { renderElement, renderLeaf } = useGenstaff(editor, selectArticle, inspectKeyword);
  const theme = useTheme();
  const onKeyDown = (event) => {
    if (event.key === 'p' && event.ctrlKey) {
      event.preventDefault();
      RulesetEditor.changeStyle(editor, 'paragraph');
    }
    if (event.key === 'u' && event.ctrlKey) {
      event.preventDefault();
      RulesetEditor.toggleUnderlineMark(editor);
    }
    if (event.key === 'b' && event.ctrlKey) {
      event.preventDefault();
      RulesetEditor.toggleBoldMark(editor);
    }
    if (event.key === 'i' && event.ctrlKey) {
      event.preventDefault();
      RulesetEditor.toggleItalicMark(editor);
    }
    if (event.key === 'a' && event.ctrlKey) {
      event.preventDefault();
      const nativeSelection = window.getSelection();
      if (nativeSelection?.rangeCount) {
        setArticleRefMenuOpen(true, editor);
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setArticleRefMenuPosition({ left: rect.left, top: rect.bottom });
      }
    }
    if (event.key === 'k' && event.ctrlKey) {
      event.preventDefault();
      const nativeSelection = window.getSelection();
      if (nativeSelection?.rangeCount) {
        setKeywordRefMenuOpen(true, editor);
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setKeywordRefMenuPosition({ left: rect.left, top: rect.bottom });
      }
    }
    if (event.key === 's' && event.ctrlKey) {
      event.preventDefault();
      saveArticle();
    }
  };
  useEffect(() => {
    // Replace the entire document with newData
    if (keyword) {
      if (keyword.longDefinition) RulesetEditor.replaceContents(editor, keyword.longDefinition);
      else RulesetEditor.replaceContents(editor, initialValue);
    }
  }, [keyword, editor, initialValue]);
  const [boldActive, setBoldActive] = useState(false);
  const [italicsActive, setItalicsActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);
  const fetchMarks = useCallback(() => {
    if (!Editor.marks(editor)) return [];
    return Object.keys(Editor.marks(editor));
  }, [editor]);
  useEffect(() => {
    const marks = fetchMarks();
    setItalicsActive(marks.includes('italic'));
    setUnderlineActive(marks.includes('underline'));
    setBoldActive(marks.includes('bold'));
  }, [editor.selection, fetchMarks]);
  const colorModeContext = useContext(ColorModeContext);
  const [currentContainerColor, setCurrentContainerColor] = useState(
    colorModeContext.colorMode === 'light'
      ? theme.palette.secondaryContainer.dark
      : theme.palette.secondaryContainer.light
  );
  useEffect(() => {
    setCurrentContainerColor(
      colorModeContext.colorMode === 'light'
        ? theme.palette.secondaryContainer.dark
        : theme.palette.secondaryContainer.light
    );
  }, [theme, colorModeContext]);
  return (
    <Box {...others} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
      <Typography sx={{ color: focused ? color : 'inherit' }} variant="caption">
        Long Definition
      </Typography>
      <Box
        sx={{
          backgroundColor: focused ? currentContainerColor : theme.palette.background.default,
        }}
      >
        <IconButton
          onClick={() => {
            setBoldActive(!boldActive);
            RulesetEditor.toggleBoldMark(editor);
            ReactEditor.focus(editor);
          }}
          sx={{
            color: boldActive ? theme.palette.primary.main : theme.palette.getContrastText(currentContainerColor),
          }}
          size="small"
          onMouseDown={(event) => event.preventDefault()}
        >
          <FormatBoldOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            color: italicsActive ? theme.palette.primary.main : theme.palette.getContrastText(currentContainerColor),
          }}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setItalicsActive(!italicsActive);
            RulesetEditor.toggleItalicMark(editor);
            ReactEditor.focus(editor);
          }}
        >
          <FormatItalicOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          sx={{
            color: underlineActive ? theme.palette.primary.main : theme.palette.getContrastText(currentContainerColor),
          }}
          size="small"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setUnderlineActive(!underlineActive);
            RulesetEditor.toggleUnderlineMark(editor);
            ReactEditor.focus(editor);
          }}
        >
          <FormatUnderlinedOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          sx={{
            color: theme.palette.getContrastText(currentContainerColor),
          }}
          size="small"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            const nativeSelection = window.getSelection();
            if (nativeSelection?.rangeCount) {
              setArticleRefMenuOpen(true, editor);
              const range = nativeSelection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              setArticleRefMenuPosition({ left: rect.left, top: rect.bottom });
            }
          }}
        >
          <ArticleOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          sx={{
            color: theme.palette.getContrastText(currentContainerColor),
          }}
          size="small"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            const nativeSelection = window.getSelection();
            if (nativeSelection?.rangeCount) {
              setKeywordRefMenuOpen(true, editor);
              const range = nativeSelection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              setKeywordRefMenuPosition({ left: rect.left, top: rect.bottom });
            }
          }}
        >
          <KeyOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Paper
        elevation={colorModeContext.colorMode === 'dark' && focused ? 6 : 0}
        sx={{
          borderRadius: 0,
          borderBottom: 'solid 1px',
          borderColor: focused ? currentContainerColor : 'inherit',
          padding: 1,
          backgroundColor: focused ? theme.palette.background.paper : theme.palette.primaryContainer.main,
        }}
      >
        <Slate
          editor={editor}
          value={initialValue}
          onChange={() => {
            keyword.longDefinition = editor.children;
            const marks = fetchMarks();
            setItalicsActive(marks.includes('italic'));
            setUnderlineActive(marks.includes('underline'));
            setBoldActive(marks.includes('bold'));
          }}
        >
          <Editable
            onBlur={() => {
              if (keyword) onChange(editor.children);
            }}
            onKeyDown={onKeyDown}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter the full definition here"
          ></Editable>
        </Slate>
      </Paper>
    </Box>
  );
}
LongDefinitionEditor.propTypes = {
  others: PropTypes.array,
  color: PropTypes.string,
  setKeywordRefMenuOpen: PropTypes.func.isRequired,
  setArticleRefMenuOpen: PropTypes.func.isRequired,
  setArticleRefMenuPosition: PropTypes.func.isRequired,
  setKeywordRefMenuPosition: PropTypes.func.isRequired,
  selectArticle: PropTypes.func.isRequired,
  inspectKeyword: PropTypes.func.isRequired,
  saveArticle: PropTypes.func.isRequired,
  keyword: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};
export default LongDefinitionEditor;
