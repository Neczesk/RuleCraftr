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
  Paper,
} from '@mui/material';
import useUserStore from '../../stores/userStore';
import {
  createRuleset,
  getRulesetsForUser,
  updateRulesetMetadata,
  deleteRuleset as dataDeleteRuleset,
  getRuleset,
} from '../../data/rulesets';
import { useEffect, useState } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import ExportDialog from '../utils/ExportDialog';
import { getAllUsers } from '../../data/articles';

function RulesetManager() {
  const { enqueueSnackbar } = useSnackbar();
  const [allUsers, setAllUsers] = useState(null);
  useEffect(() => {
    getAllUsers().then((retrievedUsers) => {
      if (Object.keys(retrievedUsers).includes('Failure')) {
        enqueueSnackbar(retrievedUsers.Failure, { variant: 'error' });
      } else {
        setAllUsers(retrievedUsers);
      }
    });
  }, [enqueueSnackbar]);
  const user = useUserStore((state) => state.user);
  const [rulesets, setRulesets] = useState(null);
  useEffect(() => {
    if (user) {
      getRulesetsForUser(user.id).then((value) => setRulesets(value));
    }
  }, [user]);
  const updateRuleset = (rulesetData) => {
    updateRulesetMetadata([rulesetData])
      .then(() => getRulesetsForUser(user.id))
      .then((value) => setRulesets(value));
  };
  const createNewRuleset = (newRulesetData) => {
    createRuleset(newRulesetData).then((response) => {
      if (Object.keys(response).includes('Failure')) {
        enqueueSnackbar(response.Failure, { variant: 'error' });
      } else {
        getRulesetsForUser(user.id)
          .then((value) => setRulesets(value))
          .then(() => startEditingRuleset(response.id));
      }
    });
  };
  const deleteRuleset = async (id) => {
    try {
      const deleteResponse = await dataDeleteRuleset(id);
      if (deleteResponse && Object.keys(deleteResponse).includes('Failure')) {
        enqueueSnackbar(deleteResponse.Failure, { variant: 'error' });
      }
      const rulesets = await getRulesetsForUser(user.id);
      if (rulesets && Object.keys(rulesets).includes('Failure')) {
        enqueueSnackbar(rulesets.Failure, { variant: 'error' });
      } else {
        setRulesets(rulesets);
      }
    } catch (error) {
      console.log('error:', error);
      enqueueSnackbar('Unexpected error occurred', { variant: 'error' });
    }
  };
  const [editingRulesetId, setEditingRulesetId] = useState(null);
  const [metadataEditedValue, setMetadataEditedValue] = useState({
    rn_name: '',
    description: '',
    public: false,
  });
  const validateMetadata = () => {
    return metadataEditedValue.rn_name != '' && metadataEditedValue.description != '';
  };
  const [exportType, setExportType] = useState(null);
  const [viewingRuleset, setViewingRuleset] = useState(null);
  const handleExport = async (rulesetId) => {
    if (rulesetId) {
      const ruleset = await getRuleset(rulesetId);
      if (!!ruleset && Object.keys(ruleset).includes('Failure')) {
        enqueueSnackbar(ruleset.Failure, { variant: 'error' });
        return;
      } else {
        setViewingRuleset(ruleset);
        setExportType('ruleset');
      }
    }
  };

  const navigate = useNavigate();
  const startEditingRuleset = async (id) => {
    const editingRuleset = await getRuleset(id);
    if (editingRuleset.user_id != user.id) {
      enqueueSnackbar("Cannot edit another user's rulesets", { variant: 'error' });
    } else {
      setMetadataEditedValue({
        rn_name: '',
        description: '',
        public: false,
      });
      const destination = '/user/' + user.id.toString() + '/rulesets/' + id.toString() + '/editor';
      navigate(destination);
    }
  };
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
                    onClick={
                      user.id === ruleset.user_id
                        ? () => startEditingRuleset(ruleset.id)
                        : () => handleExport(ruleset.id)
                    }
                    align="left"
                    variant="text"
                    size="small"
                    color={ruleset.user_id === user.id ? 'primary' : 'secondary'}
                    sx={{ textTransform: 'none', textAlign: 'left', padding: 0, overflow: 'hidden', minWidth: 0 }}
                    endIcon={ruleset.user_id === user.id ? undefined : <AutoStoriesIcon />}
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
              <TableCell>
                {(() => {
                  if (allUsers) {
                    const user = allUsers.find((user) => user.id === ruleset.user_id);
                    return user ? user.username : ruleset.user_id;
                  } else {
                    return ruleset.user_id;
                  }
                })()}
              </TableCell>
              {editingRulesetId === ruleset.id ? (
                <TableCell>
                  <IconButton
                    color={ruleset.user_id === user.id ? 'primary' : 'secondary'}
                    onClick={() => {
                      setMetadataEditedValue({
                        ...metadataEditedValue,
                        public: !metadataEditedValue.public,
                      });
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
                      color={editingRulesetId ? 'success' : 'primary'}
                      disabled={
                        user?.id !== ruleset.user_id ||
                        (!!editingRulesetId && editingRulesetId !== ruleset.id) ||
                        (!!editingRulesetId && editingRulesetId === ruleset.id && !validateMetadata())
                      }
                      onClick={() => {
                        if (editingRulesetId) {
                          if (validateMetadata()) {
                            updateRuleset({ ...metadataEditedValue, id: ruleset.id });
                            setMetadataEditedValue({ rn_name: '', description: '', public: false });
                            setEditingRulesetId(null);
                          }
                        } else {
                          setMetadataEditedValue({
                            rn_name: ruleset.rn_name,
                            description: ruleset.description,
                            public: ruleset.public,
                          });
                          setEditingRulesetId(ruleset.id);
                        }
                      }}
                    >
                      {ruleset.id === editingRulesetId ? <CheckOutlinedIcon /> : <EditNoteOutlinedIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="View Export">
                  <span>
                    <IconButton
                      color={ruleset.user_id === user.id ? 'primary' : 'secondary'}
                      onClick={() => handleExport(ruleset.id)}
                      disabled={!!editingRulesetId}
                    >
                      <AutoStoriesIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Delete ruleset (CAUTION: Cannot be undone yet!">
                  <span>
                    <IconButton color="inherit" onClick={() => deleteRuleset(ruleset.id)} disabled={false}>
                      {/* user?.id !== ruleset.user_id || (!!editingRulesetId) */}
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        })
    : [];

  const [newRulesetDialogOpen, setNewRulesetDialogOpen] = useState(false);
  const toggleNewRulesetDialog = () => {
    setNewRulesetDialogOpen(!newRulesetDialogOpen);
  };

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
    );
  }
  return (
    <>
      <ExportDialog
        ruleset={viewingRuleset}
        type={exportType}
        open={Boolean(exportType)}
        onClose={() => setExportType(null)}
      />
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
                  setMetadataEditedValue({ ...metadataEditedValue, public: Boolean(event.target.value) });
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
            color="error"
            onClick={() => {
              setMetadataEditedValue({
                rn_name: '',
                description: '',
                public: false,
              });
              toggleNewRulesetDialog();
            }}
          >
            Cancel
          </Button>
          <Button
            color="success"
            disabled={!validateMetadata()}
            onClick={() => {
              const newRulesetData = { ...metadataEditedValue, user_id: user.id };
              createNewRuleset(newRulesetData);
              setMetadataEditedValue({
                rn_name: '',
                description: '',
                public: false,
              });
              toggleNewRulesetDialog();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Container sx={{ padding: { xs: 0, md: 1, lg: 2 }, minHeight: { xs: '100%', sm: '80%', md: '75%' } }}>
        <Paper sx={{ height: '100%' }}>
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
        </Paper>
      </Container>
    </>
  );
}
export default RulesetManager;
