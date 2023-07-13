import { useState } from 'react';
import {
  Button,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import TagsCell from './TagsCell';
import { useSnackbar } from 'notistack';
import { getRuleset, updateRulesetMetadata, deleteRuleset as dataDeleteRuleset } from '../../data/rulesets';
import ExportDialog from '../utils/ExportDialog';
import TagEditor from '../utils/TagEditor';

function OwnedRulesetManager(props) {
  const { rulesets, refresh, startEditingRuleset, ...rest } = props;
  const theme = useTheme();
  const displayDate = (db_date) => {
    const date = dayjs.utc(db_date);
    return date.local().format('MMM D, YYYY h:mmA');
  };
  const extraSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const smallWidth = useMediaQuery(theme.breakpoints.down('md'));
  const superSmall = useMediaQuery(theme.breakpoints.down(400));
  const { enqueueSnackbar } = useSnackbar();
  let limit = 5;
  if (smallWidth) limit = 3;
  if (extraSmall) limit = 2;
  if (superSmall) limit = 1;
  const [editingRulesetName, setEditingRulesetName] = useState(null);
  const [editingRulesetValue, setEditingRulesetValue] = useState('');
  const [changingDescriptionId, setChangingDescriptionId] = useState(null);
  const [changingDescriptionValue, setChangingDescriptionValue] = useState('');
  const renameRuleset = async () => {
    const currentRuleset = rulesets.find((ruleset) => ruleset.id === editingRulesetName);
    const updateData = [{ ...currentRuleset, rn_name: editingRulesetValue }];
    setEditingRulesetName(null);
    setEditingRulesetValue('');
    const status = await updateRulesetMetadata(updateData);
    if (Object.keys(status).includes('Failure')) {
      enqueueSnackbar(status.Failure, { variant: 'error' });
    } else {
      refresh();
      enqueueSnackbar('Ruleset successfully renamed', { variant: 'success' });
    }
  };
  const changeRulesetVisibility = async () => {
    const currentRuleset = rulesets.find((ruleset) => ruleset.id === changingPublicRulesetId);
    const updateData = [{ ...currentRuleset, public: !currentRuleset.public }];
    setChangingPublicRulesetId(null);
    const status = await updateRulesetMetadata(updateData);
    if (Object.keys(status).includes('Failure')) {
      enqueueSnackbar(status.Failure, { variant: 'error' });
    } else {
      refresh();
      enqueueSnackbar('Ruleset visibility changed', { variant: 'success' });
    }
  };
  const renameFieldKeyHandler = (event) => {
    if (event.key === 'Enter') {
      renameRuleset();
    }
  };

  const deleteRuleset = async () => {
    try {
      const deleteResponse = await dataDeleteRuleset(deletingRulesetId);
      if (deleteResponse && Object.keys(deleteResponse).includes('Failure')) {
        enqueueSnackbar(deleteResponse.Failure, { variant: 'error' });
      }
    } catch (error) {
      console.log('error:', error);
      enqueueSnackbar('Unexpected error occurred', { variant: 'error' });
    }
    refresh();
    setDeletingRulesetId(null);
  };
  const changeDescriptionKeyHandler = (event) => {
    if (event.key === 'Enter') {
      changeDescription();
    }
  };

  const changeDescription = async () => {
    const currentRuleset = rulesets.find((ruleset) => ruleset.id === changingDescriptionId);
    const updateData = [{ ...currentRuleset, description: changingDescriptionValue }];
    setChangingDescriptionId(null);
    const status = await updateRulesetMetadata(updateData);
    if (Object.keys(status).includes('Failure')) {
      enqueueSnackbar(status.Failure, { variant: 'error' });
    } else {
      refresh();
      enqueueSnackbar('Ruleset description changed', { variant: 'success' });
    }
  };
  const [tagEditorId, setTagEditorId] = useState(null);
  const [editingOriginalTags, setEditingTagsTags] = useState([]);
  const [currentEditorTags, setCurrentEditorTags] = useState([]);
  const tagClickHandler = (id, tags) => {
    setTagEditorId(id);
    setEditingTagsTags(tags);
  };
  const rows = rulesets
    ? rulesets
        .sort((a, b) => {
          const datea = dayjs.utc(a.last_modified);
          const dateb = dayjs.utc(b.last_modified);
          return dateb - datea;
        })
        .map((ruleset, index) => {
          return (
            <Grid
              key={ruleset.id}
              item
              container
              columns={{ xs: 6, sm: 9, md: 12 }}
              xs={6}
              sm={9}
              md={12}
              sx={{
                padding: 0.5,
                borderTop: 'solid 1px',
                borderColor: theme.palette.paperBorder.main,
                backgroundColor:
                  index % 2 === 0 ? theme.palette.primaryContainer.light : theme.palette.primaryContainer.dark,
              }}
            >
              <Grid item xs={1} sm={3} md={4}>
                {editingRulesetName == ruleset.id ? (
                  <TextField
                    onKeyDown={renameFieldKeyHandler}
                    onBlur={renameRuleset}
                    autoFocus
                    variant="standard"
                    value={editingRulesetValue}
                    onChange={(event) => setEditingRulesetValue(event.target.value)}
                  ></TextField>
                ) : (
                  <Button
                    color="secondary"
                    component={Typography}
                    onClick={() => {
                      setEditingRulesetValue(ruleset.rn_name);
                      setEditingRulesetName(ruleset.id);
                    }}
                    variant="text"
                    sx={{
                      textTransform: 'none',
                    }}
                    endIcon={<EditOutlinedIcon />}
                  >
                    {ruleset.rn_name}
                  </Button>
                )}
              </Grid>
              <Grid item xs={1} sm={1} md={1}>
                <IconButton
                  onClick={() => setChangingPublicRulesetId(ruleset.id)}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  {ruleset.public ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                </IconButton>
              </Grid>
              <Grid item xs={1} sm={2} md={3}>
                <TagsCell
                  tags={ruleset.tags}
                  limit={limit}
                  clickHandler={() => tagClickHandler(ruleset.id, ruleset.tags)}
                />
              </Grid>
              <Grid item xs={1} sm={1} md={1}>
                <IconButton
                  onClick={() => startEditingRuleset(ruleset.id)}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  <EditNoteOutlinedIcon />
                </IconButton>
              </Grid>
              <Grid item xs={1} sm={1} md={1}>
                <IconButton
                  onClick={async () => {
                    const exportingRuleset = await getRuleset(ruleset.id);
                    setExportingRuleset(exportingRuleset);
                    setExportType('ruleset');
                  }}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  <OpenInNewOutlinedIcon />
                </IconButton>
              </Grid>
              <Grid item xs={1} sm={1} md={2}>
                <IconButton
                  onClick={() => setDeletingRulesetId(ruleset.id)}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Grid>
              <Grid item xs={4} sm={7} md={10}>
                <Typography variant="caption">Description</Typography>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Typography variant="caption">Last Modified</Typography>
              </Grid>
              <Grid item xs={6} sm={9} md={12}>
                <Divider />
              </Grid>
              <Grid item xs={4} sm={7} md={10}>
                {changingDescriptionId == ruleset.id ? (
                  <TextField
                    onKeyDown={changeDescriptionKeyHandler}
                    onBlur={changeDescription}
                    autoFocus
                    variant="standard"
                    value={changingDescriptionValue}
                    onChange={(event) => setChangingDescriptionValue(event.target.value)}
                  ></TextField>
                ) : (
                  <Button
                    component={Typography}
                    onClick={() => {
                      setChangingDescriptionValue(ruleset.description);
                      setChangingDescriptionId(ruleset.id);
                    }}
                    variant="text"
                    endIcon={<EditNoteOutlinedIcon sx={{ color: theme.palette.secondary.main }} />}
                    sx={{
                      textTransform: 'none',
                      color: theme.palette.getContrastText(theme.palette.primaryContainer.main),
                    }}
                  >
                    {ruleset.description}
                  </Button>
                )}
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                {displayDate(ruleset.last_modified)}
              </Grid>
            </Grid>
          );
        })
    : null;
  const [changingPublicRulesetId, setChangingPublicRulesetId] = useState(null);
  const [exportingRuleset, setExportingRuleset] = useState();
  const [exportType, setExportType] = useState(null);
  const [deletingRulesetId, setDeletingRulesetId] = useState(null);
  const handleTagEdit = async () => {
    const currentRuleset = rulesets.find((ruleset) => ruleset.id === tagEditorId);
    const tagArray = currentEditorTags.map((tag) => tag.label);
    const updateData = [{ ...currentRuleset, tags: tagArray }];
    setTagEditorId(null);
    const status = await updateRulesetMetadata(updateData);
    if (Object.keys(status).includes('Failure')) {
      enqueueSnackbar(status.Failure, { variant: 'error' });
    } else {
      refresh();
      enqueueSnackbar('Ruleset tags changed', { variant: 'success' });
    }
  };

  return (
    <>
      <Dialog open={!!tagEditorId} onClose={() => setTagEditorId(null)}>
        <DialogContent>
          <TagEditor
            value={currentEditorTags}
            setValue={setCurrentEditorTags}
            sx={{ minWidth: { xs: '100%', sm: '500px' }, maxWidth: { xs: '100%', sm: '500px' } }}
            currentTags={editingOriginalTags}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagEditorId(null)} color="warning">
            Cancel
          </Button>
          <Button onClick={() => handleTagEdit()}>Accept</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deletingRulesetId} onClose={() => setDeletingRulesetId(null)}>
        <DialogContent>
          <DialogContentText>
            This deletes the ruleset. There is currently no way to recover a deleted ruleset.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingRulesetId(null)} color="warning">
            Cancel
          </Button>
          <Button onClick={deleteRuleset} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ExportDialog
        ruleset={exportingRuleset}
        type={exportType}
        open={Boolean(exportType)}
        onClose={() => setExportType(null)}
      />
      <Dialog open={!!changingPublicRulesetId} onClose={() => setChangingPublicRulesetId(null)}>
        <DialogContent>
          <DialogContentText>
            Change ruleset to{' '}
            {rulesets?.length
              ? rulesets.find((ruleset) => ruleset.id === changingPublicRulesetId)?.public
                ? 'private?'
                : 'public?'
              : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangingPublicRulesetId(null)} color="warning">
            Cancel
          </Button>
          <Button onClick={changeRulesetVisibility} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Grid
        {...rest}
        container
        columns={{ xs: 6, sm: 9, md: 12 }}
        sx={{ borderBottom: 'solid 1px', borderColor: theme.palette.paperBorder.main }}
      >
        <Grid item xs={1} sm={3} md={4}>
          Ruleset Name
        </Grid>
        <Grid item xs={1} sm={1} md={1}>
          Public
        </Grid>
        <Grid item xs={1} sm={2} md={3}>
          Tags
        </Grid>
        <Grid item xs={1} sm={1} md={1}>
          Open Editor
        </Grid>
        <Grid item xs={1} sm={1} md={1}>
          View Export
        </Grid>
        <Grid item xs={1} sm={1} md={2}>
          Delete Ruleset
        </Grid>
        <Grid item xs={1} sm={2} md={4} />
        {rows}
      </Grid>
    </>
  );
}
OwnedRulesetManager.propTypes = {
  rulesets: PropTypes.arrayOf(PropTypes.object),
  refresh: PropTypes.func.isRequired,
  startEditingRuleset: PropTypes.func.isRequired,
};
export default OwnedRulesetManager;
