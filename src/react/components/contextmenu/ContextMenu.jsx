import React, { forwardRef } from 'react';
import './contextmenu.css'
import accountico from '../../assets/accountico.png'


const ContextMenu = forwardRef(({ account, items, style, setShowContextMenu, task}, ref) => {
  const handleItemClick = async (item) => {
    switch (item.label){
      case 'Snipe Name':
        window.electronAPI.createTaskWindow(account.accountID);
        setShowContextMenu(false);
        break;
      case 'Remove Account':
        window.electronAPI.removeAccount(account.accountID);
        setShowContextMenu(false);
        break;
      case 'Remove Task':
        window.electronAPI.removeTask(task.snipe_name);
        setShowContextMenu(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={ref} className='JDSS_ContextMenu' style={style}>
      <ul className='JDSS_ContextMenu_List'>
        <li>
          <img src={accountico} alt="accountico" />
          <span>{account ? account.game_name : task.snipe_name}</span>
        </li>
        {items.map((item) => (
          <li key={item.id} onClick={() => handleItemClick(item)}>
            <img src={item.icon} alt={item.alt} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
});

export default ContextMenu