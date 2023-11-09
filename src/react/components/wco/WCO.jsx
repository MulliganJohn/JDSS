import React from 'react'
import './wco.css'
import closeButtonImage from '../../assets/close.png';
import minimizeButtonImage from '../../assets/minimize.png';

const WCO = () => {
    const handleShutdown = () => {
        window.electronAPI.shutdown();
    }

    const minimizeWindow = () => {
        window.electronAPI.minimizeWindow();
    }

  return (
    <div className='JDSS_WCO'>
        <button className='minimize-button' onClick={minimizeWindow}>
            <img src={minimizeButtonImage} alt="Minimize" />
        </button>
        <button className='close-button' onClick={handleShutdown}>
            <img src={closeButtonImage} alt="Close" />
        </button>
    </div>
  )
}

export default WCO