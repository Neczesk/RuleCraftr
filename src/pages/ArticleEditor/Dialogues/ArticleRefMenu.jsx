import { useRef, useEffect } from 'react';

import { PropTypes } from 'prop-types';
import { Popover, Autocomplete, TextField } from '@mui/material';
import useRulesetStore from '../../../stores/rulesetStore';
import { treeToArray } from '../../../data/articles';
import { Transforms } from 'slate';

const ArticleRefMenu = (props) => {
  const { selection } = props;
  const ruleset = useRulesetStore((state) => state.ruleset);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef.current]);
  if (!ruleset.articles) return;

  const articleArray = ruleset.articles.flatMap((article) => treeToArray(article));
  const options = articleArray
    .filter((article) => !article.deleted)
    .map((article) => ({ label: article.title, id: article.id }));
  return (
    <Popover
      anchorReference="anchorPosition"
      anchorPosition={props.anchorPosition}
      open={props.open}
      onClose={() => props.onClose(null)}
    >
      <Autocomplete
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          );
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        id="article-ref-menu"
        options={options}
        sx={{ width: 400, margin: 1 }}
        renderInput={(params) => <TextField autoFocus inputRef={inputRef} {...params} label="Article to Reference" />}
        onChange={(event, value) => {
          Transforms.select(props.editor, selection);
          props.onClose(value.id, props.editor);
        }}
      ></Autocomplete>
    </Popover>
  );
};
ArticleRefMenu.propTypes = {
  anchorPosition: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  editor: PropTypes.object,
  selection: PropTypes.object,
};
export default ArticleRefMenu;
