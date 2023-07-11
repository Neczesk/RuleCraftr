import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { Box, Toolbar, Paper, useTheme, Tabs, Tab, Grid } from '@mui/material';
import StyleSelectAutocomplete from './StyleSelectAutocomplete';
import { PropTypes } from 'prop-types';
import { ReactEditor } from 'slate-react';
import RulesetEditor from '../SlateComponents/RulesetEditor';
import useRulesetStore from '../../../stores/rulesetStore';
import { forwardRef, useContext } from 'react';
import EditorToolbarButton from './EditorToolbarButton';
import { ColorModeContext } from '../../App';
import SplitButton from '../../utils/SplitButton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import useEditorStore from '../../../stores/editorStore';

const EditorToolbar = forwardRef(function EditorToolBarRoot(props, ref) {
  const synced = useRulesetStore((state) => state.synced);
  const theme = useTheme();
  const { editor } = props;

  const { italicsActive, boldActive, underlineActive, currentStyle } = useEditorStore();

  const colorModeContext = useContext(ColorModeContext);
  const exportFunctionalities = [
    {
      label: 'Export Ruleset',
      action: () => handleExport('ruleset'),
      icon: <FileDownloadIcon />,
    },
  ];

  const handleExport = (type) => {
    props.handleExport(type);
  };

  return (
    <Box ref={ref} sx={{ backgroundColor: 'white', zIndex: 99, mb: 0 }}>
      <Toolbar elevation={props.elevation} disableGutters sx={{ width: '100%' }}>
        <Paper
          sx={{
            borderRadius: 0,
            width: '100%',
            padding: 1.5,
            backgroundColor:
              colorModeContext.colorMode === 'dark'
                ? theme.palette.primaryContainer.light
                : theme.palette.primaryContainer.dark,
          }}
          elevation={props.elevation}
        >
          <Tabs value={0} sx={{ padding: 0, margin: 0, minHeight: 0 }}>
            <Tab id={0} label="Home" sx={{ minHeight: 0, paddingY: 0 }}></Tab>
          </Tabs>
          <Grid container sx={{ paddingX: 4, pt: 1 }} spacing={1}>
            <Grid item container xs={4}>
              <Grid item xs={1}>
                <EditorToolbarButton type="icon" onClick={props.saveArticle} disabled={synced}>
                  <SaveOutlinedIcon fontSize="small" />
                </EditorToolbarButton>
              </Grid>
              <Grid item xs={1}>
                <EditorToolbarButton
                  active={boldActive}
                  type="icon"
                  onClick={() => {
                    RulesetEditor.toggleBoldMark(editor);
                    ReactEditor.focus(editor);
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
                    RulesetEditor.toggleItalicMark(editor);
                    ReactEditor.focus(editor);
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
                    RulesetEditor.toggleUnderlineMark(editor);
                    ReactEditor.focus(editor);
                  }}
                >
                  <FormatUnderlinedOutlinedIcon fontSize="small" />
                </EditorToolbarButton>
              </Grid>
              <Grid item xs={4}>
                <EditorToolbarButton
                  color="inherit"
                  onClick={(event) => props.openArticleRefMenu(event, editor)}
                  startIcon={<ArticleOutlinedIcon />}
                >
                  Reference
                </EditorToolbarButton>
              </Grid>
              <Grid item xs={4}>
                <EditorToolbarButton
                  color="inherit"
                  onClick={(event) => props.openKeywordRefMenu(event, editor)}
                  startIcon={<KeyOutlinedIcon />}
                >
                  Reference
                </EditorToolbarButton>
              </Grid>
            </Grid>
            <Grid item container xs={8} spacing={2}>
              <Grid item>
                <StyleSelectAutocomplete
                  size="small"
                  possibleStyles={['code', 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                  currentStyle={currentStyle}
                  onChange={props.handleStyleChange}
                />
              </Grid>
              <Grid item>
                <SplitButton
                  mainAction={() => {
                    handleExport('article');
                  }}
                  mainActionLabel="Export Article"
                  functionalities={exportFunctionalities}
                  color="inherit"
                  variant="text"
                  icon={<FileDownloadIcon />}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Toolbar>
    </Box>
  );
});

EditorToolbar.propTypes = {
  handleStyleChange: PropTypes.func.isRequired,
  currentNodeStyle: PropTypes.string.isRequired,
  openArticleRefMenu: PropTypes.func.isRequired,
  openKeywordRefMenu: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  saveArticle: PropTypes.func.isRequired,
  elevation: PropTypes.number,
  handleExport: PropTypes.func,
};
export default EditorToolbar;
