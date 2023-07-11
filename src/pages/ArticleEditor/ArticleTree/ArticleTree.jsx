import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useContext, useEffect, useState } from 'react';
import { TreeView } from '@mui/lab';
import useRulesetStore from '../../../stores/rulesetStore';
import { Menu, MenuItem, Paper, Toolbar, useTheme } from '@mui/material';
import { findArticleInRuleset, addArticle, removeArticle } from '../../../data/rulesets';
import { createArticle } from '../../../data/articles';
import SplitButton from '../../utils/SplitButton';
import ThemedTreeItem from '../utils/ThemedTreeItem';
import { ColorModeContext } from '../../App';

function ArticleTree({ onArticleSelect, selectedNode, elevation, sx }) {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setRuleset = useRulesetStore((state) => state.setRuleset);
  const onAddChild = (parentId, sort = 9999) => {
    const parentArticle = findArticleInRuleset(parentId, ruleset.articles);
    const newArticle = createArticle(ruleset.id, parentArticle ? parentArticle.id : null, sort);
    setRuleset(addArticle(parentArticle ? parentArticle.id : null, ruleset, newArticle));
    onArticleSelect(newArticle.id);
  };
  const onRemoveArticle = (articleId) => {
    setRuleset(removeArticle(articleId, ruleset));
  };

  const theme = useTheme();
  const colorModeContext = useContext(ColorModeContext);

  const renderArticle = (article) => {
    if (!article.deleted) {
      return (
        <ThemedTreeItem
          key={article?.id}
          color={colorModeContext.colorMode === 'dark' ? theme.palette.common.white : theme.palette.common.black}
          bgColor={
            colorModeContext.colorMode === 'dark'
              ? theme.palette.primaryContainer.light
              : theme.palette.primaryContainer.dark
          }
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleContextMenuOpen(event, article.id);
          }}
          articleId={article?.id}
          label={article.title + (article.synched ? '' : '*')}
        >
          {article.childrenArticles?.length && !article.childrenArticles.every((article) => article.deleted)
            ? article.childrenArticles.map((article) => renderArticle(article))
            : null}
        </ThemedTreeItem>
      );
    } else return null;
  };

  useEffect(() => {}, [ruleset]);
  const [menuAnchorPosition, setMenuAnchorPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleContextMenuOpen = (event, id) => {
    setMenuAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuAnchor(id);
  };

  const [menuCurrentArticleId, setMenuAnchor] = useState(null);
  const handleContextMenuClose = () => {
    setMenuAnchor(null);
  };

  const functionalities = [
    {
      label: 'Add Child',
      action: () => {
        const article = findArticleInRuleset(selectedNode, ruleset.articles);
        const [lastChild] = article.childrenArticles?.length ? article.childrenArticles.slice(-1) : [];
        const newSort = lastChild ? lastChild.sort + 1 : 1;
        onAddChild(findArticleInRuleset(selectedNode, ruleset.articles).id, newSort);
        handleContextMenuClose();
      },
    },
    {
      label: 'Add Sibling',
      action: () => {
        const article = findArticleInRuleset(selectedNode, ruleset.articles);
        const newSort = article ? article.sort + 1 : 1;
        const parentArticle = findArticleInRuleset(article.parent, ruleset.articles);
        if (parentArticle) {
          if (
            parentArticle.childrenArticles &&
            parentArticle.childrenArticles.some((article) => article.sort >= newSort)
          ) {
            parentArticle.childrenArticles.forEach((article) => {
              if (article.sort >= newSort) article.sort += 1;
            });
          }
        }
        onAddChild(article.parent, newSort);
        handleContextMenuClose();
      },
    },
    {
      label: 'Delete Article',
      action: () => {
        onRemoveArticle(selectedNode);
        if (ruleset) {
          const newSelection = findArticleInRuleset(selectedNode, ruleset.articles)?.parent;
          onArticleSelect(newSelection);
          handleContextMenuClose();
        }
      },
    },
  ];

  return (
    <>
      <Paper
        sx={{
          ...sx,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          padding: 1,
          pt: 0,
          margin: 0,
          height: '100%',
          backgroundColor: theme.palette.primaryContainer.main,
        }}
        elevation={elevation}
      >
        <Toolbar disableGutters variant="dense" sx={{ pb: 1 }}>
          <SplitButton
            color="secondary"
            mainAction={() => {
              const sortedRoots = ruleset.articles.sort((a, b) => a.sort - b.sort);
              const highestCurrentSort = sortedRoots.length ? sortedRoots[sortedRoots.length - 1].sort : 1;
              const newSort = highestCurrentSort + 1;
              onAddChild(null, newSort);
            }}
            mainActionLabel="Add Root Article"
            functionalities={functionalities}
          />
        </Toolbar>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={['root']}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ overflow: 'auto' }}
          onNodeSelect={(event, id) => {
            onArticleSelect(id);
          }}
          selected={selectedNode}
        >
          {ruleset.articles
            ? ruleset.articles.sort((a, b) => a.sort - b.sort).map((article) => renderArticle(article))
            : null}
        </TreeView>
      </Paper>

      <Menu
        anchorReference="anchorPosition"
        anchorPosition={menuAnchorPosition}
        open={Boolean(menuCurrentArticleId)}
        onClose={handleContextMenuClose}
      >
        <MenuItem
          onClick={() => {
            const article = findArticleInRuleset(menuCurrentArticleId, ruleset.articles);
            const [lastChild] = article.childrenArticles?.length ? article.childrenArticles.slice(-1) : [];
            const newSort = lastChild ? lastChild.sort + 1 : 1;
            onAddChild(findArticleInRuleset(menuCurrentArticleId, ruleset.articles).id, newSort);
            handleContextMenuClose();
          }}
        >
          Add Child
        </MenuItem>
        <MenuItem
          // When adding a sibling, sort is equal to the target article + 1. If other articles have this sort
          // or higher, implement them by one. This makes a sibling appear directly after the target in the sort order
          onClick={() => {
            const article = findArticleInRuleset(menuCurrentArticleId, ruleset.articles);
            const newSort = article ? article.sort + 1 : 1;
            const parentArticle = findArticleInRuleset(article.parent, ruleset.articles);
            if (parentArticle) {
              if (
                parentArticle.childrenArticles &&
                parentArticle.childrenArticles.some((article) => article.sort >= newSort)
              ) {
                parentArticle.childrenArticles.forEach((article) => {
                  if (article.sort >= newSort) article.sort += 1;
                });
              }
            }
            onAddChild(article.parent, newSort);
            handleContextMenuClose();
          }}
        >
          Add Sibling
        </MenuItem>
        <MenuItem
          onClick={() => {
            onRemoveArticle(menuCurrentArticleId);
            const newSelection = findArticleInRuleset(menuCurrentArticleId, ruleset.articles)?.parent;
            onArticleSelect(newSelection);
            handleContextMenuClose();
          }}
        >
          Delete Article
        </MenuItem>
      </Menu>
    </>
  );
}
ArticleTree.propTypes = {
  onArticleSelect: PropTypes.func,
  selectedNode: PropTypes.array,
  elevation: PropTypes.number,
  sx: PropTypes.object,
};

export default ArticleTree;
