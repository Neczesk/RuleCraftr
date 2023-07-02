// Import React dependencies.
import { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

//Slate Dependencies
import { createEditor, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
// Custome slate dependencies
import RulesetEditor from './utils/RulesetEditor'
import { GenstaffEditor } from './utils/GenstaffEditor'
import { ArticleLink, CodeElement, DefaultElement, HeaderElement, KeywordLink, Leaf } from './utils/elementComponents'
// Material Dependencies
import { Button, IconButton, ButtonGroup, Box, TextField, styled, Toolbar, Stack, Paper } from '@mui/material'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined'
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined'
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
// Local modules
import useRulesetStore from '../../stores/rulesetStore'
import { findArticleInRuleset, saveRuleset, updateArticle } from '../../data/rulesets'
import KeywordRefMenu from './KeywordRefMenu'
import ArticleRefMenu from './ArticleRefMenu'
import StyleSelectAutocomplete from './utils/StyleSelectAutocomplete'

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontSize: '24px', // Set the font size you need
    textAlign: 'center', // This is to center the text
  },
  '& .MuiInputLabel-root': {
    fontSize: '22px', // Set the font size you need
  },
})

export default function ArticleEditor({ onEditorChange, initialValue, articleId, selectArticle, inspectKeyword }) {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const setRuleset = useRulesetStore((state) => state.setRuleset)
  const [article, setArticle] = useState(null)
  const saveArticle = () => {
    const { selection } = editor
    saveRuleset(ruleset).then((newRuleset) => setRuleset(newRuleset))
    ReactEditor.focus(editor)
    if (editor.selection) Transforms.select(editor, selection)
  }
  const setArticleChanged = () => {
    setRuleset(updateArticle(articleId, ruleset, editor.children, null))
  }
  const [editor] = useState(() => withReact(GenstaffEditor(createEditor())))

  /* eslint-disable react/prop-types */
  const renderElement = useCallback(
    (props) => {
      const handleArticleSelect = (id) => {
        Transforms.deselect(editor)
        selectArticle(id)
      }
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(props.element.type)) {
        return <HeaderElement htype={props.element.type} {...props} />
      } else {
        switch (props.element.type) {
          case 'code':
            return <CodeElement {...props} />
          case 'keyword':
            return <KeywordLink selectKeyword={inspectKeyword} {...props} />
          case 'articleRef':
            return <ArticleLink selectArticle={handleArticleSelect} {...props} />
          default:
            return <DefaultElement {...props} />
        }
      }
    },
    [editor, selectArticle, inspectKeyword]
  )
  /* eslint-enable react/prop-types */

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />
  }, [])

  const onKeyDown = (event) => {
    if (event.key === '.' && event.ctrlKey) {
      event.preventDefault()
    }
    if ([1, 2, 3, 4, 5, 6].includes(Number(event.key)) && event.ctrlKey) {
      let htype
      switch (event.key) {
        case '1':
          htype = 'h1'
          break
        case '2':
          htype = 'h2'
          break
        case '3':
          htype = 'h3'
          break
        case '4':
          htype = 'h4'
          break
        case '5':
          htype = 'h5'
          break
        case '6':
          htype = 'h6'
          break
      }
      event.preventDefault()
      RulesetEditor.changeStyle(editor, htype)
    }
    if (event.key === '`' && event.ctrlKey) {
      event.preventDefault()
      RulesetEditor.changeStyle(editor, 'code')
    }
    if (event.key === 'p' && event.ctrlKey) {
      event.preventDefault()
      RulesetEditor.changeStyle(editor, 'paragraph')
    }
    if (event.key === 'u' && event.ctrlKey) {
      event.preventDefault()
      RulesetEditor.toggleUnderlineMark(editor)
    }
    if (event.key === 'b' && event.ctrlKey) {
      event.preventDefault()
      RulesetEditor.toggleBoldMark(editor)
    }
    if (event.key === 'i' && event.ctrlKey) {
      event.preventDefault()
      RulesetEditor.toggleItalicMark(editor)
    }
    if (event.key === 'a' && event.ctrlKey) {
      event.preventDefault()
      const nativeSelection = window.getSelection()
      if (nativeSelection?.rangeCount) {
        setArticleRefMenuOpen(true)
        const range = nativeSelection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setArticleRefMenuPosition({ left: rect.left, top: rect.bottom })
      }
    }
    if (event.key === 'k' && event.ctrlKey) {
      event.preventDefault()
      const nativeSelection = window.getSelection()
      if (nativeSelection?.rangeCount) {
        setKeywordRefMenuOpen(true)
        const range = nativeSelection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setKeywordRefMenuPosition({ left: rect.left, top: rect.bottom })
      }
    }
    if (event.key === 's' && event.ctrlKey) {
      event.preventDefault()
      saveArticle()
    }
  }

  useEffect(() => {
    Transforms.deselect(editor)
  }, [articleId, editor])

  useEffect(() => {
    if (articleId) {
      const newArticle = findArticleInRuleset(articleId, ruleset.articles)
      if (newArticle) {
        editor.children = newArticle?.content
        editor.onChange()
        setArticle(newArticle)
        setArticleTitle(newArticle.title)
      }
    } else {
      // Sets the content and title of the article back to the initial value.
      // Since the slate editor is an uncontrolled component it has to be done using the
      // library's built in functions instead of simply replacing it
      setArticleTitle('No Article Selected')
      Transforms.deselect(editor)
      editor.children.map(() => {
        Transforms.delete(editor, { at: [0] })
      })
      Transforms.insertNodes(editor, initialValue, { at: [0] })
    }
  }, [articleId, ruleset.articles, editor, initialValue])

  const [articleTitle, setArticleTitle] = useState('No Article Selected')
  const handleTitleChange = (event) => {
    setRuleset(updateArticle(articleId, ruleset, null, event.target.value))
    setArticleTitle(event.target.value)
  }

  const [articleRefMenuOpen, setArticleRefMenuOpen] = useState(false)
  const [articleRefMenuPosition, setArticleRefMenuPosition] = useState({ top: 0, left: 0 })
  const handleArticleRefMenuClose = (id) => {
    if (id) RulesetEditor.insertArticleRef(editor, id)
    setArticleRefMenuOpen(false)
    setTimeout(() => {
      ReactEditor.focus(editor)
    }, 0)
  }

  const [keywordRefMenuOpen, setKeywordRefMenuOpen] = useState(false)
  const [keywordRefMenuPosition, setKeywordRefMenuPosition] = useState({ top: 0, left: 0 })
  const handleKeywordRefMenuClose = (id) => {
    if (id) RulesetEditor.insertKeywordRef(editor, id)
    setKeywordRefMenuOpen(false)
    setTimeout(() => {
      ReactEditor.focus(editor)
    }, 0)
  }

  const [currentSelection, setCurrentSelection] = useState(null)
  const [currentNodeStyle, setCurrentNodeStyle] = useState('No Selection')
  useEffect(() => {
    if (!currentSelection) return
    const currentStyle = RulesetEditor.getCurrentElementType(editor)
    setCurrentNodeStyle(currentStyle ? currentStyle : 'No Selection')
  }, [currentSelection, editor])
  const handleStyleChange = (newStyle) => {
    RulesetEditor.changeStyle(editor, newStyle)
  }

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
      <Box
        sx={{
          overflowY: 'auto',
          height: '100%',
        }}
      >
        <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 99, mb: 2 }}>
          <Toolbar disableGutters sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', pb: 1, pt: 2 }}>
              <Stack direction="row">
                <ButtonGroup variant="text">
                  <IconButton onClick={saveArticle} disabled={ruleset?.synced}>
                    <SaveOutlinedIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      RulesetEditor.toggleBoldMark(editor)
                      ReactEditor.focus(editor)
                    }}
                  >
                    <FormatBoldOutlinedIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      RulesetEditor.toggleItalicMark(editor)
                      ReactEditor.focus(editor)
                    }}
                  >
                    <FormatItalicOutlinedIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      RulesetEditor.toggleUnderlineMark(editor)
                      ReactEditor.focus(editor)
                    }}
                  >
                    <FormatUnderlinedOutlinedIcon />
                  </IconButton>
                  <Button
                    onClick={(event) => {
                      event.preventDefault()
                      setArticleRefMenuOpen(true)
                      setArticleRefMenuPosition({ top: event.clientY, left: event.clientX })
                    }}
                    startIcon={<ArticleOutlinedIcon />}
                  >
                    Reference
                  </Button>
                  <Button
                    onClick={(event) => {
                      setKeywordRefMenuOpen(true)
                      setKeywordRefMenuPosition({ top: event.clientY, left: event.clientX })
                    }}
                    startIcon={<KeyOutlinedIcon />}
                  >
                    Reference
                  </Button>
                </ButtonGroup>
                <StyleSelectAutocomplete
                  possibleStyles={['code', 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                  currentStyle={currentNodeStyle}
                  onChange={handleStyleChange}
                />
              </Stack>
            </Paper>
          </Toolbar>
        </Box>

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
        <Slate
          editor={editor}
          value={initialValue}
          onChange={() => {
            if (
              article &&
              JSON.stringify(article.content) != JSON.stringify(editor.children) &&
              article.id == articleId
            ) {
              setArticleChanged()
            }
            if (onEditorChange) onEditorChange(editor.children)
            const { selection } = editor
            if (selection) {
              setCurrentSelection(Object.assign({}, selection))
            }
          }}
        >
          <Editable renderLeaf={renderLeaf} renderElement={renderElement} onKeyDown={onKeyDown} />
        </Slate>
      </Box>
    </>
  )
}

ArticleEditor.propTypes = {
  onEditorChange: PropTypes.func,
  initialValue: PropTypes.array.isRequired,
  articleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectArticle: PropTypes.func,
  inspectKeyword: PropTypes.func,
}
