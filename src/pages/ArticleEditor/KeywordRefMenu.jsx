import useRulesetStore from '../../stores/rulesetStore';

import { useState, useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import {
  Autocomplete,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Popover,
  TextField,
  Button,
} from '@mui/material';
import { addKeyword } from '../../data/rulesets';
import { createKeyword } from '../../data/keywords';
import { Transforms } from 'slate';

const KeywordRefMenu = (props) => {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setRuleset = useRulesetStore((state) => state.setRuleset);
  const savedSelection = useRef(null);
  useEffect(() => {
    if (props.open && props.editor?.selection) {
      savedSelection.current = Object.assign({}, props.editor.selection);
    }
    // props.open ? (savedSelection.current = Object.assign({}, props.editor?.selection)) : Transforms.select(props.editor)
  }, [props.editor, props.open]);
  const [newKeywordDialogOpen, setNewKeywordDialogOpen] = useState(false);
  const [newKeywordDialogValue, setNewKeywordDialogValue] = useState({
    keyword: '',
    shortDefinition: '',
    longDefinition: '',
  });
  const onNewKeywordDialogClose = () => {
    setNewKeywordDialogValue({
      keyword: '',
      shortDefinition: '',
      longDefinition: '',
    });
    setNewKeywordDialogOpen(false);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef.current]);

  const [refValue, setRefValue] = useState('');

  if ((typeof ruleset.keywords !== 'undefined' || ruleset.keywords === null) && !Array.isArray(ruleset.keywords))
    return;
  const options = ruleset.keywords
    .filter((keyword) => !keyword.deleted)
    .map((keyword) => ({ label: keyword.keyword, id: keyword.id }));
  const filter = createFilterOptions();

  return (
    <>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={props.anchorPosition}
        open={props.open}
        onClose={() => {
          setRefValue('');
          props.onClose(null);
        }}
      >
        <Autocomplete
          value={refValue}
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
          freeSolo
          selectOnFocus
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                label: `Create new keyword "${params.inputValue}?"`,
              });
            }

            return filtered;
          }}
          options={options}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          id="keyword-ref-menu"
          sx={{ width: 400, margin: 1 }}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          )}
          renderInput={(params) => <TextField autoFocus inputRef={inputRef} {...params} label="Keyword to Reference" />}
          onChange={(event, value) => {
            setRefValue(value);
            if (typeof value === 'string') return;
            if (value.inputValue) {
              setNewKeywordDialogValue({ ...newKeywordDialogValue, keyword: value.inputValue });
              setNewKeywordDialogOpen(true);
              return;
            }
            if (!value) return;
            else {
              setRefValue('');
              Transforms.select(props.editor, savedSelection.current);
              props.onClose(value.id, props.editor);
            }
          }}
        ></Autocomplete>
      </Popover>
      <Dialog open={newKeywordDialogOpen} onClose={onNewKeywordDialogClose}>
        <DialogTitle>Add a new keyword</DialogTitle>
        <DialogContent>
          <DialogContentText>You can add a new keyword directly here to reference</DialogContentText>
          <TextField
            margin="dense"
            id="keyword"
            value={newKeywordDialogValue.keyword}
            onChange={(event) => {
              setNewKeywordDialogValue({ ...newKeywordDialogValue, keyword: event.target.value });
            }}
            label="Keyword"
            type="text"
            variant="standard"
          />
          <TextField
            fullWidth
            margin="dense"
            id="shortDefinition"
            value={newKeywordDialogValue.shortDefinition}
            onChange={(event) => {
              setNewKeywordDialogValue({ ...newKeywordDialogValue, shortDefinition: event.target.value });
            }}
            label="Short Definition"
            type="text"
            variant="standard"
          />
          <TextField
            fullWidth
            margin="dense"
            id="longDefinition"
            value={newKeywordDialogValue.longDefinition}
            onChange={(event) => {
              setNewKeywordDialogValue({ ...newKeywordDialogValue, longDefinition: event.target.value });
            }}
            label="Long Definition"
            type="text"
            variant="standard"
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onNewKeywordDialogClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const newKeyword = createKeyword(ruleset.id, newKeywordDialogValue);
              setRuleset(addKeyword(ruleset, newKeyword));
              onNewKeywordDialogClose();
            }}
          >
            Add Keyword
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
KeywordRefMenu.propTypes = {
  anchorPosition: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  editor: PropTypes.object,
};
export default KeywordRefMenu;
