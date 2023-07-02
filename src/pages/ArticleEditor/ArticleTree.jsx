import PropTypes from 'prop-types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useEffect, useState } from 'react'
import { TreeView, TreeItem } from '@mui/lab'
import useRulesetStore from '../../stores/rulesetStore'
import { Menu, MenuItem, Toolbar } from '@mui/material'
import { findArticleInRuleset, addArticle, removeArticle } from '../../data/rulesets'
import { createArticle } from '../../data/articles'
import SplitButton from '../utils/SplitButton'

function ArticleTree({ onArticleSelect, selectedNode }) {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const setRuleset = useRulesetStore((state) => state.setRuleset)
  const onAddChild = (parentId, sort = 9999) => {
    const parentArticle = findArticleInRuleset(parentId, ruleset.articles)
    const newArticle = createArticle(ruleset.id, parentArticle ? parentArticle.id : null, sort)
    setRuleset(addArticle(parentArticle ? parentArticle.id : null, ruleset, newArticle))
  }
  const onRemoveArticle = (articleId) => {
    setRuleset(removeArticle(articleId, ruleset))
  }

  const renderArticle = (article) => {
    if (!article.deleted) {
      return (
        <TreeItem
          onContextMenu={(event) => {
            event.preventDefault()
            event.stopPropagation()
            handleContextMenuOpen(event, article.id)
          }}
          key={article.id ? article.id : -1}
          nodeId={article.id ? article.id.toString() : '-1'}
          label={article.title + (article.synched ? '' : '*')}
        >
          {article.childrenArticles?.length ? article.childrenArticles.map((article) => renderArticle(article)) : null}
        </TreeItem>
      )
    } else return null
  }

  useEffect(() => {}, [ruleset])
  const [menuAnchorPosition, setMenuAnchorPosition] = useState({
    top: 0,
    left: 0,
  })

  const handleContextMenuOpen = (event, id) => {
    setMenuAnchorPosition({ top: event.clientY, left: event.clientX })
    setMenuAnchor(id)
  }

  const [menuCurrentArticleId, setMenuAnchor] = useState(null)
  const handleContextMenuClose = () => {
    setMenuAnchor(null)
  }

  const functionalities = [
    {
      label: 'Add Child',
      action: () => {
        const article = findArticleInRuleset(selectedNode, ruleset.articles)
        const [lastChild] = article.childrenArticles?.length ? article.childrenArticles.slice(-1) : []
        const newSort = lastChild ? lastChild.sort + 1 : 1
        onAddChild(findArticleInRuleset(selectedNode, ruleset.articles).id, newSort)
        handleContextMenuClose()
      },
    },
    {
      label: 'Add Sibling',
      action: () => {
        const article = findArticleInRuleset(selectedNode, ruleset.articles)
        const newSort = article ? article.sort + 1 : 1
        const parentArticle = findArticleInRuleset(article.parent, ruleset.articles)
        if (parentArticle) {
          if (
            parentArticle.childrenArticles &&
            parentArticle.childrenArticles.some((article) => article.sort >= newSort)
          ) {
            parentArticle.childrenArticles.forEach((article) => {
              if (article.sort >= newSort) article.sort += 1
            })
          }
        }
        onAddChild(article.parent, newSort)
        handleContextMenuClose()
      },
    },
    {
      label: 'Delete Article',
      action: () => {
        onRemoveArticle(selectedNode)
        const newSelection = findArticleInRuleset(selectedNode, ruleset.articles)?.parent
        onArticleSelect(newSelection)
        handleContextMenuClose()
      },
    },
  ]

  return (
    <>
      <Toolbar disableGutters>
        <SplitButton
          mainAction={() => {
            const sortedRoots = ruleset.articles.sort((a, b) => a.sort - b.sort)
            const highestCurrentSort = sortedRoots.length ? sortedRoots[sortedRoots.length - 1].sort : 1
            const newSort = highestCurrentSort + 1
            onAddChild(null, newSort)
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
          onArticleSelect(id)
        }}
        selected={selectedNode}
      >
        {ruleset.articles ? ruleset.articles.map((article) => renderArticle(article)) : null}
      </TreeView>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={menuAnchorPosition}
        open={Boolean(menuCurrentArticleId)}
        onClose={handleContextMenuClose}
      >
        <MenuItem
          onClick={() => {
            const article = findArticleInRuleset(menuCurrentArticleId, ruleset.articles)
            const [lastChild] = article.childrenArticles?.length ? article.childrenArticles.slice(-1) : []
            const newSort = lastChild ? lastChild.sort + 1 : 1
            onAddChild(findArticleInRuleset(menuCurrentArticleId, ruleset.articles).id, newSort)
            handleContextMenuClose()
          }}
        >
          Add Child
        </MenuItem>
        <MenuItem
          // When adding a sibling, sort is equal to the target article + 1. If other articles have this sort
          // or higher, implement them by one. This makes a sibling appear directly after the target in the sort order
          onClick={() => {
            const article = findArticleInRuleset(menuCurrentArticleId, ruleset.articles)
            const newSort = article ? article.sort + 1 : 1
            const parentArticle = findArticleInRuleset(article.parent, ruleset.articles)
            if (parentArticle) {
              if (
                parentArticle.childrenArticles &&
                parentArticle.childrenArticles.some((article) => article.sort >= newSort)
              ) {
                parentArticle.childrenArticles.forEach((article) => {
                  if (article.sort >= newSort) article.sort += 1
                })
              }
            }
            onAddChild(article.parent, newSort)
            handleContextMenuClose()
          }}
        >
          Add Sibling
        </MenuItem>
        <MenuItem
          onClick={() => {
            onRemoveArticle(menuCurrentArticleId)
            const newSelection = findArticleInRuleset(menuCurrentArticleId, ruleset.articles)?.parent
            onArticleSelect(newSelection)
            handleContextMenuClose()
          }}
        >
          Delete Article
        </MenuItem>
      </Menu>
    </>
  )
}
ArticleTree.propTypes = {
  onArticleSelect: PropTypes.func,
  selectedNode: PropTypes.array,
}

export default ArticleTree
