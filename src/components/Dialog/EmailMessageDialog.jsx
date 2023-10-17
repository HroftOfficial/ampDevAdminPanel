import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Message } from "../Message/Message";

export const EmailMessageDialog = ({
    open,
    handleClose,
    data,
    dataFirstId,
    handleSubmit,
}) => {
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Отправить на почту`}
                </DialogTitle>
                <DialogContent sx={{ width: "450px" }}>
                    {data?.map((item, index) => (
                        <div key={index}>
                            <Message
                                message={item}
                                own={
                                    item.senderId === dataFirstId ? false : true
                                }
                                // own={message?.senderId === user?._id}
                            />

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
                    <Button
                        autoFocus
                        onClick={handleSubmit}
                        variant="contained"
                        color="success"
                    >
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
