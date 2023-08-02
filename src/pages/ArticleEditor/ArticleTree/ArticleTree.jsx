import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from 'react';
import { TreeView } from '@mui/lab';
import useRulesetStore from '../../../stores/rulesetStore';
import { Paper, Toolbar, useTheme } from '@mui/material';
import { findArticleInRuleset, removeArticle } from '../../../data/rulesets';
import { createArticle } from '../../../data/articles';
import SplitButton from '../../utils/SplitButton';
import ArticleMetadataDialog from './ArticleMetadataDialog';
import ReparentDialog from './ReparentDialog';
import DuplicateDialog from './DuplicateDialog';
import ArticleTreeItem from './ArticleTreeItem';
import ArticleTreeContextMenu from './ArticleTreeContextMenu';

function ArticleTree({ onArticleSelect, selectedNode, elevation, sx }) {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setRuleset = useRulesetStore((state) => state.setRuleset);
  const addArticle = useRulesetStore((state) => state.addArticle);
  const onRemoveArticle = (articleId) => {
    setRuleset(removeArticle(articleId, ruleset));
  };

  const theme = useTheme();

  const renderArticle = (article) => {
    if (!article.deleted) {
      return (
        <ArticleTreeItem article={article} nodeId={article.id} key={article.id} onContextMenu={handleContextMenuOpen}>
          {article.childrenArticles?.length && !article.childrenArticles.every((article) => article.deleted)
            ? article.childrenArticles.map((article) => renderArticle(article))
            : null}
        </ArticleTreeItem>
      );
    } else return null;
  };

  useEffect(() => {}, [ruleset]);
  const [menuAnchorPosition, setMenuAnchorPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleContextMenuOpen = (event, id) => {
    event.preventDefault();
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
        const newArticle = createArticle(ruleset.id, article.id, newSort);
        addArticle(newArticle);
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
        const newArticle = createArticle(ruleset.id, parentArticle?.id ? parentArticle.id : null, newSort);
        addArticle(newArticle);
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

  const [metadataDialogAnchor, setMetadataDialogAnchor] = useState(null);
  const [reparentDialogAnchor, setReparentDialogAnchor] = useState(null);
  const [duplicateDialogAnchor, setDuplicateDialogAnchor] = useState(null);
  return (
    <>
      <ArticleTreeContextMenu
        menuAnchorPosition={menuAnchorPosition}
        menuCurrentArticleId={menuCurrentArticleId}
        onClose={handleContextMenuClose}
        setReparentDialogAnchor={setReparentDialogAnchor}
        setDuplicateDialogAnchor={setDuplicateDialogAnchor}
        setMetadataDialogAnchor={setMetadataDialogAnchor}
        onRemoveArticle={onRemoveArticle}
        onArticleSelect={onArticleSelect}
      />
      <DuplicateDialog
        anchorId={duplicateDialogAnchor}
        onClose={() => setDuplicateDialogAnchor(null)}
      ></DuplicateDialog>
      <ReparentDialog anchorId={reparentDialogAnchor} onClose={() => setReparentDialogAnchor(null)}></ReparentDialog>
      <ArticleMetadataDialog
        metadataDialogAnchor={metadataDialogAnchor}
        onClose={() => setMetadataDialogAnchor(null)}
      ></ArticleMetadataDialog>
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
              const newArticle = createArticle(ruleset.id, null, newSort);
              addArticle(newArticle);
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
            const article = findArticleInRuleset(id, ruleset.articles);
            if (!article.is_folder) onArticleSelect(id);
          }}
          selected={selectedNode}
        >
          {ruleset.articles
            ? ruleset.articles.sort((a, b) => a.sort - b.sort).map((article) => renderArticle(article))
            : null}
        </TreeView>
      </Paper>
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
