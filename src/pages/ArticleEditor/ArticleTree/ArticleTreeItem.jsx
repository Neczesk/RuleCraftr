import { TreeItem, useTreeItem } from '@mui/lab';
import { forwardRef } from 'react';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';

const ArticleTreeItemContent = forwardRef(function ArticleTreeItemContent(props, ref) {
  const { article, nodeId, classes, className } = props;

  const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } =
    useTreeItem(nodeId);

  const handleItemMouseDown = () => {
    preventSelection();
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };
  const { title, is_folder, no_export, icon_name } = article;
  const expansionIcon = is_folder ? (
    expanded ? (
      <FolderOpenIcon />
    ) : (
      <FolderIcon />
    )
  ) : expanded ? (
    <ExpandMoreIcon />
  ) : (
    <ChevronRightIcon />
  );

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
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {expansionIcon}
      </div>
      <div>
        <Typography component="div" onClick={handleSelectionClick} className={classes.label}>
          {title}
        </Typography>
      </div>
    </div>
  );
});
ArticleTreeItemContent.propTypes = {
  article: PropTypes.object,
  nodeId: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
};
function ArticleTreeItem(props) {
  return <TreeItem ContentComponent={ArticleTreeItemContent} {...props} />;
}
export default ArticleTreeItem;
