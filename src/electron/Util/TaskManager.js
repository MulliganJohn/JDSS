class TaskManager {

    constructor(){
        this.tasks = new Map();
    }

    static convertTaskToDTO(task){
        const taskDTO = {
            snipe_name: task.snipeName,
            availability_millis: task.availabilityMillis,
            status: task.status
        };
        return taskDTO;
    }

    //Need to have some key system if adding more types of tasks.
    addTask(task){
        this.tasks.set(task.snipeName.toLowerCase(), task);
    }

    get(taskName){
        return this.tasks.get(taskName.toLowerCase());
    }
    has(taskName){
        return this.tasks.has(taskName.toLowerCase());
    }

    removeTask(taskName){
        if (this.tasks.has(taskName.toLowerCase())){
            this.tasks.get(taskName.toLowerCase()).removeTask();
            this.tasks.delete(taskName.toLowerCase());
            return true;
        }
        else{
            return false;
        }
    }
}
module.exports = TaskManager