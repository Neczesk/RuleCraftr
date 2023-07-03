import { Button, Dialog, DialogContent, DialogActions, DialogContentText } from '@mui/material'
import PropTypes from 'prop-types'

function ConfirmNavigationDialogue(props) {
  return (
    <Dialog open={props.blocker.state === 'blocked'}>
      <DialogContent>
        <DialogContentText>Your ruleset is unsaved, are you sure you want to leave the page?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.blocker.proceed?.()}>Confirm</Button>
        <Button onClick={() => props.blocker.reset?.()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
ConfirmNavigationDialogue.propTypes = {
  blocker: PropTypes.object,
}
export default ConfirmNavigationDialogue
