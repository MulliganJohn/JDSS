const Auth = require('../Services/Auth');
const Store = require('../Services/Store.js');
const Account = require('../Models/Account.js');
const AccountManager = require('./AccountManager.js');
const Sniper = require('./Sniper.js')
const TaskManager = require('./TaskManager.js');
const { BrowserWindow, ipcMain, app} = require("electron");
const path = require('path');
const SnipeTask = require('../Models/SnipeTask');
const fs = require('fs');
const url = require("url");


class IPCHandlers{
    constructor(accountManager, mainWindow, taskManager){
        this.mainWindow = mainWindow;
        this.accountManager = accountManager;
        this.taskManager = taskManager;
        this.start();
        this.options = {
          timeoffset: {start: -500, stop: 500},
          importing: false,
          accountTxtPath: '',
        };
    }
    async start(){
        ipcMain.handle('login', async (_event, username, password) => {
            try{
              console.log("got login");
              if (this.accountManager.doesUsernameExist(username)){
                return "Username Already Exists";
              }
              const newAccount = new Account(username, password);
              await Auth.login(newAccount);
              this.mainWindow.webContents.send('add-account', AccountManager.convertAccountToDTO(newAccount));
              this.accountManager.addAccount(newAccount);
              return true;
            }
            catch (error){
              return "Invalid Login Details";
            }
        })

        ipcMain.handle('saveOptions', async (_event, optionsDTO) => {
            try{
              this.options.timeoffset.start = parseInt(optionsDTO.timeoffset.start);
              this.options.timeoffset.stop = parseInt(optionsDTO.timeoffset.stop);
              this.mainWindow.webContents.send('update-options', this.options);
              return true;
            }
            catch (error){
              console.log(error);
              this.options = {
                timeoffset: {start: -500, stop: 500}
              };
              this.mainWindow.webContents.send('update-options', this.options);
              return false;
            }
        })

        ipcMain.handle('importAccounts', async (_event, accountTxtPath) => {
            try{
              this.options.importing = true;
              this.options.accountTxtPath = accountTxtPath;
              this.mainWindow.webContents.send('update-options', this.options);
              const loginArray = IPCHandlers.getLoginArray(accountTxtPath);
              await IPCHandlers.loginList(loginArray, this.accountManager, this.mainWindow);
              this.options.importing = false;
              this.options.accountTxtPath = '';
              this.mainWindow.webContents.send('update-options', this.options);
              return true;
            }
            catch (error){
              console.log(error);
              this.options.importing = false;
              this.options.accountTxtPath = '';
              this.mainWindow.webContents.send('update-options', this.options);
              return false;
            }
        })

        ipcMain.on('remove-account', async (_event, accountID) => {
            if (this.accountManager.removeAccount(accountID)){
              this.mainWindow.webContents.send('remove-account', accountID);
            }
            else{
              console.error("Account Mismatch between render and backend!");
              this.mainWindow.webContents.send('remove-account', accountID);
            }
            if (this.accountManager.accounts.size <= 0){
              const taskNameArray = Array.from(this.taskManager.tasks.keys());
              taskNameArray.forEach(taskName => this.taskManager.removeTask(taskName));
              taskNameArray.forEach(taskName => this.mainWindow.webContents.send('remove-task', taskName));
            }
        })

        ipcMain.on('remove-task', async (_event, taskName) => {
            if (this.taskManager.removeTask(taskName)){
              this.mainWindow.webContents.send('remove-task', taskName);
            }
            else{
              console.error("Task Mismatch between render and backend!");
              this.mainWindow.webContents.send('remove-task', taskName);
            }
        })

        ipcMain.handle('createSnipeTask', async (_event, requestedName, availabilityMillis) => {
            try{
              if (this.taskManager.has(requestedName)){
                return "This name has an ongoing task!";
              }
              if (this.accountManager.accounts.size <= 0){
                return "You need to add an account before creating a task!"
              }
              const newTask = new SnipeTask(requestedName, availabilityMillis, this.mainWindow, this.accountManager, this.options);
              this.mainWindow.webContents.send('add-task', TaskManager.convertTaskToDTO(newTask));
              this.taskManager.addTask(newTask);
              return true;
            }
            catch (error){
              console.log(error);
              return "Invalid Login Details";
            }
        })

        ipcMain.handle('getAvailMillis', async (_event, requestedName) => {
          try{
            const availability = await Sniper.getAvailabilityMillis(requestedName);
            return availability;
          }
          catch (error){
            return false;
          }
        })
        
        ipcMain.on('minimizeWindow', (event) => {
          const currentWindow = BrowserWindow.fromWebContents(event.sender);
          if (currentWindow) {
            currentWindow.minimize();
          }
        })

        ipcMain.on('shutdown', (event) => {
          event.sender.close();
        })

        ipcMain.on('createLoginWindow', async () => {
          const mainWindow = new BrowserWindow({
            width: 250,
            height: 300,
            frame: false,
            resizable: false,
            alwaysOnTop: true,
            webPreferences: {
              preload: path.join(__dirname, "../preload.js"),
              contextIsolation: true,
            },
            icon: path.join(__dirname,"../../../public/jdsslogotestnew.ico")
          });
          const appURL = app.isPackaged
          ? url.format({
              pathname: path.join(__dirname, "../../../build/index.html"),
              hash: '#/Login',
              protocol: "file:",
              slashes: true,
            })
          : "http://localhost:3000/Login";
          mainWindow.loadURL(appURL);
        })

        ipcMain.on('createTaskWindow', (_event) => {
          const mainWindow = new BrowserWindow({
            width: 250,
            height: 300,
            frame: false,
            resizable: false,
            alwaysOnTop: true,
            webPreferences: {
              preload: path.join(__dirname, "../preload.js"),
              contextIsolation: true,
            },
            icon: path.join(__dirname,"../../../public/jdsslogotestnew.ico")
          });
          const appURL = app.isPackaged
          ? url.format({
              pathname: path.join(__dirname, "../../../build/index.html"),
              hash: '#/addTask',
              protocol: "file:",
              slashes: true,
            })
          : "http://localhost:3000/addTask";
          mainWindow.loadURL(appURL);
        })
    }

    static async loginList(accountArray, accountManager, mainWindow){
      for (const { username, password } of  accountArray){
        try{
          if (!accountManager.doesUsernameExist(username)){
            const newAccount = new Account(username, password);
            await Auth.login(newAccount);
            mainWindow.webContents.send('add-account', AccountManager.convertAccountToDTO(newAccount));
            accountManager.addAccount(newAccount);
          }
          await Sniper.sleep(5000);
        }
        catch (error){
          await Sniper.sleep(5000);
        } 
      }
      return true;
    }

    static getLoginArray(filename){
      try {
        const fileContents = fs.readFileSync(filename, 'utf-8');
        const lines = fileContents.split('\n');
        
        const userPassArray = lines.map(line => {
          const [user, pass] = line.split(':');
          return { username: user.trim(), password: pass.trim() };
        });
        
        return userPassArray;
      } catch (err) {
        console.error('Error reading or parsing the file directory provided!');
        return [];
      }
    }
}
module.exports = IPCHandlers