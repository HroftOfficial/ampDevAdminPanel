import React from "react";
import { Link } from "react-router-dom";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import "./button.css";

const ChangeImageButton = ({ link, handleClick }) => {
  return (
    <div className="styleButton">
      {link ? (
        <Link to={`${link}`}>
          <AddPhotoAlternateOutlinedIcon
            fontSize="large"
            style={{ color: "darkgreen", cursor: "pointer" }}
          />
        </Link>
      ) : (
        <button onClick={handleClick}>
          <AddPhotoAlternateOutlinedIcon
            fontSize="large"
            style={{ color: "darkgreen", cursor: "pointer" }}
          />
        </button>
      )}
    </div>
  );
};

export default ChangeImageButton;
