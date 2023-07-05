import PropTypes from 'prop-types'
import useRulesetStore from '../../stores/rulesetStore'
import { useEffect, useState } from 'react'
import * as dataKeywords from '../../data/keywords'
import { findKeywordInRuleset, updateKeyword, saveRuleset, removeKeyword, addKeyword } from '../../data/rulesets'

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import KeywordTable from './utils/KeywordTable'

const KeywordLabelTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontSize: '23px', // Set the font size you need
    textAlign: 'center', // This is to center the text
  },
  '& .MuiInputLabel-root': {
    fontSize: '22px', // Set the font size you need
  },
})

function KeywordInspector({ keywordId, onSelectKeyword, elevation }) {
  const ruleset = useRulesetStore((state) => state.ruleset)
  const setRuleset = useRulesetStore((state) => state.setRuleset)
  const [keyword, setKeyword] = useState(null)
  const [selectedView, setSelectedView] = useState(0)
  const [inspectorValue, setInspectorValue] = useState({
    keyword: ' ',
    shortDefinition: ' ',
    longDefinition: ' ',
  })
  useEffect(() => {
    const newKeyword = findKeywordInRuleset(keywordId, ruleset)
    setSelectedView(0)
    if (keywordId) {
      setKeyword(newKeyword)
    } else {
      setInspectorValue({
        keyword: '',
        shortDefinition: '',
        longDefinition: '',
      })
      setSelectedView(2)
    }
    if (newKeyword) {
      setInspectorValue({
        keyword: newKeyword.keyword,
        longDefinition: newKeyword.longDefinition ? newKeyword.longDefinition : '',
        shortDefinition: newKeyword.shortDefinition ? newKeyword.shortDefinition : '',
      })
    }
  }, [keywordId, ruleset, keyword])

  // Manipulating the state of the Keyword Inspector itself
  const [editKeywordToggle, setEditKeywordToggle] = useState(false)
  const toggleKeywordEdit = () => {
    setEditKeywordToggle(!editKeywordToggle)
  }

  const handleKeyFields = (event) => {
    if (event.key === 's' && event.ctrlKey) {
      event.preventDefault()
      save()
    }
  }

  const handleKeyKeyword = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      toggleKeywordEdit()
    }
    if (event.key === 's' && event.ctrlKey) {
      event.preventDefault()
      toggleKeywordEdit()
      save()
    }
  }

  const save = () => {
    saveRuleset(ruleset).then((newRuleset) => setRuleset(newRuleset))
  }

  const handleBlur = () => {
    toggleKeywordEdit()
    // Add your custom behavior here
  }

  // These functions are used to manipulate the keywords of the active ruleset

  const onKeywordUpdate = (newData) => {
    setRuleset(updateKeyword({ ...newData, id: keyword.id }, ruleset))
  }

  const selectKeyword = (id) => {
    onSelectKeyword(id)
  }

  const deleteKeyword = (id) => {
    setRuleset(removeKeyword(id, ruleset))
  }

  const createKeyword = (newData) => {
    const newKeyword = dataKeywords.createKeyword(ruleset.id, newData)
    setRuleset(addKeyword(ruleset, newKeyword))
    selectKeyword(newKeyword.id)
  }
  const theme = useTheme()

  return (
    <>
      <Box marginBottom={0} maxHeight="100%" height="100%" display="flex" flexDirection="column">
        <Paper
          elevation={elevation}
          sx={{
            padding: 1,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            height: '100%',
            backgroundColor: theme.palette.primaryContainer.main,
          }}
        >
          <Toolbar>
            <Container>
              <ButtonGroup color="secondary">
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={selectedView === 2}
                  onClick={() => {
                    selectKeyword(null)
                    switch (selectedView) {
                      case 1:
                        setSelectedView(2)
                        break
                      case 0:
                        setSelectedView(2)
                        break
                      case 2:
                        break
                    }
                  }}
                >
                  Manage Keywords
                </Button>
              </ButtonGroup>
            </Container>
          </Toolbar>
          <Box display={selectedView === 2 ? 'block' : 'none'}>
            <KeywordTable
              onAdd={createKeyword}
              keywords={ruleset.keywords ? ruleset.keywords : null}
              deleteKeyword={deleteKeyword}
              onSelect={selectKeyword}
            />
          </Box>
          <Box
            display={selectedView === 0 ? 'block' : 'none'}
            sx={{ paddingX: 1, overflowY: 'auto', overflowX: 'hidden' }}
          >
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
                    setInspectorValue({ ...inspectorValue, keyword: event.target.value })
                    onKeywordUpdate({ ...inspectorValue, keyword: event.target.value })
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
            <Box mt={2}>
              <TextField
                color="secondary"
                onKeyDown={handleKeyFields}
                multiline
                fullWidth
                label="Short Definition"
                value={inspectorValue.shortDefinition}
                onChange={(event) => {
                  setInspectorValue({ ...inspectorValue, shortDefinition: event.target.value })
                  onKeywordUpdate({ ...inspectorValue, shortDefinition: event.target.value })
                }}
                variant="standard"
              />
            </Box>
            <Box mt={3}>
              <TextField
                color="secondary"
                InputProps={{ sx: { pb: 0 } }}
                onKeyDown={handleKeyFields}
                fullWidth
                multiline
                variant="standard"
                label="Long Definition"
                value={inspectorValue.longDefinition}
                onChange={(event) => {
                  setInspectorValue({ ...inspectorValue, longDefinition: event.target.value })
                  onKeywordUpdate({ ...inspectorValue, longDefinition: event.target.value })
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  )
}
KeywordInspector.propTypes = {
  keywordId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelectKeyword: PropTypes.func,
  sx: PropTypes.object,
  elevation: PropTypes.number,
}
export default KeywordInspector
