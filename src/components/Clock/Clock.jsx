import React, { useState, useEffect } from 'react';
import './clock.css'

const Clock = () => {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  // const [seconds, setSeconds] = useState('00');
  const [go, setGo] = useState(false);
  const timeGoHome = 12;



  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newHours = now.getHours().toString().padStart(2, '0');
      const newMinutes = now.getMinutes().toString().padStart(2, '0');
      // const newSeconds = now.getSeconds().toString().padStart(2, '0');

      setHours(newHours);
      setMinutes(newMinutes);
      if(newHours >= timeGoHome){
        setGo(true)
      }
      // setSeconds(newSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='clock'>
      <div className="hours">{hours}:</div>
      <div className="minutes">{minutes}</div>
      {/* {go && <span className='message'>Пора домой!</span>} */}
      {/* <div className="seconds">{seconds}</div> */}
    </div>
  );
};

export default Clock;