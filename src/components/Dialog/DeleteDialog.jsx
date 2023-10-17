import React from 'react'
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const DeleteDialog = ({handle, textDialog, open, setOpen, ...props}) => {
  return (
    <Dialog
    open={open}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    {...props}
  >
    <DialogTitle id="alert-dialog-title">
      {textDialog}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description"></DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpen(false)} autoFocus variant='contained' color='secondary'>
        отмена
      </Button>
      <Button onClick={handle} variant='contained' color='primary'>Удалить</Button>
    </DialogActions>
  </Dialog>
  )
}

export default DeleteDialog
