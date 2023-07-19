import { Typography, Button, Tooltip, styled } from '@mui/material';
import PropTypes from 'prop-types';
import useRulesetStore from '../../../stores/rulesetStore';
import { findArticleInRuleset } from '../../../data/rulesets';

const EditorTable = styled('table')({
  border: `solid 1px #000000`,
  borderCollapse: 'collapse',
  width: '100%',
});

const EditorRow = styled('tr')({});

const EditorCell = styled('td')({
  border: 'solid 1px #000000',
});

const EditorTableHead = styled('th')({
  border: 'solid 1px #000000',
});

export const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};
CodeElement.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.array,
};

export const KeywordLink = (props) => {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const keyword = findArticleInRuleset(props.element.id, ruleset.keywords);
  const handleClick = () => {
    if (props.selectKeyword) props.selectKeyword(props.element.id);
  };
  return (
    <Tooltip arrow title={keyword ? keyword.shortDefinition : 'KEYWORD MISSING'}>
      <Button
        color="secondary"
        style={{ display: 'inline-block' }}
        variant="text"
        onClick={handleClick}
        sx={{
          padding: 0,
          fontFamily: 'cutive',
          textTransform: 'none',
          textDecoration: 'underline',
          fontSize: '1rem',
        }}
        {...props.attributes}
      >
        {props.children}
        {keyword ? keyword.keyword : 'Keyword Missing'}
      </Button>
    </Tooltip>
  );
};
KeywordLink.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  element: PropTypes.object,
  selectKeyword: PropTypes.func,
};

export const ArticleLink = (props) => {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const article = findArticleInRuleset(props.element.id, ruleset.articles);
  const handleClick = () => {
    props.selectArticle(props.element.id);
  };
  return (
    <Button
      color="primary"
      style={{ display: 'inline-block' }}
      variant="text"
      onClick={handleClick}
      {...props.attributes}
      sx={{ padding: 0, fontFamily: 'cutive', textTransform: 'none', textDecoration: 'underline', fontSize: '1rem' }}
    >
      {props.children}
      {article ? article.title : 'Article Missing'}
    </Button>
  );
};
ArticleLink.propTypes = {
  attributes: PropTypes.object,
  element: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  selectArticle: PropTypes.func,
};

export const TableElement = (props) => {
  return <EditorTable>{props.children}</EditorTable>;
};
TableElement.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  element: PropTypes.object,
};

export const TableHeadElement = (props) => {
  return <thead>{props.children}</thead>;
};
TableHeadElement.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export const TableHeaderElement = (props) => {
  return <EditorTableHead>{props.children}</EditorTableHead>;
};
TableHeaderElement.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export const TableBodyElement = (props) => {
  return <tbody>{props.children}</tbody>;
};
TableBodyElement.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export const TableRowElement = (props) => {
  return <EditorRow>{props.children}</EditorRow>;
};
TableRowElement.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export const TableCellElement = (props) => {
  return <EditorCell>{props.children}</EditorCell>;
};
TableCellElement.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export const DefaultElement = (props) => {
  return (
    <Typography variant="body1" sx={{ textIndent: '2em' }} {...props.attributes}>
      {props.children}
    </Typography>
  );
};
DefaultElement.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export const HeaderElement = (props) => {
  return (
    <Typography variant={props.htype} {...props.attributes}>
      {props.children}
    </Typography>
  );
};
HeaderElement.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  htype: PropTypes.string,
};

export const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontFamily: 'cutive',
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
        textDecoration: props.leaf.underline ? 'underline' : 'none',
      }}
    >
      {props.children}
    </span>
  );
};
Leaf.propTypes = {
  attributes: PropTypes.object,
  leaf: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
