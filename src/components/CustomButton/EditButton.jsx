import React from 'react';
import { Link } from 'react-router-dom';
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import "./button.css"

const EditButton = ({link, handleClick}) => {
  return (
    <div className="styleButton">
    {link 
      ? (
        <Link to={`${link}`}>
        <button>
          <ModeEditOutlineOutlinedIcon
            fontSize="large"
            style={{ color: "blue", cursor: "pointer" }}
          />
        </button>
      </Link>
      )
      :(
        <button
        onClick={handleClick}
        >
          <ModeEditOutlineOutlinedIcon
            fontSize="large"
            style={{ color: "blue", cursor: "pointer" }}
          />
        </button>
      )
    }
    </div>
  )
}

export default EditButton