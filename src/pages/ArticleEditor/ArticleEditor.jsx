// Import React dependencies.
import { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

//Slate Dependencies
import { Transforms } from 'slate'
import { Slate, Editable } from 'slate-react'
// Custome slate dependencies
import RulesetEditor from './utils/RulesetEditor'
import { ArticleLink, CodeElement, DefaultElement, HeaderElement, KeywordLink, Leaf } from './utils/elementComponents'
// Material Dependencies
import { Box, TextField, styled, Paper } from '@mui/material'

// Local modules
import useRulesetStore from '../../stores/rulesetStore'
import { findArticleInRuleset, updateArticle } from '../../data/rulesets'

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontSize: '24px', // Set the font size you need
    textAlign: 'center', // This is to center the text
  },
  '& .MuiInputLabel-root': {
    fontSize: '22px', // Set the font size you need
  },
})

export default function ArticleEditor({
  onEditorChange,
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
  const ruleset = useRulesetStore((state) => state.ruleset)
  const setRuleset = useRulesetStore((state) => state.setRuleset)
  const [article, setArticle] = useState(null)

  const setArticleChanged = () => {
    setRuleset(updateArticle(articleId, ruleset, editor.children, null))
  }

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

  return (
    <>
      <Paper
        sx={{
          borderRadius: 0,
          height: '100%',
          overflowY: 'auto',
          borderLeft: '1px solid #BBBBBB',
          borderRight: '1px solid #BBBBBB',
          display: 'flex',
          flexDirection: 'column',
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
              <Editable
                style={{
                  height: '100%',
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
  )
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
}
