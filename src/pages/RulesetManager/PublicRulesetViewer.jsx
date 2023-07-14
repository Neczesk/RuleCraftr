import {
  Avatar,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  Box,
  TextField,
  InputAdornment,
  Divider,
  Stack,
  Pagination,
  NativeSelect,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import { getPublicRulesets, getRuleset } from '../../data/rulesets';
import { useEffect, useState } from 'react';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { getAllUsers } from '../../data/articles';
import TagsCell from './TagsCell';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import ExportDialog from '../utils/ExportDialog';
import { useDebouncedCallback } from 'use-debounce';
import { useSnackbar } from 'notistack';

dayjs.extend(utc);
function PublicRulesetViewer(props) {
  const { ...others } = props;
  const [rulesets, setRulesets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    getPublicRulesets('', 1, 5).then((response) => {
      if (Object.keys(response).includes('Success')) {
        setTotalCount(response.count);
        setRulesets(response.body);
      }
    });
  }, []);
  useEffect(() => {
    const totalPages = Math.ceil(totalCount / perPage);
    setNumPages(totalPages);
  }, [perPage, totalCount]);
  let limit = 5;
  const displayDate = (db_date) => {
    const date = dayjs.utc(db_date);
    return date.local().format('MMM D, YYYY h:mmA');
  };
  const refreshRulesets = () => {
    getPublicRulesets(searchValue, 1, perPage).then((response) => {
      if (Object.keys(response).includes('Success')) {
        setPage(1);
        setTotalCount(response.count);
        setRulesets(response.body);
      }
    });
    refreshUsers();
  };
  const refreshUsers = () => {
    getAllUsers().then((users) => {
      let userMap = users.reduce((obj, user) => {
        obj[user.id] = user.username;
        return obj;
      }, {});
      setUsers(userMap);
    });
  };
  const [users, setUsers] = useState(null);
  useEffect(() => {
    refreshUsers();
  }, []);
  const tagClickHandler = (tag) => {
    const tagString = 'tag:' + tag;
    setSearchValue(tagString + ' ' + searchValue);
    searchRulesets(tagString + ' ' + searchValue);
  };
  const avatarClickHandler = (user_id) => {
    const userString = 'user:' + users[user_id];
    setSearchValue(userString + ' ' + searchValue);
    searchRulesets(userString + ' ' + searchValue);
  };

  const searchRulesets = useDebouncedCallback(
    // function
    async (searchString, page = 1) => {
      const response = await getPublicRulesets(searchString, page, perPage);
      if (!Array.isArray(response) && Object.keys(response).includes('Failure')) {
        enqueueSnackbar(response.Failure, { variant: 'error' });
      } else if (Object.keys(response).includes('Success')) {
        setPage(page);
        setTotalCount(response.count);
        setRulesets(response.body);
      }
    },
    // delay in ms
    200
  );
  const [expandedId, setExpandedId] = useState(null);
  const [exportingRuleset, setExportingRuleset] = useState(null);
  const [exportType, setExportType] = useState(null);
  const rows =
    rulesets && rulesets.length && users
      ? rulesets.map((ruleset, index) => {
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
              <Grid item xs={3} sm={5} md={7}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <IconButton
                    onClick={() => {
                      if (expandedId === ruleset.id) {
                        setExpandedId(null);
                      } else {
                        setExpandedId(ruleset.id);
                      }
                    }}
                  >
                    {expandedId === ruleset.id ? <ExpandMoreOutlinedIcon /> : <ChevronRightOutlinedIcon />}
                  </IconButton>
                  <Typography variant="body2">{ruleset.rn_name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={1}>
                <Tooltip title={users[ruleset.user_id]}>
                  <IconButton onClick={() => avatarClickHandler(ruleset.user_id)}>
                    <Avatar alt={users[ruleset.user_id]}>{users[ruleset.user_id][0]}</Avatar>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={2} sm={3} md={4}>
                <TagsCell tags={ruleset.tags} limit={limit} clickHandler={tagClickHandler} viewOnly />
              </Grid>
              {expandedId === ruleset.id ? (
                <>
                  <Grid item xs={6} sm={9} md={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={4} sm={6} md={9}>
                    <Typography sx={{ pl: 2 }} variant="body2">
                      {ruleset.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={2} md={2}>
                    <Stack direction="column">
                      <Typography variant="caption">Last Modified:</Typography>
                      <Typography variant="body2">{displayDate(ruleset.last_modified)}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      onClick={async () => {
                        const currentRuleset = await getRuleset(ruleset.id);
                        setExportType('ruleset');
                        setExportingRuleset(currentRuleset);
                      }}
                      size="small"
                    >
                      <OpenInNewOutlinedIcon />
                    </IconButton>
                  </Grid>
                </>
              ) : null}
            </Grid>
          );
        })
      : null;
  const [searchValue, setSearchValue] = useState('');
  return (
    <>
      <ExportDialog
        ruleset={exportingRuleset}
        type={exportType}
        open={Boolean(exportType)}
        onClose={() => setExportType(null)}
      />
      <Box mb={2} display="flex" flexDirection="row">
        <TextField
          hiddenLabel
          value={searchValue}
          size="small"
          variant="filled"
          placeholder="Search..."
          onChange={(event) => {
            setSearchValue(event.target.value);
            searchRulesets(event.target.value);
          }}
          InputProps={{
            endAdornment:
              searchValue.length > 0 ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setSearchValue('');
                      searchRulesets('');
                    }}
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
          }}
        />
        <Box display="flex" flexGrow={1}></Box>
        <IconButton onClick={() => refreshRulesets()}>
          <RefreshOutlinedIcon />
        </IconButton>
      </Box>
      <Box minHeight="80%" maxHeight="80%" overflow="auto">
        <Grid
          {...others}
          container
          columns={{ xs: 6, sm: 9, md: 12 }}
          sx={{ borderBottom: 'solid 1px', borderColor: theme.palette.paperBorder.main }}
        >
          <Grid item xs={3} sm={5} md={7}>
            <Typography variant="body1">Ruleset Name</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body1">Created By</Typography>
          </Grid>
          <Grid item xs={2} sm={3} md={4}>
            <Typography variant="body1">Tags</Typography>
          </Grid>
          {rows}
        </Grid>
      </Box>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <Pagination
          showFirstButton
          count={numPages}
          page={page}
          onChange={(event, value) => {
            setPage(value);
            searchRulesets(searchValue, value);
          }}
        />
        <NativeSelect
          onChange={(event) => setPerPage(parseInt(event.target.value))}
          size="small"
          defaultValue={5}
          inputProps={{ label: 'Rulesets per Page' }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </NativeSelect>
        <Typography variant="caption">
          Showing{' '}
          {(() => {
            const start = (page - 1) * perPage + 1;
            const end = Math.min(perPage * page, totalCount);
            return start + '-' + end;
          })()}{' '}
          of {totalCount}
        </Typography>
      </Stack>
    </>
  );
}
PublicRulesetViewer.propTypes = {
  others: PropTypes.array,
};
export default PublicRulesetViewer;
