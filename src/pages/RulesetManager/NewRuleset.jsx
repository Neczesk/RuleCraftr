import { Box, TextField, InputLabel, FormControl, NativeSelect, Stack, Button } from '@mui/material';
import { useState } from 'react';
import { PropTypes } from 'prop-types';
import useUserStore from '../../stores/userStore';

function NewRuleset(props) {
  const { createNewRuleset, ...rest } = props;
  const user = useUserStore((state) => state.user);
  const [metadataEditedValue, setMetadataEditedValue] = useState({
    rn_name: '',
    description: '',
    public: false,
  });
  const validateMetadata = () => {
    return metadataEditedValue.rn_name != '' && metadataEditedValue.description != '';
  };
  return (
    <Box
      {...rest}
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
          minWidth: { xs: '300px', sm: '500px' },
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
          minWidth: { xs: '300px', sm: '500px' },
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
      <Stack sx={{ width: '100%', mt: 3 }} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
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
          }}
        >
          Save and Start Editing
        </Button>
      </Stack>
    </Box>
  );
}
NewRuleset.propTypes = {
  rest: PropTypes.array,
  createNewRuleset: PropTypes.func.isRequired,
};
export default NewRuleset;
