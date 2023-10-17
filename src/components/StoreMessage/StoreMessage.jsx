import React,{useContext} from 'react';
import { AuthContext } from "../../hoc/AuthProvider";
import { observer } from "mobx-react-lite";

const StoreMessage = () => {
    const {store} = useContext(AuthContext);
  return (
    <div
    style={{
      padding: "0px 20px",
      fontSize: "1.2rem",
      color: "darkred",
      height: "30px",
      fontWeight: "600",
    }}
  >
    {store?.message}
  </div>
  )
}

export default observer(StoreMessage)