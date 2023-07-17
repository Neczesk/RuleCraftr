import { useState, useEffect } from 'react';
import { Container, Paper, Tab, Tabs, useTheme, useMediaQuery, Divider, Box } from '@mui/material';
import useUserStore from '../../stores/userStore';
import { getRulesetsForUser, createRuleset, getRuleset } from '../../data/rulesets';
import OwnedRulesetManager from './OwnedRulesetManager';
import NewRuleset from './NewRuleset';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import PublicRulesetViewer from './PublicRulesetViewer';

function RulesetManagerGrid() {
  const user = useUserStore((state) => state.user);
  const [rulesets, setRulesets] = useState(null);
  useEffect(() => {
    if (user) {
      getRulesetsForUser(user.id).then((value) => setRulesets(value));
    }
  }, [user]);
  const refresh = () => {
    getRulesetsForUser(user.id).then((value) => setRulesets(value));
  };
  const { enqueueSnackbar } = useSnackbar;
  const [tabValue, setTabValue] = useState(user?.id ? 1 : 0);
  const theme = useTheme();
  const smallWidth = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const startEditingRuleset = async (id) => {
    const editingRuleset = await getRuleset(id);
    if (editingRuleset.user_id != user.id) {
      enqueueSnackbar("Cannot edit another user's rulesets", { variant: 'error' });
    } else {
      const destination = '/user/' + user.id.toString() + '/rulesets/' + id.toString() + '/editor';
      navigate(destination);
    }
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
  return (
    <>
      <Container
        sx={{
          padding: { xs: 0, md: 1, lg: 2 },
          maxHeight: 'calc(100vh - 48px)',
          minHeight: { xs: '100%', sm: '80%', md: '75%' },
        }}
      >
        <Paper sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => setTabValue(newValue)}
            centered={smallWidth ? false : true}
          >
            <Tab label="Public Rulesets" value={0}></Tab>
            {user ? <Tab label="Your Rulesets" value={1}></Tab> : null}
            {user ? <Tab label="Create a new Ruleset" value={2} /> : null}
          </Tabs>
          <Divider sx={{ mb: 2 }}></Divider>
          <Box flex={1} padding={{ xs: 0, md: 1 }} sx={{ overflow: 'auto' }} display="flex">
            <Box display={tabValue === 1 ? 'flex' : 'none'} flexGrow={1}>
              <OwnedRulesetManager startEditingRuleset={startEditingRuleset} refresh={refresh} rulesets={rulesets} />
            </Box>
            <Box display={tabValue === 2 ? 'flex' : 'none'} flexGrow={1}>
              <NewRuleset createNewRuleset={createNewRuleset} padding={1} />
            </Box>
            <Box display={tabValue === 0 ? 'flex' : 'none'} flexDirection="column" flexGrow={1}>
              <PublicRulesetViewer />
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
export default RulesetManagerGrid;
