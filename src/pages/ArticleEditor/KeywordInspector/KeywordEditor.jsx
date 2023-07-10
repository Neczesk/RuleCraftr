import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { findKeywordInRuleset, saveRuleset } from '../../../data/rulesets';
import useRulesetStore from '../../../stores/rulesetStore';
import TagSelect from './TagSelect';
import LongDefinitionEditor from '../utils/longDefinitionEditor';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import { Box, Grid, IconButton, InputAdornment, TextField, Typography, styled, useTheme } from '@mui/material';

function KeywordEditor(props) {
  const {
    setKeywordRefMenuOpen,
    setArticleRefMenuOpen,
    setArticleRefMenuPosition,
    setKeywordRefMenuPosition,
    selectArticle,
    saveArticle,
    keywordId,
    setSelectedView,
    onKeywordUpdate,
    addTag,
    selectKeyword,
  } = props;
  const KeywordLabelTextField = styled(TextField)({
    '& .MuiInputBase-input': {
      fontSize: '23px', // Set the font size you need
      textAlign: 'center', // This is to center the text
    },
    '& .MuiInputLabel-root': {
      fontSize: '22px', // Set the font size you need
    },
  });
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setRuleset = useRulesetStore((state) => state.setRuleset);
  const [keyword, setKeyword] = useState(null);
  const theme = useTheme();
  const [inspectorValue, setInspectorValue] = useState({
    keyword: ' ',
    shortDefinition: ' ',
    longDefinition: ' ',
  });
  useEffect(() => {
    const newKeyword = findKeywordInRuleset(keywordId, ruleset);
    setSelectedView(0);
    if (keywordId) {
      setKeyword(newKeyword);
    } else {
      setInspectorValue({
        keyword: '',
        shortDefinition: '',
        longDefinition: '',
      });
      setSelectedView(2);
    }
    if (newKeyword) {
      setInspectorValue({
        keyword: newKeyword.keyword,
        longDefinition: newKeyword.longDefinition ? newKeyword.longDefinition : '',
        shortDefinition: newKeyword.shortDefinition ? newKeyword.shortDefinition : '',
      });
    }
  }, [keywordId, ruleset, keyword, setSelectedView]);
  const [editKeywordToggle, setEditKeywordToggle] = useState(false);

  const toggleKeywordEdit = () => {
    setEditKeywordToggle(!editKeywordToggle);
  };
  const handleKeyFields = (event) => {
    if (event.key === 's' && event.ctrlKey) {
      event.preventDefault();
      save();
    }
  };

  const handleKeyKeyword = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      toggleKeywordEdit();
    }
    if (event.key === 's' && event.ctrlKey) {
      event.preventDefault();
      toggleKeywordEdit();
      save();
    }
  };
  const save = () => {
    saveRuleset(ruleset).then((newRuleset) => setRuleset(newRuleset));
  };

  const handleBlur = () => {
    toggleKeywordEdit();
    // Add your custom behavior here
  };
  return (
    <>
      {!editKeywordToggle ? (
        <Grid container justifyContent="center" alignItems="center">
          <Grid item alignContent="center">
            <Typography variant="h5">{inspectorValue.keyword}</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={toggleKeywordEdit}>
              <ModeEditOutlineOutlinedIcon color="secondary" />
            </IconButton>
          </Grid>
        </Grid>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <KeywordLabelTextField
            autoFocus
            color="secondary"
            label=""
            value={inspectorValue.keyword}
            onChange={(event) => {
              setInspectorValue({ ...inspectorValue, keyword: event.target.value });
              onKeywordUpdate({ ...inspectorValue, keyword: event.target.value });
            }}
            onKeyDown={handleKeyKeyword}
            onBlur={handleBlur}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleKeywordEdit()}>
                    <CheckOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      <TagSelect
        sx={{ mt: 3 }}
        keywordId={keyword ? keyword.id : null}
        updateKeyword={onKeywordUpdate}
        addTag={addTag}
      />
      <Box mt={2}>
        <TextField
          color="secondary"
          onKeyDown={handleKeyFields}
          multiline
          fullWidth
          label="Short Definition"
          value={inspectorValue.shortDefinition}
          onChange={(event) => {
            setInspectorValue({ ...inspectorValue, shortDefinition: event.target.value });
            onKeywordUpdate({ ...inspectorValue, shortDefinition: event.target.value });
          }}
          variant="standard"
        />
      </Box>
      <LongDefinitionEditor
        sx={{ mt: 3 }}
        setKeywordRefMenuOpen={setKeywordRefMenuOpen}
        setArticleRefMenuOpen={setArticleRefMenuOpen}
        setArticleRefMenuPosition={setArticleRefMenuPosition}
        setKeywordRefMenuPosition={setKeywordRefMenuPosition}
        selectArticle={selectArticle}
        saveArticle={saveArticle}
        color={theme.palette.secondary.main}
        inspectKeyword={selectKeyword}
        keyword={keyword}
        onChange={(value) => {
          setInspectorValue({ ...inspectorValue, longDefinition: value });
          onKeywordUpdate({ ...inspectorValue, longDefinition: value });
        }}
      />
    </>
  );
}
KeywordEditor.propTypes = {
  setKeywordRefMenuOpen: PropTypes.func.isRequired,
  setArticleRefMenuOpen: PropTypes.func.isRequired,
  setArticleRefMenuPosition: PropTypes.func.isRequired,
  setKeywordRefMenuPosition: PropTypes.func.isRequired,
  selectArticle: PropTypes.func.isRequired,
  saveArticle: PropTypes.func.isRequired,
  keywordId: PropTypes.string,
  setSelectedView: PropTypes.func.isRequired,
  onKeywordUpdate: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
  selectKeyword: PropTypes.func.isRequired,
};
export default KeywordEditor;
