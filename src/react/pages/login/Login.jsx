import React, {useState, useRef, useEffect} from 'react'
import './login.css'
import LoginWCO from '../../components/wco/LoginWCO'
import logo from '../../assets/jdsslogotest.png'
import logo2 from '../../assets/jdss.png'
import LoadingGif from '../../assets/loader.gif'


const Login = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginState, setLoginState] = useState({ isError: false, errorMessage: '' });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isFormValid = username.length > 0 && password.length > 0;
    const usernameRef = useRef(null);
    useEffect(() => {
        usernameRef.current.focus();
      }, []);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    
      const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && isFormValid) {
          login();
        }
      };

    const login = async () => {
        setIsLoggingIn(true)
        const loginStatus = await window.electronAPI.login(username, password);
        if ( loginStatus === true){
            setIsLoggingIn(false);
            window.electronAPI.shutdown();
        }
        else {
            setIsLoggingIn(false);
            setLoginState({ isError: true, errorMessage: loginStatus });
            setPassword('');
        }
    }
  return (
    <div className='JDSS_Login_Page'>
        <div className='JDSS_Login_WCO'>
            <LoginWCO/>
        </div>
        <div className='JDSS_Login_Page_Header'>
            <img className='JDSS_Login_Logo' src={logo} alt='NavbarLogo'/>
            <img className='JDSS_Login_logo' src={logo2} alt='NavbarLogo2'/>
        </div>
        <div className='JDSS_Login_Page_Body'>
            <div className='JDSS_Login_Page_Inputs'>
                <input disabled={isLoggingIn} className='JDSS_Login_Username' value={username} ref={usernameRef} onChange={handleUsernameChange} placeholder='Username'></input>
                <input disabled={isLoggingIn} type='password' className='JDSS_Login_Password' value={password} onChange={handlePasswordChange} onKeyDown={handleKeyDown} placeholder='Password'></input>
            </div>
            {loginState.isError && !isLoggingIn && <p className='JDSS_Login_Page_Invalid'>{loginState.errorMessage}</p>}
            <button
                className={isLoggingIn || !isFormValid ? 'JDSS_Login_Button_Loading' : 'JDSS_Login_Button'}
                disabled={isLoggingIn || !isFormValid} 
                onClick={login}>
                    {isLoggingIn ? 'Logging In...' : 'Login'}
            </button>
            {isLoggingIn && <img className='JDSS_Login_Page_Gif' src={LoadingGif} alt="Loading GIF" />}
        </div>
    </div>
  )
}

export default Login