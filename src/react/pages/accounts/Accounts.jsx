import React from 'react'
import './accounts.css'
import AccountTable from '../../components/accounttable/AccountTable';
import { useSelector } from 'react-redux';
import PageHeader from '../../components/pageheader/PageHeader';
import ContextMenu from '../../components/contextmenu/ContextMenu'
import useContextMenu from '../../hooks/useContextMenu';
import trashico from '../../assets/trash.png';


const Accounts = () => {
  const {
    showContextMenu,
    contextMenuPosition,
    contextMenuAccount,
    contextMenuRef,
    handleAccountContextMenu,
    setShowContextMenu
  } = useContextMenu();

  const login = async () => {
    window.electronAPI.createLoginWindow();
  }

  const data = useSelector((state) => state.accounts);
  const items = [
    { id: 1, icon: trashico, alt: "trashico", label: 'Remove Account' }
  ]
  return (
    <div className='JDSS_Account_Page' onContextMenu={handleAccountContextMenu}>
      {showContextMenu && contextMenuPosition && (
        <ContextMenu
          ref={contextMenuRef}
          account={contextMenuAccount}
          style={{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`
          }}
          items={items}
          setShowContextMenu={setShowContextMenu}
        />
      )}
      <PageHeader Page="Accounts"/>
      <header className='JDSS_Account_Page_Header'>
        <h1>Accounts</h1>
        <button className='JDSS_Account_Page_Login_Button' onClick={login}>Add Account</button>
      </header>
      <div className='JDSS_Account_Page_Body'>
        <AccountTable data={data}/>
      </div>
    </div>
  )
}

export default Accounts