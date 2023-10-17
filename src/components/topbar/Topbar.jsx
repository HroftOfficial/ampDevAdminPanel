import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./topbar.css";
import { AuthContext } from "../../hoc/AuthProvider";
import Button from "@mui/material/Button";
import Clock from '../Clock/Clock';

export default function Topbar() {
  const { store } = useContext(AuthContext);
  let navigate = useNavigate();
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <Link
            to="/"
            style={{ textDecoration: "none", textTransform: "uppercase" }}
          >
            <span className="logo">АМП панель администрирования</span>
          </Link>
        </div>
        <div><Clock /></div>
        <div className="topRight">
          <Button
            variant="contained"
            color="success"
            onClick={() => store.logout(navigate)}
          >
            Выход
          </Button>
        </div>
      </div>
    </div>
  );
}
