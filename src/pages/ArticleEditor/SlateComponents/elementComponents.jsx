import { Typography, Button, Tooltip, styled } from '@mui/material';
import PropTypes from 'prop-types';
import useRulesetStore from '../../../stores/rulesetStore';
import { findArticleInRuleset } from '../../../data/rulesets';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import { useCallback, useEffect, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Transforms } from 'slate';

const ResizeHandleIcon = styled(SyncAltOutlinedIcon)({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%) scale(0.5,0.5)',
  cursor: 'col-resize',
});

const EditorTable = styled('table')(({ theme }) => ({
  border: `solid 1px ${theme.palette.divider}`,
  borderCollapse: 'collapse',
  maxWidth: '100%',
  overflowX: 'auto',
  backgroundColor: theme.palette.primaryContainer.main, // use color from theme
}));

const EditorRow = styled('tr')(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.primaryContainer.main,
  },
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.primaryContainer.dark,
  },
}));

const EditorCell = styled('td')(({ theme }) => ({
  border: `solid 1px ${theme.palette.divider}`,
}));

const EditorTableHead = styled('th')(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.getContrastText(theme.palette.primary.dark),
  border: `solid 1px ${theme.palette.divider}`,
}));

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

const ResizeHandle = (props) => {
  const editor = useSlate();
  const { width, setWidth, path } = props;
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (event) => {
      if (!isDragging) return;
      setWidth((prevWidth) => prevWidth + event.movementX);
    },
    [isDragging, setWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    Transforms.setNodes(editor, { width: width }, { at: path });
  }, [editor, path, width]);
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  return <ResizeHandleIcon onMouseDown={handleMouseDown} />;
};
ResizeHandle.propTypes = {
  width: PropTypes.number,
  setWidth: PropTypes.func,
  path: PropTypes.arrayOf(PropTypes.number),
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

export const ListElement = (props) => {
  const { element, children } = props;
  switch (element.subtype) {
    case 'ordered':
      return <ol>{children}</ol>;
    case 'unordered':
      return <ul>{children}</ul>;
    default:
      return <ul>{children}</ul>;
  }
};
ListElement.propTypes = {
  element: PropTypes.object,
  children: PropTypes.arrayOf(PropTypes.node),
};

export const ListItemElement = (props) => {
  const { children } = props;
  return <li>{children}</li>;
};
ListItemElement.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
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
  const editor = useSlate();
  const [width, setWidth] = useState(props.element.width);
  return (
    <EditorTableHead
      sx={{ minWidth: width.toString() + 'px', maxWidth: width.toString() + 'px', position: 'relative' }}
    >
      {props.children}
      <ResizeHandle width={width} setWidth={setWidth} path={ReactEditor.findPath(editor, props.element)} />
    </EditorTableHead>
  );
};
TableHeaderElement.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  element: PropTypes.object,
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
    <Typography variant="body1" {...props.attributes}>
      {props.children}
    </Typography>
  );
};
DefaultElement.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const StyledTabSpan = styled('span')(() => ({
  padding: '1em',
  userSelect: 'none',
}));

export const TabElement = (props) => {
  return <StyledTabSpan contentEditable={false} {...props} />;
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
