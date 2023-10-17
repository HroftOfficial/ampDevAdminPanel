import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { format } from 'date-fns'

const HistoryDialog = ({open, handleClose, data}) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"История изменений заказа"}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description"> */}
            {data?.map((item,index)=>
               (
                <div  key={index}>
                <div style={{'border':'1px solid black','borderRadius':'8px', 'padding':'10px'}}>
                когда: {format(new Date(item.date), 'dd MM yyyy')} <br/> 
                кто: {item.name} <br/> 
                действие: {item.messages}
                </div>
                <div style={{'height':'10px'}}></div>
                </div>
                ))}
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
        <Button
                  autoFocus
                  onClick={handleClose}
                  variant="contained"
                  color="secondary"
                >
                  Отменить
                </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default HistoryDialog