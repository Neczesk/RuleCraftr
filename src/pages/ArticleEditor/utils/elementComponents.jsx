import { Typography, Button, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import useRulesetStore from '../../../stores/rulesetStore'
import { findArticleInRuleset } from '../../../data/rulesets'

export const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}
CodeElement.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.array,
}

export const KeywordLink = (props) => {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const keyword = findArticleInRuleset(props.element.id, ruleset.keywords)
  const handleClick = () => {
    if (props.selectKeyword) props.selectKeyword(props.element.id)
  }
  return (
    <Tooltip arrow title={keyword ? keyword.shortDefinition : 'KEYWORD MISSING'}>
      <Button
        color="secondary"
        style={{ display: 'inline-block' }}
        variant="text"
        onClick={handleClick}
        sx={{ padding: 0 }}
        {...props.attributes}
      >
        {props.children}
        {keyword ? keyword.keyword : 'Keyword Missing'}
      </Button>
    </Tooltip>
  )
}
KeywordLink.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  element: PropTypes.object,
  selectKeyword: PropTypes.func,
}

export const ArticleLink = (props) => {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const article = findArticleInRuleset(props.element.id, ruleset.articles)
  const handleClick = () => {
    props.selectArticle(props.element.id)
  }
  return (
    <Button
      color="primary"
      style={{ display: 'inline-block' }}
      variant="text"
      onClick={handleClick}
      {...props.attributes}
      sx={{
        padding: 0,
      }}
    >
      {props.children}
      {article ? article.title : 'Article Missing'}
    </Button>
  )
}
ArticleLink.propTypes = {
  attributes: PropTypes.object,
  element: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  selectArticle: PropTypes.func,
}

export const DefaultElement = (props) => {
  return (
    <Typography variant="body1" sx={{ textIndent: '2em' }} {...props.attributes}>
      {props.children}
    </Typography>
  )
}
DefaultElement.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export const HeaderElement = (props) => {
  return (
    <Typography variant={props.htype} {...props.attributes}>
      {props.children}
    </Typography>
  )
}
HeaderElement.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  htype: PropTypes.string,
}

export const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
        textDecoration: props.leaf.underline ? 'underline' : 'none',
      }}
    >
      {props.children}
    </span>
  )
}
Leaf.propTypes = {
  attributes: PropTypes.object,
  leaf: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}
