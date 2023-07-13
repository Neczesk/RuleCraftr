import { Autocomplete, TextField } from '@mui/material';
import { PropTypes } from 'prop-types';
import { getAllTags } from '../../data/tags';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { debounce } from 'lodash';

function TagEditor(props) {
  const { currentTags, value, setValue, ...others } = props;
  const [existantTags, setExistantTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setValue(
      currentTags.map((tag) => {
        return { label: tag };
      })
    );
  }, [currentTags, setValue]);
  const tagSearch = (value) => {
    if (value.length > 0) {
      getAllTags(value)
        .then((tags) => {
          if (tags.length) {
            setExistantTags(tags);
          }
        })
        .catch(() => {
          enqueueSnackbar('Error getting tags', { variant: 'warning' });
        });
    } else setExistantTags([]);
  };
  const handleInputChange = (event, value) => {
    setInputValue(value);
    debouncedTagSearch(value);
  };
  const debouncedTagSearch = debounce(tagSearch, 200);
  const handleChange = (event, value) => {
    // Update the ruleset's tags when the user selects/deselects a tag
    const newValue = value.map((tag) => {
      if (typeof tag === 'object' && !Array.isArray(tag) && tag !== null && tag.label) {
        return tag;
      } else if (typeof tag === 'string') {
        return { label: tag };
      }
    });
    setValue(newValue);
  };
  const options = existantTags.length ? existantTags.map((tag) => ({ label: tag })) : [];
  return (
    <Autocomplete
      {...others}
      freeSolo
      multiple
      value={value}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => {
        return option.label == value.label;
      }}
      options={options}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} label="Tags" placeholder="Add tags here..." />}
    />
  );
}
TagEditor.propTypes = {
  rulesetId: PropTypes.number,
  currentTags: PropTypes.arrayOf(PropTypes.string),
  others: PropTypes.array,
  value: PropTypes.array,
  setValue: PropTypes.func,
};
export default TagEditor;
