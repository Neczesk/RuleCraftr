import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import ArticleEditor from './ArticleEditor'
import ArticleTree from './ArticleTree'
import useRulesetStore from '../../stores/rulesetStore'
import KeywordInspector from './KeywordInspector'
import { findArticleInRuleset, findKeywordInRuleset, getRuleset } from '../../data/rulesets'
import { useParams } from 'react-router'
import { unstable_useBlocker as useBlocker } from 'react-router'
import ConfirmNavigationDialogue from './utils/ConfirmNavigationDialogue'
import KeywordRefMenu from './KeywordRefMenu'
import ArticleRefMenu from './ArticleRefMenu'
import { withReact, ReactEditor } from 'slate-react'

import RulesetEditor from './utils/RulesetEditor'
import { GenstaffEditor } from './utils/GenstaffEditor'
import { createEditor, Transforms } from 'slate'

import { saveRuleset } from '../../data/rulesets'
import EditorToolbar from './utils/EditorToolbar'

function EditorPage() {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const setRuleset = useRulesetStore((state) => state.setRuleset)
  const clearRuleset = useRulesetStore((state) => state.clearRuleset)
  const [currentArticle, setCurrentArticle] = useState(null)
  const params = useParams()
  const rulesetId = params.id

  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'No article selected' }],
    },
  ]
  useEffect(() => {
    setCurrentArticle(null)
    setSelectedKeyword(null)
    clearRuleset()
    if (rulesetId) {
      getRuleset(rulesetId).then((value) => setRuleset(value))
    }
  }, [rulesetId, setRuleset, clearRuleset])
  useEffect(() => {
    const article = findArticleInRuleset(currentArticle, ruleset.articles)
    if (!article) {
      setCurrentArticle(null)
    }
  }, [ruleset, currentArticle])
  const selectArticle = (id) => {
    setCurrentArticle(id)
  }
  const [selectedKeyword, setSelectedKeyword] = useState(null)
  const selectKeyword = (id) => {
    const keyword = findKeywordInRuleset(id, ruleset)
    setSelectedKeyword(keyword && !keyword.deleted ? id : null)
  }

  const [saved, setSaved] = useState(true)
  useEffect(() => {
    setSaved(ruleset.synced)
  }, [ruleset])
  const [editor] = useState(() => withReact(GenstaffEditor(createEditor())))

  useEffect(() => {
    const handleUnload = (e) => {
      if (!saved /* check your condition here */) {
        e.preventDefault()
        e.returnValue = '' // Chrome requires returnValue to be set.
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [saved]) // Depend on your state variable

  const shouldBlock = useCallback(
    ({ currentLocation, nextLocation }) => !saved && currentLocation.pathname != nextLocation.pathname,
    [saved]
  )
  const blocker = useBlocker(shouldBlock)
  useEffect(() => {
    if (blocker.state === 'blocked' && saved) {
      blocker.reset()
    }
  }, [blocker, saved])

  const [articleRefMenuOpen, setArticleRefMenuOpen] = useState(false)
  const [articleRefMenuPosition, setArticleRefMenuPosition] = useState({ top: 0, left: 0 })
  const handleArticleRefMenuClose = useCallback(
    (id) => {
      if (id) RulesetEditor.insertArticleRef(editor, id)
      setArticleRefMenuOpen(false)
      setTimeout(() => {
        ReactEditor.focus(editor)
      }, 0)
    },
    [editor]
  )

  const [keywordRefMenuOpen, setKeywordRefMenuOpen] = useState(false)
  const [keywordRefMenuPosition, setKeywordRefMenuPosition] = useState({ top: 0, left: 0 })
  const handleKeywordRefMenuClose = useCallback(
    (id) => {
      if (id) RulesetEditor.insertKeywordRef(editor, id)
      setKeywordRefMenuOpen(false)
      setTimeout(() => {
        ReactEditor.focus(editor)
      }, 0)
    },
    [editor]
  )

  const [currentSelection, setCurrentSelection] = useState(null)
  const changeSelection = (newSelection) => {
    if (newSelection && JSON.stringify(currentSelection) !== JSON.stringify(newSelection)) {
      setCurrentSelection(Object.assign({}, newSelection))
    }
  }
  const [currentNodeStyle, setCurrentNodeStyle] = useState('No Selection')
  useEffect(() => {
    if (!currentSelection) return
    const currentStyle = RulesetEditor.getCurrentElementType(editor)
    setCurrentNodeStyle(currentStyle ? currentStyle : 'No Selection')
  }, [currentSelection, editor])

  const handleStyleChange = (newStyle) => {
    RulesetEditor.changeStyle(editor, newStyle)
  }
  const saveArticle = useCallback(() => {
    const { selection } = editor
    saveRuleset(ruleset).then((newRuleset) => setRuleset(newRuleset))
    ReactEditor.focus(editor)
    if (editor.selection) Transforms.select(editor, selection)
  }, [editor, ruleset, setRuleset])

  const toolbarRef = useRef(null)
  const boxRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState(0)

  useLayoutEffect(() => {
    const toolbarHeight = toolbarRef.current.clientHeight
    const boxHeight = boxRef.current.clientHeight
    if (toolbarRef.current) setEditorHeight(boxHeight - toolbarHeight - 1)
  }, [toolbarRef])

  // const colWidth = { xs: 12, sm: 6, md: 4, lg: 3 }
  return (
    <>
      <KeywordRefMenu
        anchorPosition={keywordRefMenuPosition}
        open={keywordRefMenuOpen}
        onClose={handleKeywordRefMenuClose}
        editor={editor}
      />
      <ArticleRefMenu
        anchorPosition={articleRefMenuPosition}
        open={articleRefMenuOpen}
        onClose={handleArticleRefMenuClose}
        editor={editor}
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
          ref={toolbarRef}
          elevation={1}
          currentNodeStyle={currentNodeStyle}
          handleStyleChange={handleStyleChange}
          editor={editor}
          ruleset={ruleset}
          saveArticle={saveArticle}
          openArticleRefMenu={(event) => {
            event.preventDefault()
            setArticleRefMenuOpen(true)
            setArticleRefMenuPosition({ top: event.clientY, left: event.clientX })
          }}
          openKeywordRefMenu={(event) => {
            setKeywordRefMenuOpen(true)
            setKeywordRefMenuPosition({ top: event.clientY, left: event.clientX })
          }}
        />
        <Box height={editorHeight} maxHeight={editorHeight}>
          <Grid
            container
            sx={{
              overflow: 'none',
              height: '100%',
            }}
          >
            <Grid item xs={2}>
              <ArticleTree
                onArticleSelect={selectArticle}
                elevation={0}
                selectedNode={currentArticle ? [currentArticle.toString()] : [null]}
              />
            </Grid>
            <Grid
              item
              xs={6}
              lg={7}
              xl={8}
              sx={{
                height: '100%',
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
                setKeywordRefMenuOpen={setKeywordRefMenuOpen}
                setArticleRefMenuOpen={setArticleRefMenuOpen}
                setArticleRefMenuPosition={setArticleRefMenuPosition}
                setKeywordRefMenuPosition={setKeywordRefMenuPosition}
                setCurrentSelection={changeSelection}
                saveArticle={saveArticle}
              />
            </Grid>
            <Grid item xs={4} lg={3} xl={2} sx={{ height: '100%' }}>
              <KeywordInspector keywordId={selectedKeyword} onSelectKeyword={selectKeyword} elevation={0} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

EditorPage.propTypes = {
  rulesetId: PropTypes.number,
}

export default EditorPage
