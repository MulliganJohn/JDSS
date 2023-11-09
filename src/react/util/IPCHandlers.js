import { addToAccounts, removeFromAccounts } from '../../redux/actions/accountsActions';
import { addToTasks, removeFromTasks, updateTaskStatus } from '../../redux/actions/tasksActions';
import {updateOptions} from '../../redux/actions/optionsActions'

export default class IPCHandlers {
  constructor(dispatch) {
    this.dispatch = dispatch;
    console.log("ipc handler started");
  }
    async start(){
      window.electronAPI.onNewAccount((_event, account) => {
        this.dispatch(addToAccounts(account));
      });

      window.electronAPI.onRemovedAccount((_event, accountID) => {
        this.dispatch(removeFromAccounts(accountID));
      });

      window.electronAPI.onNewTask((_event, TaskDto) => {
        this.dispatch(addToTasks(TaskDto));
      });

      window.electronAPI.onRemovedTask((_event, accountID) => {
        this.dispatch(removeFromTasks(accountID));
      });

      window.electronAPI.onUpdatedTask((_event, taskDTO) => {
        this.dispatch(updateTaskStatus(taskDTO));
      });

      window.electronAPI.onUpdatedOptions((_event, optionsDTO) =>{
        this.dispatch(updateOptions(optionsDTO));
      })
    }

    stop(){

    }
  }