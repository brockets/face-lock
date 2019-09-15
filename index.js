const { app, BrowserWindow, Tray } = require("electron");
const lockSystem = require("lock-system");
const constants = require("./constants");

let tray;
let mainWindow;

function createTray() {
  tray = new Tray(constants.SAFE_ICON);

  tray.on("click", function() {
    tray.setImage(constants.LOCK_ICON);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadFile("index.html");
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// lockSystem();

app.on("ready", () => {
  app.dock && app.dock.hide();
  createTray();
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
