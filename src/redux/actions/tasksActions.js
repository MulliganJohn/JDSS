export const addToTasks = (taskDTO) => {
    return {
      type: 'ADD_TO_TASKS',
      payload: taskDTO
    };
  };
  
  export const removeFromTasks = (taskName) => {
    return {
      type: 'REMOVE_FROM_TASKS',
      payload: taskName
    };
  };

  export const updateTaskStatus = (taskDTO) => ({
    type: 'UPDATE_TASK_STATUS',
    payload: taskDTO,
  });