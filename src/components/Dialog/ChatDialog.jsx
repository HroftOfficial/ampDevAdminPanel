import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Message } from "../Message/Message";

const ChatDialog = ({ open, handleClose, data, dataFirstId }) => {
    console.log("DATA", data);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {/* {"История изменений заказа"} */}
                </DialogTitle>

                <DialogContent sx={{ width: "450px" }}>
                    {data?.map((item, index) => (
                        <div key={index}>
                            {/* <div
                style={{
                  border: "1px solid black",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              > */}
                            <Message
                                message={item}
                                own={
                                    item.senderId === dataFirstId ? false : true
                                }
                                // own={message?.senderId === user?._id}
                            />
                            {/* когда: {format(new Date(item.date), 'dd MM yyyy')} <br/> 
                кто: {item.chatId} <br/> 
                действие: {item.text} */}
                            {/* {!!data &&
                  data?.map((message) => (
                    <div key={message._id}>
                      <Message
                        message={message}
                        // own={message?.senderId === user?._id}
                      />
                    </div>
                  ))} */}
                            {/* </div> */}
                            <div style={{ height: "10px" }}></div>
                        </div>
                    ))}
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
};

export default ChatDialog;
