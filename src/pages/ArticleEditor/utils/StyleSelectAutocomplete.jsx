import { Autocomplete, TextField, InputAdornment } from '@mui/material'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'

function StyleSelectAutocomplete(props) {
  const mapStyleToLabel = (style) => {
    let label
    switch (style) {
      case 'h1':
        label = 'Header 1'
        break
      case 'h2':
        label = 'Header 2'
        break
      case 'h3':
        label = 'Header 3'
        break
      case 'h4':
        label = 'Header 4'
        break
      case 'h5':
        label = 'Header 5'
        break
      case 'h6':
        label = 'Header 6'
        break
      case 'code':
        label = 'Code'
        break
      case 'paragraph':
        label = 'Paragraph'
        break
      default:
        label = style
    }
    return label
  }
  const options = props.possibleStyles.map((style) => {
    return { label: mapStyleToLabel(style), style: style }
  })
  options.push({ label: 'No Selection', style: 'No Selection' })
  const [value, setValue] = useState({ label: mapStyleToLabel(props.currentStyle), style: props.currentStyle })
  useEffect(
    () => setValue({ label: mapStyleToLabel(props.currentStyle), style: props.currentStyle }),
    [props.currentStyle]
  )
  return (
    <Autocomplete
      disableClearable
      sx={{ width: 225 }}
      options={options}
      value={value}
      isOptionEqualToValue={(option, value) => {
        return option.style === value.style
      }}
      onChange={(event, value) => {
        props.onChange(value.style)
        setValue(value)
      }}
      renderInput={(params) => (
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <StyleOutlinedIcon />
              </InputAdornment>
            ),
          }}
          {...params}
          label="Style"
        />
      )}
    ></Autocomplete>
  )
}
StyleSelectAutocomplete.propTypes = {
  currentStyle: PropTypes.string.isRequired,
  possibleStyles: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default StyleSelectAutocomplete
