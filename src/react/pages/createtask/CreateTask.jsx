import React, {useState, useRef, useEffect} from 'react'
import LoginWCO from '../../components/wco/LoginWCO'
import logo from '../../assets/jdsslogotest.png'
import logo2 from '../../assets/jdss.png'
import LoadingGif from '../../assets/loader.gif'
import './createtask.css'
import useCountdown from '../../hooks/useCountdown'

const CreateTask = () => {
    const [requestedNameMillis, setRequestedNameMillis] = useState(0);
    const [isBusy, setIsBusy] = useState(false);
    const [pageState, setPageState] = useState({ isError: false, errorMessage: '', isConfirmation: false });
    const [requestedName, setRequestedName] = useState('');
    const isFormValid = requestedName.length > 0;
    const requestedNameRef = useRef(null);
    const {dateTime, start, stop } = useCountdown();
    useEffect(() => {
        requestedNameRef.current.focus();
      }, []);

    const handleRequestedNameChange = (event) => {
        setRequestedName(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && isFormValid) {
          checkAvail();
        }
      };

    const checkAvail = async () => {
        setIsBusy(true)
        const nameAvail = await window.electronAPI.getAvailMillis(requestedName);
        if ( nameAvail ){
            setIsBusy(false);
            setRequestedNameMillis(nameAvail);
            start(nameAvail);
            setPageState({ isError: false, errorMessage: '', isConfirmation: true });
        }
        else {
            setIsBusy(false);
            setPageState({ isError: true, errorMessage: 'Error Getting Availability Date', isConfirmation: false });
            setRequestedName('');
        }
    }

    const createSnipeTask = async () => {
        setIsBusy(true);
        const taskCreated = await window.electronAPI.createSnipeTask(requestedName, requestedNameMillis);
        if (taskCreated === true){
            setIsBusy(false);
            window.electronAPI.shutdown();
        }
        else{
            setIsBusy(false);
            setPageState({isError: true, errorMessage: taskCreated, isConfirmation: false});
            setRequestedName('');
            stop();
        }
    }

    const cancel = () => {
        stop();
        setPageState({ isError: false, errorMessage: '', isConfirmation: false });
        setRequestedName('');
    }
  return (
    <div className='JDSS_CreateTask_Page'>
        <div className='JDSS_CreateTask_WCO'>
            <LoginWCO/>
        </div>
        <div className='JDSS_CreateTask_Page_Header'>
            <img className='JDSS_CreateTask_Logo' src={logo} alt='NavbarLogo'/>
            <img className='JDSS_CreateTask_logo' src={logo2} alt='NavbarLogo2'/>
        </div>
        {!pageState.isConfirmation && <div className='JDSS_CreateTask_Page_Body'>
            <input disabled={isBusy} className='JDSS_Input' value={requestedName} ref={requestedNameRef} onChange={handleRequestedNameChange} onKeyDown={handleKeyDown} placeholder='Requested Name'></input>
            {pageState.isError && !isBusy && <p className='JDSS_CreateTask_Page_Invalid'>{pageState.errorMessage}</p>}
            <button
                className={isBusy || !isFormValid ? 'JDSS_Button Loading' : 'JDSS_Button'}
                disabled={isBusy || !isFormValid} 
                onClick={checkAvail}>
                {isBusy ? 'Checking Name...' : 'Check Name'}
            </button>
            {isBusy && <img className='JDSS_CreateTask_Page_Gif' src={LoadingGif} alt="Loading GIF" />}
        </div>}
        {pageState.isConfirmation && <div className='JDSS_CreateTask_Page_Confirmation_Body'>
            <p>{requestedName} Available In:</p>
            <p>{dateTime}</p>
            <div className='JDSS_CreateTask_Page_Confirmation_Buttons'>
                <button
                    className={isBusy ? 'JDSS_Small_Button Cancel Loading' : 'JDSS_Small_Button Cancel'}
                    disabled={isBusy} 
                    onClick={cancel}>
                    Cancel
                </button>
                <button
                    className={isBusy ? 'JDSS_Small_Button Accept Loading' : 'JDSS_Small_Button Accept'}
                    disabled={isBusy} 
                    onClick={createSnipeTask}>
                    Create Task
                </button>
            </div>
        </div>}
    </div>
  )
}
export default CreateTask