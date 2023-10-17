import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { Link } from "react-router-dom";

const CircleButton = ({link}) => {
  return (
    <Link to={link} >
    <AddCircleOutlinedIcon
      style={{ color: "teal", cursor: "pointer", fontSize: "68px" }}
    />
    </Link>
  )
}

export default CircleButton