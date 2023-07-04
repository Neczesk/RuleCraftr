import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined'
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined'
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
import { Box, Toolbar, Paper, useTheme, Tabs, Tab, Grid } from '@mui/material'
import StyleSelectAutocomplete from './StyleSelectAutocomplete'
import { PropTypes } from 'prop-types'
import { ReactEditor } from 'slate-react'
import RulesetEditor from './RulesetEditor'
import useRulesetStore from '../../../stores/rulesetStore'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import EditorToolbarButton from './EditorToolbarButton'
import { Editor } from 'slate'

const EditorToolbar = forwardRef(function EditorToolBarRoot(props, ref) {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const theme = useTheme()
  const { editor } = props
  const [italicsActive, setItalicsActive] = useState(false)
  const [underlineActive, setUnderlineActive] = useState(false)
  const [boldActive, setBoldActive] = useState(false)
  const fetchMarks = useCallback(() => {
    if (!Editor.marks(editor)) return []
    return Object.keys(Editor.marks(editor))
  }, [editor])
  useEffect(() => {
    const marks = fetchMarks()
    console.log('updated marks')
    setItalicsActive(marks.includes('italic'))
    setUnderlineActive(marks.includes('underline'))
    setBoldActive(marks.includes('bold'))
  }, [editor.selection, fetchMarks])
  return (
    <Box ref={ref} sx={{ backgroundColor: 'white', zIndex: 99, mb: 0 }}>
      <Toolbar elevation={props.elevation} disableGutters sx={{ width: '100%' }}>
        <Paper
          sx={{ width: '100%', padding: 1.5, backgroundColor: theme.palette.primaryContainer.main }}
          elevation={props.elevation}
        >
          <Tabs value={0} sx={{ padding: 0, margin: 0, minHeight: 0 }}>
            <Tab id={0} label="Home" sx={{ minHeight: 0, paddingY: 0 }}></Tab>
          </Tabs>
          <Grid container sx={{ paddingX: 4, pt: 1 }} spacing={1}>
            <Grid item container xs={4}>
              <Grid item xs={1}>
                <EditorToolbarButton type="icon" onClick={props.saveArticle} disabled={ruleset?.synced}>
                  <SaveOutlinedIcon fontSize="small" />
                </EditorToolbarButton>
              </Grid>
              <Grid item xs={1}>
                <EditorToolbarButton
                  active={boldActive}
                  type="icon"
                  onClick={() => {
                    setBoldActive(!boldActive)
                    RulesetEditor.toggleBoldMark(editor)
                    ReactEditor.focus(editor)
                  }}
                >
                  <FormatBoldOutlinedIcon fontSize="small" />
                </EditorToolbarButton>
              </Grid>
              <Grid item xs={1}>
                <EditorToolbarButton
                  active={italicsActive}
                  type="icon"
                  onClick={() => {
                    setItalicsActive(!italicsActive)
                    RulesetEditor.toggleItalicMark(editor)
                    ReactEditor.focus(editor)
                  }}
                >
                  <FormatItalicOutlinedIcon fontSize="small" />
                </EditorToolbarButton>
              </Grid>
              <Grid item xs={1}>
                <EditorToolbarButton
                  active={underlineActive}
                  type="icon"
                  onClick={() => {
                    setUnderlineActive(!underlineActive)
                    RulesetEditor.toggleUnderlineMark(editor)
                    ReactEditor.focus(editor)
                  }}
                >
                  <FormatUnderlinedOutlinedIcon fontSize="small" />
                </EditorToolbarButton>
              </Grid>
              <Grid item xs={4}>
                <EditorToolbarButton
                  color="inherit"
                  onClick={props.openArticleRefMenu}
                  startIcon={<ArticleOutlinedIcon />}
                >
                  Reference
                </EditorToolbarButton>
              </Grid>
              <Grid item xs={4}>
                <EditorToolbarButton color="inherit" onClick={props.openKeywordRefMenu} startIcon={<KeyOutlinedIcon />}>
                  Reference
                </EditorToolbarButton>
              </Grid>
            </Grid>
            <Grid item container xs={8}>
              <Grid item>
                <StyleSelectAutocomplete
                  size="small"
                  possibleStyles={['code', 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                  currentStyle={props.currentNodeStyle}
                  onChange={props.handleStyleChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Toolbar>
    </Box>
  )
})

EditorToolbar.propTypes = {
  handleStyleChange: PropTypes.func.isRequired,
  currentNodeStyle: PropTypes.string.isRequired,
  openArticleRefMenu: PropTypes.func.isRequired,
  openKeywordRefMenu: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  saveArticle: PropTypes.func.isRequired,
  elevation: PropTypes.number,
}
export default EditorToolbar
