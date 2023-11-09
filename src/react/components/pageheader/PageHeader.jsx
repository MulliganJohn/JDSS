import React from 'react'
import './pageheader.css'
import WCO from '../wco/WCO';


const PageHeader = ({Page, color}) => {
  return (
    <div className='JDSS_PageHeader' style={{ backgroundColor: color }}>
        <WCO/>
        {Page && <p>JDSS {'>'} {Page}</p>}
    </div>
  )
}

export default PageHeader