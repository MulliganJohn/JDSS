import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const useContextMenu = () => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuAccount, setContextMenuAccount] = useState();
  const [contextMenuTask, setContextMenuTask] = useState();
  const contextMenuRef = useRef(null);
  const accounts = useSelector((state) => state.accounts);
  const tasks = useSelector((state) => state.tasks);

  const handleAccountContextMenu = (event) => {
    event.preventDefault(); // Prevent the default browser context menu
    if (event.target.nodeName === 'TD') {
      let posX;
      if (event.clientX > 785) {
        posX = event.clientX - (event.clientX - 785);
      } else {
        posX = event.clientX;
      }
      const posY = event.clientY;
      setContextMenuPosition({ x: posX, y: posY });
      setContextMenuAccount(accounts.find((account) => account.accountID === parseInt(event.target.parentNode.querySelector('td:first-child').textContent)));
      setShowContextMenu(true);
    }
  };

  const handleTaskContextMenu = (event) => {
    event.preventDefault(); // Prevent the default browser context menu
    if (event.target.nodeName === 'TD') {
      let posX;
      if (event.clientX > 785) {
        posX = event.clientX - (event.clientX - 785);
      } else {
        posX = event.clientX;
      }
      const posY = event.clientY;
      setContextMenuPosition({ x: posX, y: posY });
      setContextMenuTask(tasks.find((task) => task.snipe_name === (event.target.parentNode.querySelector('td:first-child').textContent)));
      setShowContextMenu(true);
    }
  };

  const handleClick = (event) => {
    if (!contextMenuRef.current || !contextMenuRef.current.contains(event.target)) {
      // Clicked outside the context menu or its child elements, hide it
      setShowContextMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return {
    showContextMenu,
    contextMenuPosition,
    contextMenuAccount,
    contextMenuTask,
    contextMenuRef,
    handleAccountContextMenu,
    handleTaskContextMenu,
    setShowContextMenu,
  };
};

export default useContextMenu;