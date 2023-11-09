// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const tls = require('tls');
const IPCHandlers = require("../src/electron/Util/IPCHandlers.js");
const AccountManager = require("../src/electron/Util/AccountManager.js");
const TimeUtil = require('../src/electron/Util/TimeUtil.js');
const TaskManager = require("../src/electron/Util/TaskManager.js");

const preferredCipherSuites = [
  'TLS_AES_256_GCM_SHA384',
  'TLS_AES_128_GCM_SHA256',
  'TLS_CHACHA20_POLY1305_SHA256',
  'ECDHE-ECDSA-AES256-GCM-SHA384',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-ECDSA-CHACHA20-POLY1305',
  'ECDHE-RSA-AES256-GCM-SHA384',
  'ECDHE-RSA-CHACHA20-POLY1305',
  'ECDHE-RSA-AES128-GCM-SHA256',
  'DHE-RSA-AES256-GCM-SHA384',
  'DHE-RSA-CHACHA20-POLY1305',
  'DHE-DSS-AES256-GCM-SHA384',
  'DHE-RSA-AES128-GCM-SHA256',
  'DHE-DSS-AES128-GCM-SHA256',
  'ECDHE-ECDSA-AES256-SHA384',
  'ECDHE-RSA-AES256-SHA384',
  'ECDHE-ECDSA-AES128-SHA256',
  'ECDHE-RSA-AES128-SHA256',
  'DHE-RSA-AES256-SHA256',
  'DHE-DSS-AES256-SHA256',
  'DHE-RSA-AES128-SHA256',
  'DHE-DSS-AES128-SHA256',
];
tls.DEFAULT_CIPHERS = preferredCipherSuites.join(':');
let mainWindow;

// Create the native browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 540,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "../src/electron/preload.js"),
      contextIsolation: true,
    },
    icon: path.join(__dirname, "jdsslogotestnew.ico")
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "../build/index.html"),
        hash: '#/accounts',
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000/accounts";
  mainWindow.loadURL(appURL);

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}


// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  const accountManager = new AccountManager();
  const taskManager = new TaskManager();
  const ipcHandler = new IPCHandlers(accountManager, mainWindow, taskManager, app, __dirname);
  TimeUtil.createTime();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

