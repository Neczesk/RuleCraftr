import {
  Box,
  Container,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
  IconButton,
  Tooltip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  NativeSelect,
  DialogActions,
  FormControl,
  InputLabel,
} from '@mui/material'
import useUserStore from '../../stores/userStore'
import {
  createRuleset,
  getRulesetsForUser,
  updateRulesetMetadata,
  deleteRuleset as dataDeleteRuleset,
} from '../../data/rulesets'
import { useEffect, useState } from 'react'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { useNavigate } from 'react-router'

function RulesetManager() {
  const user = useUserStore((state) => state.user)
  const [rulesets, setRulesets] = useState(null)
  useEffect(() => {
    if (user) {
      getRulesetsForUser(user.id).then((value) => setRulesets(value))
    }
  }, [user])
  const updateRuleset = (rulesetData) => {
    updateRulesetMetadata([rulesetData])
      .then(() => getRulesetsForUser(user.id))
      .then((value) => setRulesets(value))
  }
  const createNewRuleset = (newRulesetData) => {
    createRuleset(newRulesetData).then((response) =>
      getRulesetsForUser(user.id)
        .then((value) => setRulesets(value))
        .then(() => startEditingRuleset(response.id))
    )
  }
  const deleteRuleset = (id) => {
    dataDeleteRuleset(id)
      .then(() => getRulesetsForUser(user.id))
      .then((value) => setRulesets(value))
  }
  const [editingRulesetId, setEditingRulesetId] = useState(null)
  const [metadataEditedValue, setMetadataEditedValue] = useState({
    rn_name: '',
    description: '',
    public: false,
  })
  const validateMetadata = () => {
    return metadataEditedValue.rn_name != '' && metadataEditedValue.description != ''
  }
  const navigate = useNavigate()
  const startEditingRuleset = (id) => {
    setMetadataEditedValue({
      rn_name: '',
      description: '',
      public: false,
    })
    const destination = '/user/' + user.id.toString() + '/rulesets/' + id.toString() + '/editor'
    navigate(destination)
  }
  const rows = rulesets?.length
    ? rulesets
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .map((ruleset) => {
          return (
            <TableRow key={ruleset.id}>
              {editingRulesetId === ruleset.id ? (
                <TableCell component="th" scope="row">
                  <TextField
                    InputProps={{
                      sx: { fontSize: '1em' },
                    }}
                    error={!validateMetadata()}
                    variant="standard"
                    placeholder="Ruleset Name"
                    size="small"
                    value={metadataEditedValue.rn_name}
                    onChange={(event) =>
                      setMetadataEditedValue({ ...metadataEditedValue, rn_name: event.target.value })
                    }
                  ></TextField>
                </TableCell>
              ) : (
                <TableCell component="th" scope="row">
                  <Button
                    onClick={() => startEditingRuleset(ruleset.id)}
                    align="left"
                    variant="text"
                    size="small"
                    disabled={user.id !== ruleset.user_id}
                    sx={{ textTransform: 'none', textAlign: 'left', padding: 0, overflow: 'hidden', minWidth: 0 }}
                  >
                    {ruleset.rn_name}
                  </Button>
                </TableCell>
              )}
              {editingRulesetId === ruleset.id ? (
                <TableCell component="th" scope="row">
                  <TextField
                    InputProps={{
                      sx: { fontSize: '1em' },
                    }}
                    error={!validateMetadata()}
                    variant="standard"
                    placeholder="Ruleset Description"
                    size="small"
                    value={metadataEditedValue.description}
                    onChange={(event) =>
                      setMetadataEditedValue({ ...metadataEditedValue, description: event.target.value })
                    }
                  ></TextField>
                </TableCell>
              ) : (
                <TableCell>{ruleset.description}</TableCell>
              )}
              <TableCell>{ruleset.user_id}</TableCell>
              {editingRulesetId === ruleset.id ? (
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setMetadataEditedValue({
                        ...metadataEditedValue,
                        public: !metadataEditedValue.public,
                      })
                    }}
                  >
                    {metadataEditedValue.public ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                  </IconButton>
                </TableCell>
              ) : (
                <TableCell>{ruleset.public ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}</TableCell>
              )}
              <TableCell>{ruleset.created_date}</TableCell>
              <TableCell>
                <Tooltip title="Edit Ruleset Metadata">
                  <span>
                    <IconButton
                      disabled={
                        user.id !== ruleset.user_id ||
                        (!!editingRulesetId && editingRulesetId !== ruleset.id) ||
                        (!!editingRulesetId && editingRulesetId === ruleset.id && !validateMetadata())
                      }
                      onClick={() => {
                        if (editingRulesetId) {
                          if (validateMetadata()) {
                            updateRuleset({ ...metadataEditedValue, id: ruleset.id })
                            setMetadataEditedValue({ rn_name: '', description: '', public: false })
                            setEditingRulesetId(null)
                          }
                        } else {
                          setMetadataEditedValue({
                            rn_name: ruleset.rn_name,
                            description: ruleset.description,
                            public: ruleset.public,
                          })
                          setEditingRulesetId(ruleset.id)
                        }
                      }}
                    >
                      {ruleset.id === editingRulesetId ? <CheckOutlinedIcon /> : <EditNoteOutlinedIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Launch Editor">
                  <span>
                    <IconButton
                      onClick={() => startEditingRuleset(ruleset.id)}
                      disabled={user.id !== ruleset.user_id || !!editingRulesetId}
                    >
                      <FormatAlignLeftOutlinedIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Delete ruleset (CAUTION: Cannot be undone yet!">
                  <span>
                    <IconButton
                      onClick={() => deleteRuleset(ruleset.id)}
                      disabled={user.id !== ruleset.user_id || !!editingRulesetId}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          )
        })
    : []

  const [newRulesetDialogOpen, setNewRulesetDialogOpen] = useState(false)
  const toggleNewRulesetDialog = () => {
    setNewRulesetDialogOpen(!newRulesetDialogOpen)
  }

  if (Array.isArray(rows)) {
    rows.unshift(
      <TableRow key={0}>
        <TableCell component="th" scope="row">
          <Button
            onClick={toggleNewRulesetDialog}
            align="left"
            variant="text"
            size="small"
            sx={{ textTransform: 'none', textAlign: 'left', padding: 0, overflow: 'hidden', minWidth: 0 }}
          >
            Create new ruleset...
          </Button>
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell />
        <TableCell />
        <TableCell />
      </TableRow>
    )
  }
  return (
    <>
      <Dialog open={newRulesetDialogOpen} onClose={toggleNewRulesetDialog} sx={{ minWidth: '600px' }}>
        <DialogTitle>Create new ruleset</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <TextField
              label="Name"
              sx={{
                my: 1,
              }}
              InputProps={{
                sx: { fontSize: '1em' },
              }}
              error={!validateMetadata()}
              variant="standard"
              placeholder="Ruleset Name..."
              size="small"
              value={metadataEditedValue.rn_name}
              onChange={(event) => setMetadataEditedValue({ ...metadataEditedValue, rn_name: event.target.value })}
            />
            <TextField
              label="Description"
              sx={{
                my: 1,
                minWidth: '500px',
              }}
              InputProps={{
                sx: { fontSize: '1em' },
              }}
              error={!validateMetadata()}
              variant="standard"
              placeholder="Description..."
              size="small"
              multiline
              value={metadataEditedValue.description}
              onChange={(event) => setMetadataEditedValue({ ...metadataEditedValue, description: event.target.value })}
            />
            <FormControl
              sx={{
                mt: 2,
              }}
            >
              <InputLabel variant="standard" size="small" shrink htmlFor="public-selector">
                Public
              </InputLabel>
              <NativeSelect
                margin="dense"
                inputProps={{
                  name: 'Public?',
                  id: 'public-selector',
                }}
                sx={{
                  my: 1,
                }}
                size="small"
                value={metadataEditedValue.public}
                onChange={(event) => {
                  setMetadataEditedValue({ ...metadataEditedValue, public: event.target.value })
                }}
              >
                <option value={true}>True</option>
                <option value={false}>False</option>
              </NativeSelect>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMetadataEditedValue({
                rn_name: '',
                description: '',
                public: false,
              })
              toggleNewRulesetDialog()
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!validateMetadata()}
            onClick={() => {
              const newRulesetData = { ...metadataEditedValue, user_id: user.id }
              createNewRuleset(newRulesetData)
              setMetadataEditedValue({
                rn_name: '',
                description: '',
                public: false,
              })
              toggleNewRulesetDialog()
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Container sx={{ padding: 2 }}>
        <Typography variant="h4" align="center">
          Ruleset Manager
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ruleset Name</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Created By</TableCell>
                <TableCell align="left">Public?</TableCell>
                <TableCell align="left">Created on</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}
export default RulesetManager
