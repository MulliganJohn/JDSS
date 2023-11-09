import React from 'react'
import './loginwco.css'
import whitecloseButtonImage from '../../assets/whiteclose.png';
import whiteminimizeButtonImage from '../../assets/whiteminimize.png';

const WCO = () => {
    const handleShutdown = () => {
        window.electronAPI.shutdown();
    }

    const minimizeWindow = () => {
        window.electronAPI.minimizeWindow();
    }

  return (
    <div className='JDSS_LoginWCO'>
        <button className='login-minimize-button' onClick={minimizeWindow}>
            <img src={whiteminimizeButtonImage} alt="Minimize" />
        </button>
        <button className='login-close-button' onClick={handleShutdown}>
            <img src={whitecloseButtonImage} alt="Close" />
        </button>
    </div>
  )
}

export default WCO