const { nativeImage } = require("electron");
const path = require("path");

module.exports = {
  NUMBER_ICONS: [
    nativeImage.createFromPath(path.join("icons/0.png")),
    nativeImage.createFromPath(path.join("icons/1.png")),
    nativeImage.createFromPath(path.join("icons/2.png")),
    nativeImage.createFromPath(path.join("icons/3.png")),
    nativeImage.createFromPath(path.join("icons/4.png")),
    nativeImage.createFromPath(path.join("icons/5.png")),
    nativeImage.createFromPath(path.join("icons/6.png")),
    nativeImage.createFromPath(path.join("icons/7.png")),
    nativeImage.createFromPath(path.join("icons/8.png")),
    nativeImage.createFromPath(path.join("icons/9.png"))
  ],
  WATCHER_ICON: nativeImage.createFromPath(path.join("icons/watcher.png")),
  LOCK_ICON: nativeImage.createFromPath(path.join("icons/lock.png")),
  SAFE_ICON: nativeImage.createFromPath(path.join("icons/safe.png"))
};
