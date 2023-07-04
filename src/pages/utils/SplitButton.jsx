import { Box, Button, ButtonGroup, Menu, MenuItem } from '@mui/material'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import { useRef, useState } from 'react'
import PropTypes from 'prop-types'

function SplitButton(props) {
  const [anchorEl, setAnchorEl] = useState(null)

  const mainActionRef = useRef()
  const buttonGroupRef = useRef()

  const menuItems = props.functionalities?.map((functionality, index) => {
    return (
      <MenuItem
        key={index}
        onClick={
          functionality.action
            ? () => {
                setAnchorEl(null)
                functionality.action()
              }
            : () => {
                setAnchorEl(null)
                console.log('no functionality assigned')
              }
        }
      >
        {functionality.label ? functionality.label : 'Missing function'}
      </MenuItem>
    )
  })
  return (
    <>
      <Menu
        PaperProps={{
          sx: {
            width: buttonGroupRef.current ? buttonGroupRef.current.offsetWidth : undefined,
          },
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {menuItems}
      </Menu>
      <Box display="flex" flexDirection="row" width="100%">
        <ButtonGroup ref={buttonGroupRef} variant="contained" color={props.color}>
          <Button
            ref={mainActionRef}
            sx={{ padding: 1 }}
            fullWidth
            size="small"
            color={props.color}
            onClick={props.mainAction ? props.mainAction : () => console.log('main action missing')}
          >
            {props.mainActionLabel ? props.mainActionLabel : 'Main Action Missing'}
          </Button>
          <Button size="small" color={props.color} onClick={() => setAnchorEl(mainActionRef.current)}>
            <ArrowDropDownOutlinedIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </>
  )
}
SplitButton.propTypes = {
  functionalities: PropTypes.array,
  mainAction: PropTypes.func,
  mainActionLabel: PropTypes.string,
  color: PropTypes.string,
}
export default SplitButton
