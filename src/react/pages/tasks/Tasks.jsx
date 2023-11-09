import React from 'react'
import './tasks.css'
import TaskTable from '../../components/tasktable/TaskTable';
import { useSelector } from 'react-redux';
import PageHeader from '../../components/pageheader/PageHeader';
import ContextMenu from '../../components/contextmenu/ContextMenu'
import useContextMenu from '../../hooks/useContextMenu';
import trashico from '../../assets/trash.png';

const Tasks = () => {
  const {
    showContextMenu,
    contextMenuPosition,
    contextMenuTask,
    contextMenuRef,
    handleTaskContextMenu,
    setShowContextMenu
  } = useContextMenu();
  const data = useSelector((state) => state.tasks);
  const items = [
    { id: 1, icon: trashico, alt: "trashico", label: 'Remove Task' }
  ]

  const CreateTask = async () => {
    window.electronAPI.createTaskWindow();
  };

  return (
    <div className='JDSS_Tasks_Page' onContextMenu={handleTaskContextMenu}>
      {showContextMenu && contextMenuPosition && (
        <ContextMenu
          ref={contextMenuRef}
          task={contextMenuTask}
          style={{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`
          }}
          items={items}
          setShowContextMenu={setShowContextMenu}
        />
      )}
        <PageHeader Page="Tasks"/>
        <header className='JDSS_Tasks_Page_Header'>
            <h1>Tasks</h1>
            <button className='JDSS_Task_Page_CreateTask_Button' onClick={CreateTask}>Create Task</button>
        </header>
        <div className='JDSS_Tasks_Page_Body'>
            <TaskTable data={data}/>
        </div>
    </div>
  )
}

export default Tasks