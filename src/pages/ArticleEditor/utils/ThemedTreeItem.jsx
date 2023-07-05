import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem'
import { styled } from '@mui/material'
import { PropTypes } from 'prop-types'

// const ThemeTreeItemRoot = styled(TreeItem)(({ theme }) => ({
//   color: theme.palette.text.secondary,
//   [`& .${treeItemClasses.content}`]: {
//     color: theme.palette.text.secondary,
//     fontWeight: theme.typography.fontWeightMedium,
//     '&.Mui-expanded': {
//       fontWeight: theme.typography.fontWeightRegular,
//     },
//     '&:hover': {
//       backgroundColor: theme.palette.action.hover,
//     },
//     '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
//       backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
//       color: 'var(--tree-view-color)',
//     },
//     [`& .${treeItemClasses.label}`]: {
//       fontWeight: 'inherit',
//       color: 'inherit',
//     },
//   },
//   [`& .${treeItemClasses.group}`]: {
//     marginLeft: 0,
//     [`& .${treeItemClasses.content}`]: {
//       paddingLeft: theme.spacing(2),
//     },
//   },
// }))

function ThemedTreeItem(props) {
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
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 0,
      [`& .${treeItemClasses.content}`]: {
        paddingLeft: theme.spacing(2),
      },
    },
  }))
  const { onContextMenu, bgColor, color, articleId, label, ...other } = props

  return (
    <ThemeTreeItemRoot
      onContextMenu={onContextMenu}
      key={articleId ? articleId : -1}
      nodeId={articleId ? articleId : '-1'}
      label={label}
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    >
      {props.children}
    </ThemeTreeItemRoot>
  )
}
ThemedTreeItem.propTypes = {
  label: PropTypes.string,
  onContextMenu: PropTypes.func.isRequired,
  other: PropTypes.array,
  bgColor: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.array,
  articleId: PropTypes.string,
}
export default ThemedTreeItem
