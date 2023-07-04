import { IconButton, Button } from '@mui/material'
import { PropTypes } from 'prop-types'

function EditorToolbarButton(props) {
  const { type, active, children, ...others } = props

  return type == 'icon' ? (
    <IconButton {...others} color={active ? 'primary' : ''} variant="outlined" size="small" sx={{ paddingX: 1 }}>
      {children}
    </IconButton>
  ) : (
    <Button {...others} fullWidth variant="text" size="small" sx={{ paddingX: 1 }}>
      {children}
    </Button>
  )
}
EditorToolbarButton.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  active: PropTypes.bool,
}
export default EditorToolbarButton
