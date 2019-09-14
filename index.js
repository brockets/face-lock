const { app, nativeImage, Tray } = require("electron");
const lockSystem = require("lock-system");
const path = require("path");
const canvas = require("canvas");
const faceapi = require("face-api.js");

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const greenEye = nativeImage.createFromPath(path.join("green.png"));
const redEye = nativeImage.createFromPath(path.join("red.png"));

let tray = null;

function createTray() {
  tray = new Tray(nativeImage.createEmpty());
}

function setEye(icon) {
  tray.setTitle("a teraz chuj");
  tray.setImage(icon);

  tray.on("click", function() {
    lockSystem();
    setEye(redEye);
  });
}

app.on("ready", x => {
  app.dock && app.dock.hide();
  createTray();

  setEye(greenEye);
  console.log(faceapi.nets);
});
