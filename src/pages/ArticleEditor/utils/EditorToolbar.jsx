import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined'
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined'
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
import { EditorToolbarButton, ButtonGroup, Box, Toolbar, Stack, Paper, useTheme } from '@mui/material'
import StyleSelectAutocomplete from './StyleSelectAutocomplete'
import { PropTypes } from 'prop-types'
import { ReactEditor } from 'slate-react'
import RulesetEditor from './RulesetEditor'
import useRulesetStore from '../../../stores/rulesetStore'
import { forwardRef } from 'react'

const EditorToolbar = forwardRef(function EditorToolBarRoot(props, ref) {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const theme = useTheme()
  return (
    <Box ref={ref} sx={{ backgroundColor: 'white', zIndex: 99, mb: 0 }}>
      <Toolbar elevation={props.elevation} disableGutters sx={{ width: '100%' }}>
        <Paper
          sx={{ width: '100%', padding: 1.5, backgroundColor: theme.palette.primaryContainer.main }}
          elevation={props.elevation}
        >
          <Stack direction="row">
            <ButtonGroup variant="outlined">
              <EditorToolbarButton onClick={props.saveArticle} disabled={ruleset?.synced}>
                <SaveOutlinedIcon />
              </EditorToolbarButton>
              <EditorToolbarButton
                size="small"
                onClick={() => {
                  RulesetEditor.toggleBoldMark(props.editor)
                  ReactEditor.focus(props.editor)
                }}
              >
                <FormatBoldOutlinedIcon />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => {
                  RulesetEditor.toggleItalicMark(props.editor)
                  ReactEditor.focus(props.editor)
                }}
              >
                <FormatItalicOutlinedIcon />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => {
                  RulesetEditor.toggleUnderlineMark(props.editor)
                  ReactEditor.focus(props.editor)
                }}
              >
                <FormatUnderlinedOutlinedIcon />
              </EditorToolbarButton>
              <EditorToolbarButton onClick={props.openArticleRefMenu} startIcon={<ArticleOutlinedIcon />}>
                Reference
              </EditorToolbarButton>
              <EditorToolbarButton onClick={props.openKeywordRefMenu} startIcon={<KeyOutlinedIcon />}>
                Reference
              </EditorToolbarButton>
            </ButtonGroup>
            <StyleSelectAutocomplete
              possibleStyles={['code', 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
              currentStyle={props.currentNodeStyle}
              onChange={props.handleStyleChange}
            />
          </Stack>
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
