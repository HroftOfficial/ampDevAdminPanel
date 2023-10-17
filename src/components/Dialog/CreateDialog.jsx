import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import CreateForm from "../Form/CreateForm";

import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

const CreateDialog = ({
  handle,
  textDialog,
  children,
  open,
  setOpen,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  position,
  setPosition,
  ...props
}) => {
  return (
    <Dialog
      open={open}
      // onClose={handleDelete}
      aria-labelledby="create-dialog-title"
      aria-describedby="create-dialog-description"
      {...props}
    >
      <DialogTitle id="create-dialog-title">{textDialog}</DialogTitle>
      <DialogContent>
        <FormControl style={{ padding: "10px 20px" }}>
          <TextField
            required
            id="name"
            label="ФИО"
            value={name}
            onChange={(e) => setName(e?.target?.value)}
          />
          <div style={{ padding: "10px 20px" }}></div>
          <TextField
            required
            id="email"
            label="email"
            value={email}
            onChange={(e) => setEmail(e?.target?.value)}
          />
          <div style={{ padding: "10px 20px" }}></div>
          <TextField
            required
            id="position"
            label="должность"
            value={position}
            onChange={(e) => setPosition(e?.target?.value)}
          />
          <div style={{ padding: "10px 20px" }}></div>
          <TextField
            id="password"
            label="пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e?.target?.value)}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          autoFocus
          variant="contained"
          color="secondary"
        >
          отмена
        </Button>
        <Button onClick={handle} variant="contained" color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDialog;
