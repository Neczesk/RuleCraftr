import { Box, Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

function SplitButton(props) {
  const { color, functionalities, mainActionLabel, mainAction, variant, icon, ...others } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const mainActionRef = useRef();
  const buttonGroupRef = useRef();

  const menuItems = functionalities?.map((functionality, index) => {
    return (
      <MenuItem
        key={index}
        onClick={
          functionality.action
            ? () => {
                setAnchorEl(null);
                functionality.action();
              }
            : () => {
                setAnchorEl(null);
                console.log('no functionality assigned');
              }
        }
      >
        {functionality.label ? functionality.label : 'Missing function'}
        {functionality.icon ? functionality.icon : null}
      </MenuItem>
    );
  });
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
      <Box display="flex" flexDirection="row" width="100%" {...others}>
        <ButtonGroup ref={buttonGroupRef} variant={variant ? variant : 'contained'} color={color}>
          <Button
            sx={{ paddingX: 0, paddingRight: 1 }}
            startIcon={icon ? icon : null}
            ref={mainActionRef}
            fullWidth
            color={color}
            onClick={mainAction ? mainAction : () => console.log('main action missing')}
          >
            {mainActionLabel ? mainActionLabel : 'Main Action Missing'}
          </Button>
          <Button size="small" color={color} onClick={() => setAnchorEl(mainActionRef.current)}>
            <ArrowDropDownOutlinedIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
}
SplitButton.propTypes = {
  functionalities: PropTypes.array,
  mainAction: PropTypes.func,
  mainActionLabel: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  icon: PropTypes.node,
};
export default SplitButton;
