const { app, nativeImage, Tray } = require("electron");
const lockSystem = require("lock-system");
const path = require("path");

const greenEye = nativeImage.createFromPath(path.join("green.png"));
const redEye = nativeImage.createFromPath(path.join("red.png"));

let tray = null;

function createTray() {
  tray = new Tray(nativeImage.createEmpty());
}

function setEye(icon) {
  tray.setTitle("a teraz chuj");
  tray.setImage(icon);

  tray.on("click", function(event) {
    lockSystem();
    setEye(redEye);
  });
}

app.on("ready", x => {
  app.dock && app.dock.hide();
  createTray();

  setEye(greenEye);
});
