import React, {useState, useEffect} from 'react'
import './options.css'
import PageHeader from '../../components/pageheader/PageHeader';
import { useSelector } from 'react-redux';
import SaveChanges from '../../components/savechanges/SaveChanges';
import LoadingGif from '../../assets/loader.gif'

const Options = () => {
    const options = useSelector((state) => state.options);
    const [startTime, setStartTime] = useState(options.timeoffset.start);
    const [stopTime, setStopTime] = useState(options.timeoffset.stop);
    const [accountTxtPath, setAccountTxtPath] = useState(options.accountTxtPath);
    const [importing, setImporting] = useState(options.importing);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    useEffect(() => {
        // Update the component states when options change
        setStartTime(options.timeoffset.start);
        setStopTime(options.timeoffset.stop);
        setAccountTxtPath(options.accountTxtPath);
        setImporting(options.importing);
      }, [options]);


    const handleStartChange = (event) => {
        const filteredValue = event.target.value.match(/-?\d*/);
        setStartTime(filteredValue);
        checkUnsaved(filteredValue, stopTime);
    }

    const handleStopChange = (event) => {
        const filteredValue = event.target.value.match(/-?\d*/);
        setStopTime(filteredValue);
        checkUnsaved(startTime, filteredValue);
    }

    const handlePathChange = (event) => {
        setAccountTxtPath(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
          importAccounts();
        }
      };

    const importAccounts = async () => {
        await window.electronAPI.importAccounts(accountTxtPath);
    }

    const checkUnsaved = (start, stop) => {
        if (parseInt(stop) !== options.timeoffset.stop || parseInt(start) !== options.timeoffset.start){
            setUnsavedChanges(true);
        }
        else{
            setUnsavedChanges(false);
        }
    }

    const saveSettings = async () => {
        if (parseInt(startTime) < parseInt(stopTime) && ((parseInt(stopTime) - parseInt(startTime)) < 30000)){
            const saveSettings = await window.electronAPI.saveOptions({
                timeoffset: {start: parseInt(startTime), stop: parseInt(stopTime)}
              });
            if (saveSettings){
                setUnsavedChanges(false);
            }
            else{
                setStopTime(500);
                setStartTime(-500);
                setUnsavedChanges(false);
            }
        }
        else{
            resetSettings();
        }
    }

    const resetSettings = () => {
        setStopTime(options.timeoffset.stop);
        setStartTime(options.timeoffset.start);
        setUnsavedChanges(false);
    }
  return (
    <div className='JDSS_Options_Page'>
        <PageHeader Page="Options"/>
        <header className='JDSS_Options_Page_Header'>
            <h1>Options</h1>
        </header>
        <div className='JDSS_Options_Page_Body'>
            <div className='JDSS_Options_Page_Option'>
                <h1>Import Accounts</h1>
                <p>Specify a .txt file path with one account per line username:password.</p>
                <div className='JDSS_Options_Page_Import'>
                    <input value={accountTxtPath} disabled={importing} onChange={handlePathChange} onKeyDown={handleKeyDown}></input>
                    <button className='JDSS_Options_Page_Import_Button' disabled={importing} onClick={importAccounts}>Import</button>
                    {importing && <img className='JDSS_Options_Page_Import_Button_Loading' src={LoadingGif} alt="Loading GIF" />}
                </div>
            </div>
            <div className='JDSS_Options_Page_Option'>
                <h1>Time Offset</h1>
                <p>Change the start / stop time for snipe tasks in milliseconds. (max difference 30000 && start time &lt; stop time)</p>
                <div className='JDSS_Options_Page_Offset'>
                    <input value={startTime} onChange={handleStartChange}></input>
                    <p>-</p>
                    <input value={stopTime} onChange={handleStopChange}></input>
                </div>
            </div>
            <div className={unsavedChanges ? 'SaveChanges visible' : 'SaveChanges'}>
                <SaveChanges onReset={resetSettings} onSave={saveSettings}/>
            </div>
        </div>
    </div>
  )
}
export default Options