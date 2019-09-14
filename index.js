const { app, nativeImage, Tray, BrowserWindow } = require("electron");
const lockSystem = require("lock-system");
const path = require("path");

const greenEye = nativeImage.createFromPath(path.join("green.png"));
const redEye = nativeImage.createFromPath(path.join("red.png"));

const AFK_DELAY = 1000;

let mainWindow = null;
let tray = null;

function createTray() {
  tray = new Tray(nativeImage.createEmpty());
}

function createWindow() {
  mainWindow = new BrowserWindow({
    modal: true,
    width: 430,
    height: 270,
    // resizable: false,
    maximizable: false,
    minimizable: false,
    alwaysOnTop: true,
    center: true,
    show: false,
    titleBarStyle: "hidden"
  });
  mainWindow.loadFile("index.html");

  mainWindow.on("close", e => {
    mainWindow.hide();
    e.preventDefault();
  });
}

function setEye(icon) {
  tray.setTitle("oko ci w dupe");
  tray.setImage(icon);

  tray.on("click", function(event) {
    lockSystem();
    setEye(redEye);
  });
}

app.on("ready", x => {
  // Hide app dock icon.
  app.dock && app.dock.hide();
  // Create Renderer Window
  createWindow();
  // Create System Tray entry and menu
  createTray();

  setEye(greenEye);
});
