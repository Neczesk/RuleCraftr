import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';
import useRulesetStore from '../../../stores/rulesetStore';
import { findKeywordInRuleset } from '../../../data/rulesets';
function TagSelect(props) {
  const { keywordId, updateKeyword, addTag, onClose, closeOnChange, ...others } = props;
  const ruleset = useRulesetStore((state) => state.ruleset);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    if (ruleset && ruleset.keywords) {
      setTags([...new Set(ruleset.keywords.filter((keyword) => !keyword.deleted).map((keyword) => keyword.tag))]);
    }
  }, [ruleset]);
  const [options, setOptions] = useState([
    { label: 'This should never be seen', value: 'If you see this let me know' },
  ]);
  const [keyword, setKeyword] = useState(null);
  useEffect(() => {
    if (keywordId) {
      setKeyword(findKeywordInRuleset(keywordId, ruleset));
    }
  }, [keywordId, ruleset]);
  useEffect(() => {
    const newOptions = keyword
      ? tags.map((tag) => {
          if (tag) return { label: tag.toString(), value: tag };
          else if (!tag) return { label: 'No Tag', value: null };
        })
      : [];
    if (newOptions && newOptions.length && !newOptions.some((option) => option.value === null))
      newOptions.unshift({ label: 'No Tag', value: null });
    setOptions(newOptions);
    if (keyword && keyword.tag) setValue({ label: keyword.tag, value: keyword.tag });
    else setValue({ label: 'No Tag', value: null });
  }, [keyword, tags]);

  const [value, setValue] = useState({ label: 'No Tag', value: null });

  const handleChange = (event, value) => {
    setValue(value);
    if (typeof value === 'string') return;
    if (!value) return;
    if (value && value.inputValue) {
      addTag(value.inputValue);
      setValue({ label: value.inputValue, value: value.inputValue });
      if (closeOnChange) {
        updateKeyword({ id: keyword.id, tag: value.value });
        onClose();
      }
      return;
    } else {
      setValue({ label: value.label, value: value.value });
      if (closeOnChange) {
        updateKeyword({ id: keyword.id, tag: value.value });
        onClose();
      }
    }
  };
  const filter = createFilterOptions();

  return (
    <>
      <Autocomplete
        {...others}
        disableClearable
        onBlur={() => {
          updateKeyword({ id: keyword.id, tag: value.value });
          if (onClose) onClose();
        }}
        freeSolo
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.label;
        }}
        handleHomeEndKeys
        clearOnBlur
        value={value}
        isOptionEqualToValue={(option, value) => value.value === option.value}
        options={options}
        onChange={handleChange}
        renderInput={(params) => <TextField label="Tag" variant="standard" {...params} />}
        renderOption={(props, option) => (
          <li {...props} key={option.label}>
            {option.label}
          </li>
        )}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              label: `Create new tag "${params.inputValue}?"`,
            });
          }

          return filtered;
        }}
      />
    </>
  );
}
TagSelect.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  updateKeyword: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  keywordId: PropTypes.string,
  closeOnChange: PropTypes.bool,
};
export default TagSelect;
