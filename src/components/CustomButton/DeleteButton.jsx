import React from 'react';
import "./button.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const DeleteButton = ({handleClick}) => {
  return (
    <div className="styleButton">
    <button
      onClick={handleClick}
    >
      <DeleteOutlineOutlinedIcon
        fontSize="large"
        style={{ color: "red", cursor: "pointer" }}
      />
    </button>
    </div>
  )
}

export default DeleteButton