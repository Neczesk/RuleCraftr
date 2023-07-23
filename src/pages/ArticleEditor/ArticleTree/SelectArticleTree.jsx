import { TreeView } from '@mui/lab';
import { PropTypes } from 'prop-types';
import useRulesetStore from '../../../stores/rulesetStore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ColorModeContext } from '../../App';
import { useContext } from 'react';
import { useTheme } from '@mui/material';
import ThemedTreeItem from '../utils/ThemedTreeItem';

function SelectArticleTree(props) {
  const { currentArticleId, onChange } = props;
  const ruleset = useRulesetStore((state) => state.ruleset);
  const theme = useTheme();
  const colorModeContext = useContext(ColorModeContext);

  const renderArticle = (article, currentId) => {
    if (!article.deleted) {
      return (
        <ThemedTreeItem
          key={article?.id}
          disabled={article.id === currentId}
          color={colorModeContext.colorMode === 'dark' ? theme.palette.common.white : theme.palette.common.black}
          bgColor={
            colorModeContext.colorMode === 'dark'
              ? theme.palette.primaryContainer.light
              : theme.palette.primaryContainer.dark
          }
          article={article}
          onContextMenu={() => console.log('context opened')}
        >
          {article.childrenArticles?.length && !article.childrenArticles.every((article) => article.deleted)
            ? article.childrenArticles.map((article) => renderArticle(article, currentId))
            : null}
        </ThemedTreeItem>
      );
    }
  };
  return (
    <TreeView
      onNodeSelect={(event, id) => {
        onChange(id);
      }}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['Null Article']}
      sx={{ overflow: 'auto' }}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <ThemedTreeItem
        key="Top Level"
        bgColor={
          colorModeContext.colorMode === 'dark'
            ? theme.palette.primaryContainer.light
            : theme.palette.primaryContainer.dark
        }
        color={colorModeContext.colorMode === 'dark' ? theme.palette.common.white : theme.palette.common.black}
        onContextMenu={() => console.log('context opened')}
      >
        {ruleset.articles
          ? ruleset.articles.sort((a, b) => a.sort - b.sort).map((article) => renderArticle(article, currentArticleId))
          : null}
      </ThemedTreeItem>
    </TreeView>
  );
}
SelectArticleTree.propTypes = {
  currentArticleId: PropTypes.string,
  onChange: PropTypes.func,
};
export default SelectArticleTree;
