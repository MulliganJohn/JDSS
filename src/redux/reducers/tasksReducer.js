const initialState = []; // Initial state for tasks array

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_TASKS':
      return [...state, action.payload]; // Add an item to tasks array
    case 'REMOVE_FROM_TASKS':
      return state.filter(task => task.snipe_name !== action.payload); // Remove an item from tasks array
    case 'UPDATE_TASK_STATUS':
      return state.map(task => {
        if (task.snipe_name === action.payload.snipe_name) {
          // Create a new object with the updated status
          return { ...task, status: action.payload.status };
        }
        return task;
      });
    default:
      return state;
  }
};

export default tasksReducer;