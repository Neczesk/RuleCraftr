import PropTypes from 'prop-types';
import useRulesetStore from '../../../stores/rulesetStore';
import { useState } from 'react';
import * as dataKeywords from '../../../data/keywords';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

import { Box, Button, IconButton, Paper, Popover, Stack, TextField, Toolbar, useTheme } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import KeywordManager from './KeywordManager';

import KeywordEditor from './KeywordEditor';

function KeywordInspector({
  keywordId,
  onSelectKeyword,
  elevation,
  sx,
  setKeywordRefMenuOpen,
  setArticleRefMenuOpen,
  setArticleRefMenuPosition,
  setKeywordRefMenuPosition,
  selectArticle,
  saveArticle,
}) {
  const ruleset = useRulesetStore((state) => state.ruleset);
  const setSingleKeyword = useRulesetStore((state) => state.setSingleKeyword);
  const removeKeyword = useRulesetStore((state) => state.removeKeyword);
  const [selectedView, setSelectedView] = useState(0);

  const onKeywordUpdate = (newData) => {
    setSingleKeyword(newData.id, newData);
  };

  const selectKeyword = (id) => {
    onSelectKeyword(id);
  };

  const deleteKeyword = (id) => {
    removeKeyword(id);
    selectKeyword(null);
    setSelectedView(2);
  };

  const createKeyword = (newData, addingTag = false) => {
    const newKeyword = dataKeywords.createKeyword(ruleset.id, newData);
    setSingleKeyword(newKeyword.id, newKeyword);
    if (!addingTag) {
      selectKeyword(newKeyword.id);
    }
  };
  const theme = useTheme();
  const addTag = (tag) => {
    createKeyword(
      {
        tag: tag,
        dummy: true,
        keyword: 'dummy',
        shortDefinition: 'This keyword is only to make sure that empty tags show up',
      },
      true
    );
  };
  const [addTagPopoverRef, setAddTagPopoverRef] = useState(null);
  const [addTagValue, setAddTagValue] = useState('');
  return (
    <>
      <Popover
        anchorEl={addTagPopoverRef}
        open={!!addTagPopoverRef}
        onClose={() => {
          setAddTagPopoverRef(null);
        }}
      >
        <TextField
          autoFocus
          type="text"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => {
                  addTag(addTagValue);
                  setAddTagPopoverRef(null);
                  setAddTagValue('');
                }}
                disabled={addTagValue === ''}
                sx={{
                  color: addTagValue !== '' ? theme.palette.success.main : null,
                }}
              >
                <CheckOutlinedIcon />
              </IconButton>
            ),
          }}
          size="small"
          value={addTagValue}
          onChange={(event) => setAddTagValue(event.target.value)}
          placeholder="New Tag Name"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addTag(addTagValue);
              setAddTagPopoverRef(null);
              setAddTagValue('');
            }
          }}
        />
      </Popover>
      <Box marginBottom={0} sx={sx} flexDirection="column">
        <Paper
          elevation={elevation}
          sx={{
            padding: 1,
            pt: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            height: '100%',
            backgroundColor: theme.palette.primaryContainer.main,
          }}
        >
          <Toolbar variant="dense" sx={{ mb: 1 }} disableGutters>
            <Box
              sx={{ backgroundColor: theme.palette.primaryContainer.main, width: '100%', height: '100%', padding: 1 }}
            >
              {selectedView === 0 ? (
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <IconButton
                    style={{
                      borderRadius: theme.shape.borderRadius,
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.getContrastText(theme.palette.secondary.main),
                    }}
                    sx={{ px: 0 }}
                    size="small"
                    variant="contained"
                    color="secondary"
                    disabled={selectedView === 2}
                    onClick={() => {
                      selectKeyword(null);
                      switch (selectedView) {
                        case 1:
                          setSelectedView(2);
                          break;
                        case 0:
                          setSelectedView(2);
                          break;
                        case 2:
                          break;
                      }
                    }}
                  >
                    <ArrowBackIosNewOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Box flexGrow={1} />
                  <Button variant="contained" size="small" color="error" onClick={() => deleteKeyword(keywordId)}>
                    Delete Keyword
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={(event) => setAddTagPopoverRef(event.currentTarget)}
                  >
                    Add New Tag
                  </Button>
                </Stack>
              )}
            </Box>
          </Toolbar>
          <Box display={selectedView === 2 ? 'block' : 'none'}>
            <KeywordManager
              selectKeyword={selectKeyword}
              createKeyword={createKeyword}
              deleteKeyword={deleteKeyword}
              updateKeyword={onKeywordUpdate}
              addTag={addTag}
            />
          </Box>
          <Box
            display={selectedView === 0 ? 'block' : 'none'}
            sx={{ paddingX: 1, overflowY: 'auto', overflowX: 'hidden' }}
          >
            <KeywordEditor
              keywordId={keywordId}
              setArticleRefMenuOpen={setArticleRefMenuOpen}
              setArticleRefMenuPosition={setArticleRefMenuPosition}
              setKeywordRefMenuOpen={setKeywordRefMenuOpen}
              setKeywordRefMenuPosition={setKeywordRefMenuPosition}
              selectArticle={selectArticle}
              saveArticle={saveArticle}
              setSelectedView={setSelectedView}
              addTag={addTag}
              selectKeyword={selectKeyword}
              onKeywordUpdate={onKeywordUpdate}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
}
KeywordInspector.propTypes = {
  keywordId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelectKeyword: PropTypes.func,
  sx: PropTypes.object,
  elevation: PropTypes.number,
  setKeywordRefMenuOpen: PropTypes.func.isRequired,
  setArticleRefMenuOpen: PropTypes.func.isRequired,
  setArticleRefMenuPosition: PropTypes.func.isRequired,
  setKeywordRefMenuPosition: PropTypes.func.isRequired,
  selectArticle: PropTypes.func.isRequired,
  saveArticle: PropTypes.func.isRequired,
};
export default KeywordInspector;
