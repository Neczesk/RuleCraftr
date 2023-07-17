import { useState, useEffect, useCallback, useRef, useLayoutEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { unstable_useBlocker as useBlocker, useParams } from 'react-router';

import { createEditor, Transforms } from 'slate';
import { withReact, ReactEditor } from 'slate-react';
import { GenstaffEditor } from './SlateComponents/GenstaffEditor';
import RulesetEditor from './SlateComponents/RulesetEditor';

import Grid from '@mui/material/Grid';
import { Box, useTheme, IconButton } from '@mui/material';

import { findArticleInRuleset, findKeywordInRuleset, getRuleset, saveRuleset } from '../../data/rulesets';
import useRulesetStore from '../../stores/rulesetStore';
import EditorToolbar from './utils/EditorToolbar';
import ArticleEditor from './ArticleContentEditor/ArticleEditor';
import ArticleTree from './ArticleTree/ArticleTree';
import KeywordInspector from './KeywordInspector/KeywordInspector';
import ConfirmNavigationDialogue from './Dialogues/ConfirmNavigationDialogue';
import KeywordRefMenu from './Dialogues/KeywordRefMenu';
import ArticleRefMenu from './Dialogues/ArticleRefMenu';
import ExportDialog from '../utils/ExportDialog';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';

function EditorPage() {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setRuleset = useRulesetStore((state) => state.setRuleset);
  const clearRuleset = useRulesetStore((state) => state.clearRuleset);
  const clearRulesetCallback = useCallback(() => {
    clearRuleset();
  }, [clearRuleset]);
  const synced = useRulesetStore((state) => state.synced);
  const setSynced = useRulesetStore((state) => state.setRulesetChanged);
  const [currentArticle, setCurrentArticle] = useState(null);
  const params = useParams();
  const rulesetId = params.id;

  const initialValue = useMemo(
    () => [
      {
        type: 'paragraph',
        children: [{ text: 'No article selected' }],
      },
    ],
    []
  );
  useEffect(() => {
    setCurrentArticle(null);
    setSelectedKeyword(null);
    if (rulesetId && rulesetId !== 'demo') {
      clearRuleset();
      getRuleset(rulesetId).then((value) => setRuleset(value));
    }
  }, [rulesetId, setRuleset, clearRuleset]);
  useEffect(() => {
    const article = findArticleInRuleset(currentArticle, ruleset.articles);
    if (!article) {
      setCurrentArticle(null);
    }
  }, [ruleset, currentArticle]);
  const selectArticle = (id) => {
    setCurrentArticle(id);
  };
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const selectKeyword = (id) => {
    const keyword = findKeywordInRuleset(id, ruleset);
    setSelectedKeyword(keyword && !keyword.deleted ? id : null);
  };

  const [saved, setSaved] = useState(true);
  useEffect(() => {
    setSaved(synced);
  }, [synced]);
  const [editor] = useState(() => withReact(GenstaffEditor(createEditor())));

  useEffect(() => {
    const handleUnload = (e) => {
      if (!saved /* check your condition here */) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set.
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [saved]); // Depend on your state variable

  const shouldBlock = useCallback(
    ({ currentLocation, nextLocation }) => !saved && currentLocation.pathname != nextLocation.pathname,
    [saved]
  );
  const blocker = useBlocker(shouldBlock);
  useEffect(() => {
    if (blocker.state === 'blocked' && saved) {
      blocker.reset();
    }
  }, [blocker, saved]);

  const [articleMenuEditor, setArticleMenuEditor] = useState(null);
  const [articleRefMenuOpen, setArticleRefMenuOpen] = useState(false);
  const [articleRefMenuPosition, setArticleRefMenuPosition] = useState({ top: 0, left: 0 });
  const [keywordMenuEditor, setKeywordMenuEditor] = useState(null);
  const [keywordRefMenuOpen, setKeywordRefMenuOpen] = useState(false);
  const [keywordRefMenuPosition, setKeywordRefMenuPosition] = useState({ top: 0, left: 0 });

  const openArticleRefMenu = (event, editor, shortcut = false) => {
    setArticleRefMenuOpen(true);
    setArticleMenuEditor(editor);
    if (!shortcut) setArticleRefMenuPosition({ top: event.clientY, left: event.clientX });
    else {
      const nativeSelection = window.getSelection();
      if (nativeSelection?.rangeCount) {
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setArticleRefMenuPosition({ left: rect.left, top: rect.bottom });
      }
    }
  };
  const openKeywordRefMenu = (event, editor, shortcut = false) => {
    event.preventDefault();
    setKeywordRefMenuOpen(true);
    setKeywordMenuEditor(editor);
    if (!shortcut) setKeywordRefMenuPosition({ top: event.clientY, left: event.clientX });
    else {
      const nativeSelection = window.getSelection();
      if (nativeSelection?.rangeCount) {
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setKeywordRefMenuPosition({ left: rect.left, top: rect.bottom });
      }
    }
  };

  const handleArticleRefMenuClose = (id, editor) => {
    if (!id || !editor) {
      setArticleRefMenuOpen(false);
      return;
    }
    if (id) {
      const pointAfter = RulesetEditor.insertArticleRef(editor, id);
      setArticleRefMenuOpen(false);
      setTimeout(() => {
        ReactEditor.focus(editor);
        Transforms.select(editor, pointAfter);
      }, 0);
    }
  };
  const handleKeywordRefMenuClose = (id, editor) => {
    if (!id || !editor) {
      setKeywordRefMenuOpen(false);
      return;
    }
    if (id) {
      const pointAfter = RulesetEditor.insertKeywordRef(editor, id);
      setKeywordRefMenuOpen(false);
      setTimeout(() => {
        ReactEditor.focus(editor);
        Transforms.select(editor, pointAfter);
      }, 0);
    }
  };

  useEffect(() => {
    // This will run when the location changes, but the clearRuleset
    // function will only run when the component is unmounting.
    return () => {
      clearRulesetCallback();
    };
  }, [clearRulesetCallback]);

  const [currentSelection, setCurrentSelection] = useState(null);
  const changeSelection = (newSelection) => {
    if (newSelection && JSON.stringify(currentSelection) !== JSON.stringify(newSelection)) {
      setCurrentSelection(Object.assign({}, newSelection));
    }
  };

  const handleStyleChange = (newStyle) => {
    RulesetEditor.changeStyle(editor, newStyle);
  };
  const saveArticle = useCallback(() => {
    const { selection } = editor;
    saveRuleset(ruleset).then((newRuleset) => setRuleset(newRuleset));
    setSynced(true);
    ReactEditor.focus(editor);
    if (editor.selection) Transforms.select(editor, selection);
  }, [editor, ruleset, setRuleset, setSynced]);

  const toolbarRef = useRef(null);
  const boxRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(0);

  useLayoutEffect(() => {
    const toolbarHeight = toolbarRef.current.clientHeight;
    const boxHeight = boxRef.current.clientHeight;
    if (toolbarRef.current) setEditorHeight(boxHeight - toolbarHeight - 1);
  }, [toolbarRef]);

  const theme = useTheme();

  const [exportType, setExportType] = useState(null);
  const handleExport = (type) => {
    if ((type === 'article' && currentArticle) || type === 'ruleset') setExportType(type);
  };
  const [keywordPanelOpen, setKeywordPanelOpen] = useState(false);
  const [articleTreeOpen, setArticleTreeOpen] = useState(false);
  return (
    <>
      <ExportDialog
        articleId={currentArticle}
        ruleset={ruleset}
        type={exportType}
        open={Boolean(exportType)}
        onClose={() => setExportType(null)}
      />
      <KeywordRefMenu
        anchorPosition={keywordRefMenuPosition}
        open={keywordRefMenuOpen}
        onClose={handleKeywordRefMenuClose}
        editor={keywordMenuEditor}
      />
      <ArticleRefMenu
        anchorPosition={articleRefMenuPosition}
        open={articleRefMenuOpen}
        onClose={handleArticleRefMenuClose}
        editor={articleMenuEditor}
        selection={currentSelection}
      />
      <ConfirmNavigationDialogue blocker={blocker} />{' '}
      <Box
        ref={boxRef}
        height="calc(100vh - 48px)"
        maxHeight="calc(100vh - 48px)"
        display="flex"
        flexDirection="column"
        overflow="none"
      >
        <EditorToolbar
          handleExport={handleExport}
          articleId={currentArticle}
          ref={toolbarRef}
          elevation={1}
          handleStyleChange={handleStyleChange}
          editor={editor}
          ruleset={ruleset}
          saveArticle={saveArticle}
          openArticleRefMenu={openArticleRefMenu}
          openKeywordRefMenu={openKeywordRefMenu}
        />
        <Box height={editorHeight} maxHeight={editorHeight}>
          <Grid
            columns={36}
            container
            sx={{
              overflow: 'none',
              height: '100%',
            }}
          >
            <Grid
              sx={{ overflowX: 'auto', height: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column' }}
              item
              xs={articleTreeOpen ? 7 : 1}
              lg={articleTreeOpen ? 6 : 1}
              xl={articleTreeOpen ? 5 : 1}
            >
              <Box display="flex" flexDirection="row">
                <IconButton
                  color="secondary"
                  onClick={() => setArticleTreeOpen(!articleTreeOpen)}
                  sx={{ maxWidth: '100%', boxSizing: 'border-box', display: articleTreeOpen ? 'none' : 'flex', pb: 0 }}
                >
                  <MenuOpenOutlinedIcon fontSize="large" style={{ transform: 'scaleX(-1)' }} />
                </IconButton>
                <Box flexGrow={1}></Box>
                <IconButton
                  color="secondary"
                  sx={{ maxWidth: '100%', boxSizing: 'border-box', display: articleTreeOpen ? 'flex' : 'none', pb: 0 }}
                  onClick={() => setArticleTreeOpen(!articleTreeOpen)}
                >
                  <MenuOpenOutlinedIcon fontSize="large" />
                </IconButton>
              </Box>
              <ArticleTree
                sx={{
                  display: articleTreeOpen ? 'flex' : 'none',
                  flexGrow: 1,
                  flexDirection: 'column',
                  overflowY: 'hidden',
                }}
                onArticleSelect={selectArticle}
                elevation={0}
                selectedNode={currentArticle ? [currentArticle.toString()] : [null]}
              />
            </Grid>

            <Grid
              item
              xs
              sx={{
                height: '100%',
                backgroundColor: theme.palette.primaryContainer.main,
                pt: 2,
                overflow: 'hidden',
              }}
              zIndex="2"
            >
              <ArticleEditor
                initialValue={initialValue}
                articleId={currentArticle}
                selectArticle={selectArticle}
                inspectKeyword={selectKeyword}
                elevation={6}
                editor={editor}
                openKeywordRefMenu={openKeywordRefMenu}
                openArticleRefMenu={openArticleRefMenu}
                setCurrentSelection={changeSelection}
                saveArticle={saveArticle}
              />
            </Grid>
            <Grid
              item
              xs={keywordPanelOpen ? 11 : 1}
              lg={keywordPanelOpen ? 10 : 1}
              xl={keywordPanelOpen ? 9 : 1}
              sx={{ height: '100%', maxHeight: '100%' }}
            >
              <Box display="flex" flexDirection="row">
                <IconButton
                  color="secondary"
                  onClick={() => setKeywordPanelOpen(!keywordPanelOpen)}
                  sx={{
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    display: keywordPanelOpen ? 'flex' : 'none',
                    pb: 0,
                  }}
                >
                  <MenuOpenOutlinedIcon fontSize="large" style={{ transform: 'scaleX(-1)' }} />
                </IconButton>
                <Box flexGrow={1}></Box>
                <IconButton
                  color="secondary"
                  sx={{
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    display: keywordPanelOpen ? 'none' : 'flex',
                    pb: 0,
                  }}
                  onClick={() => setKeywordPanelOpen(!keywordPanelOpen)}
                >
                  <MenuOpenOutlinedIcon fontSize="large" />
                </IconButton>
              </Box>

              <KeywordInspector
                sx={{
                  display: keywordPanelOpen ? 'flex' : 'none',
                  flexGrow: 1,
                }}
                keywordId={selectedKeyword}
                onSelectKeyword={selectKeyword}
                elevation={0}
                openArticleRefMenu={openArticleRefMenu}
                openKeywordRefMenu={openKeywordRefMenu}
                selectArticle={selectArticle}
                setCurrentSelection={changeSelection}
                saveArticle={saveArticle}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

EditorPage.propTypes = {
  rulesetId: PropTypes.number,
};

export default EditorPage;
