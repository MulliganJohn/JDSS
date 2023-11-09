import React from 'react'
import './navbar.css'
import logo from '../../assets/jdsslogotest.png'
import accountico from '../../assets/accountico.png'
import taskico from '../../assets/taskico.png'
import logo2 from '../../assets/jdss.png'
import optionsico from '../../assets/options.png'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const gotoAccounts = () => {
    navigate('/Accounts');
  };
  
  const gotoTasks = () => {
    navigate('/Tasks');
  };

  const gotoOptions = () => {
    navigate('/Options');
  }

  return (
    <div className='JDSS_Navbar'>
      <div className='JDSS_Navbar_logo_container'>
        <img className='JDSS_Navbar_logo' src={logo} alt='NavbarLogo'/>
        <img className='JDSS_Navbar_logo' src={logo2} alt='NavbarLogo2'/>
      </div>
      <button className='JDSS_Navbar_Button' onClick={gotoAccounts}>
        <img src={accountico} alt="AccountIcon" />
        Accounts
      </button>
      <button className='JDSS_Navbar_Button' onClick={gotoTasks}>
        <img src={taskico} alt="TaskIcon"/>
        Tasks
      </button>
      <button className='JDSS_Navbar_Button' onClick={gotoOptions}>
        <img src={optionsico} alt="OptionsIcon"/>
        Options
      </button>
    </div>
  )
}

export default Navbar