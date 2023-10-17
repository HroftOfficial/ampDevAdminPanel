import React from 'react';
import { Link } from 'react-router-dom';
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import "./button.css"

const ChangeButton = ({link, handleClick}) => {
  //import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
  return (
    <div className="styleButton">
    {link 
      ? (
        <Link to={`${link}`}>
        <button>
          <ChangeCircleOutlinedIcon
            fontSize="large"
            style={{ color: "red", cursor: "pointer" }}
          />
        </button>
      </Link>
      )
      :(
        <button
        onClick={handleClick}
        >
          <ChangeCircleOutlinedIcon
            fontSize="large"
            style={{ color: "red", cursor: "pointer" }}
          />
        </button>
      )
    }
    </div>
  )
}

export default ChangeButton