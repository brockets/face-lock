const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const lockSystem = require("lock-system");
const constants = require("./constants");

let tray;
let mainWindow;

let timer;
let lockDelay;

let menuTemplate = [
  {
    label: "Remember me",
    type: "checkbox",
    click: () => {
      mainWindow.webContents.send("take-photo");
      menuTemplate[0].label = "Photo taken";
      menuTemplate[0].checked = true;
      menuTemplate[0].enabled = false;
      tray.setContextMenu(Menu.buildFromTemplate(menuTemplate));
    }
  },
  { type: "separator" },
  {
    label: "Lock System",
    click: () => {
      lock();
    }
  },
  { role: "quit", label: "Close" }
];

function createTray() {
  tray = new Tray(constants.SAFE_ICON);
  tray.setContextMenu(Menu.buildFromTemplate(menuTemplate));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  });

  mainWindow.loadFile("index.html");
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function lock() {
  timer = clearInterval(timer);
  tray.setImage(constants.LOCK_ICON);
  lockDelay = setTimeout(lockSystem, 3000);
}

ipcMain.on("watcher-detected", () => {
  if (timer && !lockDelay) {
    lock();
  }
  if (!lockDelay) {
    tray.setImage(constants.WATCHER_ICON);
  }
});

ipcMain.on("you-are-safe", () => {
  if (timer) {
    timer = clearInterval(timer);
  }
  if (lockDelay) {
    lockDelay = clearTimeout(lockDelay);
  }
  tray.setImage(constants.SAFE_ICON);
});

ipcMain.on("user-afk", () => {
  if (!timer && !lockDelay) {
    let ticks = 10;
    timer = setInterval(() => {
      tray.setImage(constants.NUMBER_ICONS[--ticks]);
      if (ticks <= 0) {
        lock();
      }
    }, 2000);
  }
});

app.on("ready", () => {
  app.dock && app.dock.hide();
  createTray();
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
