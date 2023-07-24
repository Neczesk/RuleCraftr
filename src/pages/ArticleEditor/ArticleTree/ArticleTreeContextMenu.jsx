import { PropTypes } from 'prop-types';
import { Box, Menu, MenuItem, MenuList } from '@mui/material';
import { findArticleInRuleset } from '../../../data/rulesets';
import useRulesetStore from '../../../stores/rulesetStore';
import { changeSort, createArticle } from '../../../data/articles';
import _ from 'lodash';
import { useRef, useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
function ArticleTreeContextMenu(props) {
  const {
    menuAnchorPosition,
    menuCurrentArticleId,
    onClose,
    setReparentDialogAnchor,
    setDuplicateDialogAnchor,
    setMetadataDialogAnchor,
    onRemoveArticle,
    onArticleSelect,
  } = props;
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setSingleArticle = useRulesetStore((state) => state.setSingleArticle);
  const addArticle = useRulesetStore((state) => state.addArticle);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addItemRef = useRef(null);
  const [articleActionsMenuOpen, setArticleActionsMenuOpen] = useState(false);
  const actionsItemRef = useRef(null);
  const [articleSettingsMenuOpen, setArticleSettingsMenuOpen] = useState(false);
  const settingsItemRef = useRef(null);
  return (
    <>
      <Menu
        open={addMenuOpen}
        onClose={() => {
          setAddMenuOpen(false);
        }}
        anchorEl={addItemRef.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuList dense>
          <MenuItem
            onClick={() => {
              const article = findArticleInRuleset(menuCurrentArticleId, ruleset.articles);
              const [lastChild] = article.childrenArticles?.length ? article.childrenArticles.slice(-1) : [];
              const newSort = lastChild ? lastChild.sort + 1 : 1;
              const newArticle = createArticle(ruleset.id, article.id, newSort);
              addArticle(newArticle);
              onClose();
            }}
          >
            Add Child Article
          </MenuItem>
          <MenuItem // When adding a sibling, sort is equal to the target article + 1. If other articles have this sort
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
              const newArticle = createArticle(ruleset.id, parentArticle?.id ? parentArticle.id : null, newSort);
              addArticle(newArticle);
              onClose();
            }}
          >
            Add Sibling Article
          </MenuItem>
          <MenuItem
            onClick={() => {
              const article = findArticleInRuleset(menuCurrentArticleId, ruleset.articles);
              const [lastChild] = article.childrenArticles?.length ? article.childrenArticles.slice(-1) : [];
              const newSort = lastChild ? lastChild.sort + 1 : 1;
              const newArticle = createArticle(ruleset.id, article.id, newSort);
              newArticle.is_folder = true;
              addArticle(newArticle);
            }}
          >
            Add Child Folder
          </MenuItem>
          <MenuItem
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
              const newArticle = createArticle(ruleset.id, parentArticle?.id ? parentArticle.id : null, newSort);
              newArticle.is_folder = true;
              addArticle(newArticle);
              onClose();
            }}
          >
            Add Sibling Folder
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={articleActionsMenuOpen}
        anchorEl={actionsItemRef.current}
        onClose={() => {
          setArticleActionsMenuOpen(false);
        }}
      >
        <MenuList dense>
          <MenuItem
            onClick={() => {
              setReparentDialogAnchor(menuCurrentArticleId);
              onClose();
              setArticleActionsMenuOpen(false);
            }}
          >
            Move Article (Reparent)
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDuplicateDialogAnchor(menuCurrentArticleId);
              onClose();
              setArticleActionsMenuOpen(false);
            }}
          >
            Duplicate Article (Use as template)
          </MenuItem>
          <MenuItem
            onClick={() => {
              const movingArticle = findArticleInRuleset(menuCurrentArticleId, ruleset.articles);
              if (movingArticle) {
                const parentArticle = findArticleInRuleset(movingArticle.parent, ruleset.articles);
                const articlesToSort = parentArticle ? _.cloneDeep(parentArticle.childrenArticles) : null;
                const sortedArticles = changeSort(
                  parentArticle ? articlesToSort : ruleset.articles,
                  movingArticle.id,
                  'up'
                );
                if (!sortedArticles) return;
                const movingIndex = sortedArticles.findIndex((article) => article.id === menuCurrentArticleId);
                const movedArticle = sortedArticles[movingIndex];
                const swappedArticle = sortedArticles[movingIndex + 1];
                setSingleArticle(movedArticle.id, movedArticle);
                setSingleArticle(swappedArticle.id, swappedArticle);
              }
              onClose();
              setArticleActionsMenuOpen(false);
            }}
          >
            Move Up in Current Container
          </MenuItem>
          <MenuItem
            onClick={() => {
              const movingArticle = findArticleInRuleset(menuCurrentArticleId, ruleset.articles);
              if (movingArticle) {
                const parentArticle = findArticleInRuleset(movingArticle.parent, ruleset.articles);
                const articlesToSort = parentArticle ? _.cloneDeep(parentArticle.childrenArticles) : null;
                const sortedArticles = changeSort(
                  parentArticle ? articlesToSort : ruleset.articles,
                  movingArticle.id,
                  'down'
                );
                if (!sortedArticles) return;
                const movingIndex = sortedArticles.findIndex((article) => article.id === menuCurrentArticleId);
                const movedArticle = sortedArticles[movingIndex];
                const swappedArticle = sortedArticles[movingIndex - 1];
                setSingleArticle(movedArticle.id, movedArticle);
                setSingleArticle(swappedArticle.id, swappedArticle);
              }
              onClose();
              setArticleActionsMenuOpen(false);
            }}
          >
            Move Down in Current Container
          </MenuItem>
          <MenuItem
            onClick={() => {
              onRemoveArticle(menuCurrentArticleId);
              const newSelection = findArticleInRuleset(menuCurrentArticleId, ruleset.articles)?.parent;
              onArticleSelect(newSelection);
              onClose();
              setArticleActionsMenuOpen(false);
            }}
          >
            Delete Article
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={articleSettingsMenuOpen}
        onClose={() => {
          setArticleSettingsMenuOpen(false);
        }}
        anchorEl={settingsItemRef.current}
      >
        <MenuList dense>
          <MenuItem
            onClick={() => {
              const article = findArticleInRuleset(menuCurrentArticleId, ruleset.articles);
              if (article) {
                article.no_export = !article.no_export;
                setSingleArticle(menuCurrentArticleId, article);
              }
              onClose();
              setArticleSettingsMenuOpen(false);
            }}
          >
            Toggle Export
          </MenuItem>
          <MenuItem
            onClick={() => {
              const article = findArticleInRuleset(menuCurrentArticleId, ruleset.articles);
              if (article) {
                article.is_folder = !article.is_folder;
                setSingleArticle(menuCurrentArticleId, article);
              }
              onClose();
              setArticleSettingsMenuOpen(false);
            }}
          >
            Toggle Folder
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMetadataDialogAnchor(menuCurrentArticleId);
              onClose();
              setArticleSettingsMenuOpen(false);
            }}
          >
            Edit Article Settings
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={menuAnchorPosition}
        open={Boolean(menuCurrentArticleId)}
        onClose={onClose}
      >
        <MenuItem
          ref={addItemRef}
          onMouseUp={() => {
            setAddMenuOpen(!addMenuOpen);
            setArticleActionsMenuOpen(false);
            setArticleSettingsMenuOpen(false);
          }}
        >
          <Box display="flex" flexDirection="row" width="100%">
            Add
            <Box marginLeft="auto">
              <ChevronRightIcon fontSize="small" />
            </Box>
          </Box>
        </MenuItem>
        <MenuItem ref={actionsItemRef} onClick={() => setArticleActionsMenuOpen(true)}>
          <Box display="flex" flexDirection="row" width="100%">
            Article Actions
            <Box marginLeft="auto">
              <ChevronRightIcon fontSize="small" />
            </Box>
          </Box>
        </MenuItem>
        <MenuItem ref={settingsItemRef} onClick={() => setArticleSettingsMenuOpen(true)}>
          <Box display="flex" flexDirection="row" width="100%">
            Article Settings
            <Box marginLeft="auto">
              <ChevronRightIcon fontSize="small" />
            </Box>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
}
ArticleTreeContextMenu.propTypes = {
  menuAnchorPosition: PropTypes.object,
  menuCurrentArticleId: PropTypes.string,
  onClose: PropTypes.func,
  onAddChild: PropTypes.func,
  setReparentDialogAnchor: PropTypes.func,
  setDuplicateDialogAnchor: PropTypes.func,
  setMetadataDialogAnchor: PropTypes.func,
  onRemoveArticle: PropTypes.func,
  onArticleSelect: PropTypes.func,
};
export default ArticleTreeContextMenu;
