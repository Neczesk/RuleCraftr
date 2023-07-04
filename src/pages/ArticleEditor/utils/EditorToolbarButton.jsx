import { Button } from '@mui/material'
import { PropTypes } from 'prop-types'

function EditorToolbarButton(props) {
  return (
    <Button {...props} size="small" sx={{ padding: 0 }}>
      {props.children}
    </Button>
  )
}
EditorToolbarButton.propTypes = {
  children: PropTypes.array,
}
export default EditorToolbarButton
