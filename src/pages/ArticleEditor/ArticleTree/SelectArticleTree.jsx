import { TreeItem, TreeView } from '@mui/lab';
import { PropTypes } from 'prop-types';
import useRulesetStore from '../../../stores/rulesetStore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArticleTreeItem from './ArticleTreeItem';

function SelectArticleTree(props) {
  const { currentArticleId, onChange } = props;
  const ruleset = useRulesetStore((state) => state.ruleset);

  const renderArticle = (article, currentId) => {
    if (!article.deleted) {
      return (
        <ArticleTreeItem disabled={article.id === currentId} article={article} nodeId={article.id} key={article.id}>
          {article.childrenArticles?.length && !article.childrenArticles.every((article) => article.deleted)
            ? article.childrenArticles.map((article) => renderArticle(article))
            : null}
        </ArticleTreeItem>
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
      <TreeItem key="Null Article" nodeId="Null Article" label="Top Level">
        {ruleset.articles
          ? ruleset.articles.sort((a, b) => a.sort - b.sort).map((article) => renderArticle(article, currentArticleId))
          : null}
      </TreeItem>
    </TreeView>
  );
}
SelectArticleTree.propTypes = {
  currentArticleId: PropTypes.string,
  onChange: PropTypes.func,
};
export default SelectArticleTree;
