import { TreeItem, useTreeItem } from '@mui/lab';
import { forwardRef } from 'react';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';
import OpenInNewOffIcon from '@mui/icons-material/OpenInNewOff';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import GradeIcon from '@mui/icons-material/Grade';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Typography, useTheme } from '@mui/material';

const ArticleTreeItemContent = forwardRef(function ArticleTreeItemContent(props, ref) {
  const { article, nodeId, classes, className, hasChildren, onContextMenu } = props;
  const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } =
    useTreeItem(nodeId);
  const theme = useTheme();
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

  const handleItemMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
    event.stopPropagation();
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };
  const { title, is_folder, no_export, icon_name, synched } = article;
  const expansionIcon = is_folder ? (
    expanded ? (
      <IconButton size="small">
        <FolderOpenIcon />
      </IconButton>
    ) : (
      <IconButton size="small">
        <FolderIcon />
      </IconButton>
    )
  ) : hasChildren ? (
    expanded ? (
      <IconButton size="small">
        <ExpandMoreIcon />
      </IconButton>
    ) : (
      <IconButton size="small">
        <ChevronRightIcon />
      </IconButton>
    )
  ) : (
    <Box height="1em" width="1em" />
  );

  const articleIcon = icon_name ? getIcon(icon_name) : null;
  const exportOffIcon = no_export ? <OpenInNewOffIcon fontSize="1em" sx={{ ml: 1 }} /> : null;

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleItemMouseDown}
      ref={ref}
      onContextMenu={(event) => {
        event.stopPropagation();
        onContextMenu(event, article.id);
      }}
      onClick={handleSelectionClick}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {expansionIcon}
      </div>
      <div>
        <Typography component="div" className={classes.label}>
          {title.toString() + (synched ? '' : '*')}
        </Typography>
      </div>
      <div>{articleIcon}</div>
      <div>{exportOffIcon}</div>
    </div>
  );
});
ArticleTreeItemContent.propTypes = {
  article: PropTypes.object,
  nodeId: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  hasChildren: PropTypes.bool,
  onContextMenu: PropTypes.func,
};
function ArticleTreeItem(props) {
  const { article, children, onContextMenu } = props;
  const hasChildren = Boolean(children);
  return (
    <TreeItem
      ContentComponent={ArticleTreeItemContent}
      ContentProps={{ article, hasChildren, onContextMenu }}
      {...props}
    />
  );
}
ArticleTreeItem.propTypes = {
  article: PropTypes.object,
  children: PropTypes.array,
  onContextMenu: PropTypes.func,
};
export default ArticleTreeItem;
