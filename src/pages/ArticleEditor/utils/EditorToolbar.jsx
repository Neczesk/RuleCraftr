import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined'
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined'
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
import { Button, ButtonGroup, Box, Toolbar, Stack, Paper } from '@mui/material'
import StyleSelectAutocomplete from './StyleSelectAutocomplete'
import { PropTypes } from 'prop-types'
import { ReactEditor } from 'slate-react'
import RulesetEditor from './RulesetEditor'
import useRulesetStore from '../../../stores/rulesetStore'

function EditorToolbar(props) {
  const ruleset = useRulesetStore((state) => state.ruleset)
  return (
    <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 99, mb: 0 }}>
      <Toolbar elevation={props.elevation} disableGutters sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', pb: 1, pt: 2 }} elevation={props.elevation}>
          <Stack direction="row">
            <ButtonGroup variant="outlined">
              <Button color="primary" onClick={props.saveArticle} disabled={ruleset?.synced}>
                <SaveOutlinedIcon />
              </Button>
              <Button
                onClick={() => {
                  RulesetEditor.toggleBoldMark(props.editor)
                  ReactEditor.focus(props.editor)
                }}
              >
                <FormatBoldOutlinedIcon />
              </Button>
              <Button
                onClick={() => {
                  RulesetEditor.toggleItalicMark(props.editor)
                  ReactEditor.focus(props.editor)
                }}
              >
                <FormatItalicOutlinedIcon />
              </Button>
              <Button
                onClick={() => {
                  RulesetEditor.toggleUnderlineMark(props.editor)
                  ReactEditor.focus(props.editor)
                }}
              >
                <FormatUnderlinedOutlinedIcon />
              </Button>
              <Button onClick={props.openArticleRefMenu} startIcon={<ArticleOutlinedIcon />}>
                Reference
              </Button>
              <Button onClick={props.openKeywordRefMenu} startIcon={<KeyOutlinedIcon />}>
                Reference
              </Button>
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
}
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
