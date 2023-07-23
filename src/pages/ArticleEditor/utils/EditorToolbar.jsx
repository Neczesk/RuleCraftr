import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import {
  Box,
  Toolbar,
  Paper,
  useTheme,
  Tabs,
  Tab,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  styled,
  Container,
} from '@mui/material';
import StyleSelectAutocomplete from './StyleSelectAutocomplete';
import { PropTypes } from 'prop-types';
import { ReactEditor } from 'slate-react';
import RulesetEditor from '../SlateComponents/RulesetEditor';
import useRulesetStore from '../../../stores/rulesetStore';
import { forwardRef, useContext } from 'react';
import { ColorModeContext } from '../../App';
import SplitButton from '../../utils/SplitButton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import useEditorStore from '../../../stores/editorStore';

const EditorToolbar = forwardRef(function EditorToolBarRoot(props, ref) {
  const synced = useRulesetStore((state) => state.synced);
  const ruleset = useRulesetStore((state) => state.ruleset);
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

  const LonelyIconButton = styled(IconButton)({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    color: `${theme.palette.text.primary}`,
  });

  const IconButtonInGroup = styled(IconButton)({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 0,
    color: `${theme.palette.text.primary}`,
  });

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
          <Container sx={{ margin: 'auto' }}>
            <Grid container sx={{ paddingX: 4, pt: 1 }} spacing={1}>
              <Grid item xs={1}>
                <Tooltip title="Save (Ctrl + S)">
                  <span>
                    <LonelyIconButton disabled={synced || ruleset.id === null} onMouseDown={props.saveArticle}>
                      <SaveOutlinedIcon fontSize="small" />
                    </LonelyIconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid item xs={2}>
                <ToggleButtonGroup
                  color="primary"
                  value={[]}
                  exclusive={false}
                  onChange={(event, format) => {
                    const formatActions = {
                      bold: RulesetEditor.toggleBoldMark,
                      italic: RulesetEditor.toggleItalicMark,
                      underline: RulesetEditor.toggleUnderlineMark,
                    };

                    const action = formatActions[format];

                    if (action) {
                      action(editor);
                      ReactEditor.focus(editor);
                    }
                  }}
                >
                  <Tooltip title="Bold (Ctrl + B)">
                    <ToggleButton size="small" value="bold" aria-label="bold" selected={boldActive}>
                      <FormatBoldOutlinedIcon fontSize="small" />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Italics (Ctrl + I)">
                    <ToggleButton size="small" value="italic" aria-label="italic" selected={italicsActive}>
                      <FormatItalicOutlinedIcon fontSize="small" />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Underline (Ctrl + U)">
                    <ToggleButton size="small" value="underline" aria-label="underline" selected={underlineActive}>
                      <FormatUnderlinedOutlinedIcon fontSize="small" />
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={3}>
                <Tooltip arrow title="Insert Article Reference (Ctrl+L)">
                  <IconButtonInGroup
                    onMouseDown={(event) => {
                      props.openArticleRefMenu(event, editor);
                    }}
                  >
                    <ArticleOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>
                </Tooltip>
                <Tooltip arrow title="Insert Keyword Reference (Ctrl+K)">
                  <IconButtonInGroup
                    onMouseDown={(event) => {
                      props.openKeywordRefMenu(event, editor);
                    }}
                  >
                    <KeyOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>
                </Tooltip>
                <Tooltip arrow title="Insert Table">
                  <IconButtonInGroup
                    onMouseDown={() => {
                      RulesetEditor.insertTable(editor);
                    }}
                  >
                    <WindowOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>
                </Tooltip>
                <Tooltip arrow title="Insert Unordered List (Ctrl+Shift+7)">
                  <IconButtonInGroup
                    onMouseDown={() => {
                      RulesetEditor.insertList(editor, 'unordered');
                    }}
                  >
                    <FormatListBulletedOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>
                </Tooltip>
                <Tooltip arrow title="Insert Ordered List (Ctrl+Shift+8)">
                  <IconButtonInGroup
                    onMouseDown={() => {
                      RulesetEditor.insertList(editor, 'ordered');
                    }}
                  >
                    <FormatListNumberedOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>
                </Tooltip>
              </Grid>
              <Grid item xs={3}>
                <StyleSelectAutocomplete
                  size="small"
                  possibleStyles={['code', 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'list']}
                  currentStyle={currentStyle}
                  onChange={props.handleStyleChange}
                />
              </Grid>
              <Grid item xs={3}>
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
          </Container>
        </Paper>
      </Toolbar>
    </Box>
  );
});

EditorToolbar.propTypes = {
  handleStyleChange: PropTypes.func.isRequired,
  openArticleRefMenu: PropTypes.func.isRequired,
  openKeywordRefMenu: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  saveArticle: PropTypes.func.isRequired,
  elevation: PropTypes.number,
  handleExport: PropTypes.func,
};
export default EditorToolbar;
