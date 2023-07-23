import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import { alpha, styled, useTheme } from '@mui/material';
import { PropTypes } from 'prop-types';
import { Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import OpenInNewOffIcon from '@mui/icons-material/OpenInNewOff';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import GradeIcon from '@mui/icons-material/Grade';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { getAncestry } from '../../../data/rulesets';
import useRulesetStore from '../../../stores/rulesetStore';

function ThemedTreeItem(props) {
  function getIcon(iconName) {
    switch (iconName) {
      case 'question':
        return <QuestionMarkIcon fontSize="1em" sx={{ ml: 1 }} />;
      case 'important':
        return <GradeIcon sx={{ ml: 1 }} fontSize="1em" />;
      case 'note':
        return <StickyNote2Icon sx={{ ml: 1 }} fontSize="1em" />;
      case null:
        return null;
      case undefined:
        return null;
      default:
        return <FmdBadIcon fontSize="1em" sx={{ color: theme.palette.error.main, ml: 1 }} />;
    }
  }
  const ThemeTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
      color: theme.palette.text.secondary,
      fontWeight: theme.typography.fontWeightMedium,
      '--tree-view-color': props.color,
      '&.Mui-expanded': {
        fontWeight: theme.typography.fontWeightRegular,
      },
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
        backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
        color: 'var(--tree-view-color)',
      },
      [`& .${treeItemClasses.label}`]: {
        fontWeight: 'inherit',
        color: 'inherit',
      },
    },
  }));
  const { onContextMenu, bgColor, color, article, ...other } = props;
  const ruleset = useRulesetStore((state) => state.ruleset);
  const ancestry = article ? getAncestry(article.id, ruleset.articles) : undefined;
  const anyNonExport = ancestry ? ancestry.some((ancestor) => ancestor.no_export) : undefined;
  const theme = useTheme();
  return (
    <ThemeTreeItemRoot
      onContextMenu={onContextMenu}
      key={article?.id ? article.id : 'Null Article'}
      nodeId={article?.id ? article.id : 'Null Article'}
      collapseIcon={article?.is_folder ? <FolderOpenIcon /> : undefined}
      expandIcon={article?.is_folder ? <FolderIcon /> : undefined}
      label={
        article ? (
          <Box display="flex" flexDirection="row">
            {article.no_export ? (
              <OpenInNewOffIcon
                sx={{
                  color: anyNonExport ? alpha(theme.palette.primary.main, 0.4) : theme.palette.primary.main,
                  marginRight: 1,
                }}
                fontSize="1em"
              />
            ) : (
              <OpenInNewIcon
                sx={{
                  color: anyNonExport ? alpha(theme.palette.primary.main, 0.4) : theme.palette.primary.main,
                  marginRight: 1,
                }}
                fontSize="1em"
              />
            )}
            {article.title?.trim().length ? article.title : 'Untitled Article'}
            {article.icon_name ? getIcon(article.icon_name) : <Box width="1em" height="1em" />}
          </Box>
        ) : (
          'Top Level'
        )
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    >
      {props.children}
    </ThemeTreeItemRoot>
  );
}
ThemedTreeItem.propTypes = {
  onContextMenu: PropTypes.func,
  other: PropTypes.array,
  bgColor: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.array,
  article: PropTypes.object,
};
export default ThemedTreeItem;
