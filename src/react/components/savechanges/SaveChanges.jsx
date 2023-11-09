import React from 'react'
import './savechanges.css'

const SaveChanges = ({onReset, onSave}) => {

    const clickableText = {
        background: 'none',
        border: 'none',
        padding: '0',
        color: 'white', // Set the desired text color
        cursor: 'pointer', // Change cursor to a pointer on hover
        fontSize: '12px'
    };

  return (
    <div className='JDSS_SaveChanges'>
        <p>You have unsaved changes!</p>
        <div style={{marginLeft: 'auto', display: 'flex', flexDirection: 'row', gap: '20px'}}>
            <input type='button' style={clickableText} value='Reset' onClick={onReset}></input>
            <button onClick={onSave}>Save Changes</button>
        </div>
    </div>
  )
}

export default SaveChanges