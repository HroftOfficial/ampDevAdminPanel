import React from 'react';
import Weather from '../../components/Weather/Weather';
import './home.css';

export default function Home() {
    return (
        <>
<div className='home'>
                <div className="homeWidgets">
                <Weather />
                </div>
            </div>
        </>
    )
}
