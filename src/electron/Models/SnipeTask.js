const Sniper = require('../Util/Sniper');
const TimeUtil = require('../Util/TimeUtil');
const TaskManager = require('../Util/TaskManager');
class SnipeTask {
    constructor(snipeName, availabilityMillis, mainWindow, accountManager, times) {
      this.snipeName = snipeName;
      this.availabilityMillis = availabilityMillis;
      this.status = "🟡";
      this.start();
      this.timeoutID = null;
      this.mainWindow = mainWindow;
      this.accountManager = accountManager;
      this.times = times;
    }


    async start(){
      if (!this.TimeUtil){
        this.TimeUtil = await TimeUtil.createTime();
      }
      this.startTimeout();
    }

    async startTimeout(){
      const startTime = this.times.timeoffset.start;
      let remainingTime = this.availabilityMillis - this.TimeUtil.getMillis();
      if (remainingTime + startTime > 60000){
        this.timeoutID = setTimeout(() => this.startTimeout(), 50000);
        return;
      }
      else if (remainingTime + startTime > 10000){
        this.timeoutID = setTimeout(() => this.startTimeout(), 8000);
        return;
      }
      else if(remainingTime + startTime > 2000){
        this.timeoutID = setTimeout(() => this.startTimeout(), Math.abs(remainingTime + startTime - 500));
        return;
      }
      else{
        const result = await Sniper.snipeName(this);
        if (result){
          this.status = "🟢";
          this.mainWindow.webContents.send('update-task', TaskManager.convertTaskToDTO(this));
        }
        else{
          this.status = "🔴";
          this.mainWindow.webContents.send('update-task', TaskManager.convertTaskToDTO(this));
        }
      }
    }
    formatTimeWithMilliseconds(date) {
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    
      return `${hours}:${minutes}:${seconds}:${milliseconds}`;
    }

    removeTask(){
      clearTimeout(this.timeoutID);
    }

  }
  module.exports = SnipeTask;