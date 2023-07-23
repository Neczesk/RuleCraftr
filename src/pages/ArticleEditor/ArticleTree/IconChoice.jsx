import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';

import { PropTypes } from 'prop-types';

function IconChoice(props) {
  const { onChange, value, options } = props;
  return (
    <Autocomplete
      value={value}
      disableClearable
      onChange={onChange}
      id="icon-choice"
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.icon_name}>
            <Box flexDirection="row" display="flex">
              {option?.icon}
              {option.label}
            </Box>
          </li>
        );
      }}
      isOptionEqualToValue={(option, value) => option.icon_name === value?.icon_name}
      options={options}
      sx={{ width: '300px', margin: 1 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose an optional icon"
          InputProps={{
            ...params.InputProps,
            startAdornment: value && value.icon ? <InputAdornment position="start">{value.icon}</InputAdornment> : null,
          }}
        />
      )}
    />
  );
}
IconChoice.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default IconChoice;
