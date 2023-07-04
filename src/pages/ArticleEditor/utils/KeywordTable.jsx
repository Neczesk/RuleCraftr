import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Button,
  IconButton,
  TextField,
  Stack,
} from '@mui/material'
import PropTypes from 'prop-types'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { useState } from 'react'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'

function KeywordTable(props) {
  const [addingKeyword, setAddingKeyword] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [newKeywordShortDef, setNewKeywordShortDef] = useState('')
  const validateNewKeyword = () => {
    return !!newKeyword && !!newKeywordShortDef
  }
  if (!props.keywords) return null
  const rows = props.keywords
    .filter((keyword) => !keyword.deleted)
    .map((keyword) => {
      return (
        <TableRow key={keyword.id}>
          <TableCell component="th" scope="row">
            <Button
              color="secondary"
              variant="text"
              size="small"
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              endIcon={<OpenInNewOutlinedIcon fontSize="small" />}
              onClick={() => props.onSelect(keyword.id)}
            >
              {keyword.keyword}
            </Button>
          </TableCell>
          <TableCell align="right">{keyword.shortDefinition}</TableCell>
          <TableCell align="right">
            <IconButton size="small" onClick={() => props.deleteKeyword(keyword.id)}>
              <ClearOutlinedIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      )
    })
  rows.push(
    <TableRow key={-1}>
      <TableCell component="th" scope="row">
        {!addingKeyword ? (
          <Button
            endIcon={<OpenInNewOutlinedIcon fontSize="small" />}
            color="secondary"
            variant="text"
            size="small"
            sx={{ textTransform: 'none', fontWeight: 'bold', paddingX: 0 }}
            onClick={() => setAddingKeyword(true)}
          >
            {'Add New...'}
          </Button>
        ) : (
          <TextField
            error={!validateNewKeyword()}
            variant="standard"
            placeholder="Keyword"
            size="small"
            value={newKeyword}
            onChange={(event) => setNewKeyword(event.target.value)}
          />
        )}
      </TableCell>
      <TableCell align="right">
        {addingKeyword ? (
          <TextField
            color="secondary"
            error={!validateNewKeyword()}
            placeholder="Short Definition"
            variant="standard"
            size="small"
            value={newKeywordShortDef}
            onChange={(event) => setNewKeywordShortDef(event.target.value)}
          />
        ) : null}
      </TableCell>
      <TableCell align="right">
        <Stack direction="row">
          <IconButton
            color="secondary"
            disabled={!addingKeyword || !validateNewKeyword()}
            size="small"
            onClick={() => {
              const newKeywordData = { keyword: newKeyword, shortDefinition: newKeywordShortDef, longDefinition: '' }
              props.onAdd(newKeywordData)
              setAddingKeyword(false)
              setNewKeyword('')
              setNewKeywordShortDef('')
            }}
          >
            <AddOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="secondary"
            disabled={!addingKeyword}
            size="small"
            onClick={() => {
              setNewKeyword('')
              setNewKeywordShortDef('')
              setAddingKeyword(false)
            }}
          >
            <ClearOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  )
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Keyword</TableCell>
            <TableCell align="right">Definition</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  )
}
KeywordTable.propTypes = {
  keywords: PropTypes.array,
  deleteKeyword: PropTypes.func,
  onSelect: PropTypes.func,
  onAdd: PropTypes.func,
}

export default KeywordTable
