import './App.css';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, useLocation} from 'react-router-dom';
import Accounts from './pages/accounts/Accounts'
import Navbar from './components/navbar/Navbar';
import IPCHandlers from './util/IPCHandlers';
import Tasks from './pages/tasks/Tasks';
import Login from './pages/login/Login'
import CreateTask from './pages/createtask/CreateTask';
import Options from './pages/options/Options'

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/Login' && location.pathname !== '/addTask'){
      const ipcHandlers = new IPCHandlers(dispatch);
      ipcHandlers.start();
    }
  }, []);

  return (
    <div className='JDSS_App-container'>
      {location.pathname !== '/Login' && location.pathname !== '/addTask' && <Navbar />}
      <div className='JDSS_App-container_body'>
        <Routes basename={process.env.PUBLIC_URL}>
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addTask" element={<CreateTask />} />
          <Route path="/options" element={<Options />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
