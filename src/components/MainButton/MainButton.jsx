import React from 'react';
import './mainButton.css'

const MainButton = ({handleClick,title}) => {
  return (
    <button 
    className="mainButton"
    onClick={handleClick}
    >{title}</button>
  )
}

export default MainButton