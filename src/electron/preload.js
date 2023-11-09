// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");
window.ipcRenderer = require('electron').ipcRenderer;

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
contextBridge.exposeInMainWorld('electronAPI', {
  //Uses 'IPCmain.handle' meaning renderer sends initial login prompt and then expects a return.
  login: (username, password) => ipcRenderer.invoke('login', username, password),
  getAvailMillis: (requestedName) => ipcRenderer.invoke('getAvailMillis', requestedName),
  createSnipeTask: (requestedName, availabilityMillis) => ipcRenderer.invoke('createSnipeTask', requestedName, availabilityMillis),
  saveOptions: (optionsDTO) => ipcRenderer.invoke('saveOptions', optionsDTO),
  importAccounts: (accountTxtPath) => ipcRenderer.invoke('importAccounts', accountTxtPath),
  
  //Uses 'IPCmain.send' meaning backend sends a one way message to renderer.
  onRemovedAccount: (accountID) => ipcRenderer.on('remove-account', accountID),
  onNewTask: (taskDTO) => ipcRenderer.on('add-task', taskDTO),
  onNewAccount: (accountDTO) => ipcRenderer.on('add-account', accountDTO),
  onRemovedTask: (taskName) => ipcRenderer.on('remove-task', taskName),
  onUpdatedTask: (taskDTO) => ipcRenderer.on('update-task', taskDTO),
  onUpdatedOptions: (optionsDTO) => ipcRenderer.on('update-options', optionsDTO),
  
  //Uses 'IPCmain.on' meaning renderer sends a one way message to backend.
  removeTask: (taskName) => ipcRenderer.send('remove-task', taskName),
  minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
  shutdown: () => ipcRenderer.send('shutdown'),
  createLoginWindow: () => ipcRenderer.send('createLoginWindow'),
  createTaskWindow: () => ipcRenderer.send('createTaskWindow'),
  removeAccount: (accountID) => ipcRenderer.send('remove-account', accountID)
})