import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
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
  ButtonGroup,
  IconButton,
  Tooltip,
  styled,
} from '@mui/material';
import StyleSelectAutocomplete from './StyleSelectAutocomplete';
import { PropTypes } from 'prop-types';
import { ReactEditor } from 'slate-react';
import RulesetEditor from '../SlateComponents/RulesetEditor';
import useRulesetStore from '../../../stores/rulesetStore';
import { forwardRef, useContext, useState } from 'react';
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

  const [showRefTooltip, setShowRefTooltip] = useState(false);

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
            <Grid item xs />
            <Grid item xs={1}>
              <Tooltip title="Save (Ctrl + S)">
                <span>
                  <LonelyIconButton disabled={synced || ruleset.id === null} onClick={props.saveArticle}>
                    <SaveOutlinedIcon fontSize="small" />
                  </LonelyIconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
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
            <Grid item xs={2}>
              <Tooltip
                open={showRefTooltip}
                disableHoverListener
                onMouseEnter={() => setShowRefTooltip(true)}
                onMouseLeave={() => setShowRefTooltip(false)}
                title="Insert Article Reference (Ctrl + L) or Keyword Reference (Ctrl + K) or Table (Ctrl + T)"
              >
                <ButtonGroup sx={{ border: `1px solid ${theme.palette.divider}` }}>
                  <IconButtonInGroup
                    onMouseDown={(event) => {
                      setShowRefTooltip(false);
                      props.openArticleRefMenu(event, editor);
                    }}
                  >
                    <ArticleOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>

                  <IconButtonInGroup
                    onMouseDown={(event) => {
                      setShowRefTooltip(false);
                      props.openKeywordRefMenu(event, editor);
                    }}
                  >
                    <KeyOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>
                  <IconButtonInGroup
                    onMouseDown={() => {
                      RulesetEditor.insertTable(editor);
                    }}
                  >
                    <TableChartOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>
                  <IconButtonInGroup>
                    <FormatListBulletedOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>
                  <IconButtonInGroup>
                    <FormatListNumberedOutlinedIcon fontSize="small" />
                  </IconButtonInGroup>
                </ButtonGroup>
              </Tooltip>
            </Grid>
            <Grid item xs={2}>
              <StyleSelectAutocomplete
                size="small"
                possibleStyles={['code', 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                currentStyle={currentStyle}
                onChange={props.handleStyleChange}
              />
            </Grid>
            <Grid item xs={2}>
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
            <Grid item xs />
          </Grid>
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
