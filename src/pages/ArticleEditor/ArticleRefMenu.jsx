import { useRef, useEffect } from 'react'

import { PropTypes } from 'prop-types'
import { Popover, Autocomplete, TextField } from '@mui/material'
import useRulesetStore from '../../stores/rulesetStore'
import { treeToArray } from '../../data/articles'
import { Transforms } from 'slate'

const ArticleRefMenu = (props) => {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const inputRef = useRef(null)
  const savedSelection = useRef(null)
  useEffect(() => {
    if (props.open && props.editor?.selection) {
      savedSelection.current = Object.assign({}, props.editor.selection)
    }
    // props.open ? (savedSelection.current = Object.assign({}, props.editor?.selection)) : Transforms.select(props.editor)
  }, [props.editor, props.open])
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef.current])
  if (!ruleset.articles) return

  const articleArray = ruleset.articles.flatMap((article) => treeToArray(article))
  const options = articleArray.map((article) => ({ label: article.title, id: article.id }))
  return (
    <Popover
      anchorReference="anchorPosition"
      anchorPosition={props.anchorPosition}
      open={props.open}
      onClose={() => props.onClose(null)}
    >
      <Autocomplete
        isOptionEqualToValue={(option, value) => option.id === value.id}
        id="article-ref-menu"
        options={options}
        sx={{ width: 400 }}
        renderInput={(params) => <TextField autoFocus inputRef={inputRef} {...params} label="Article to Reference" />}
        onChange={(event, value) => {
          Transforms.select(props.editor, savedSelection.current)
          props.onClose(value.id)
        }}
      ></Autocomplete>
    </Popover>
  )
}
ArticleRefMenu.propTypes = {
  anchorPosition: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  editor: PropTypes.object,
}
export default ArticleRefMenu
