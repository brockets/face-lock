const { nativeImage } = require("electron");
const path = require("path");

module.exports = {
  NUMBER_ICONS: [
    nativeImage.createFromPath(path.resolve("icons/0.png")),
    nativeImage.createFromPath(path.resolve("icons/1.png")),
    nativeImage.createFromPath(path.resolve("icons/2.png")),
    nativeImage.createFromPath(path.resolve("icons/3.png")),
    nativeImage.createFromPath(path.resolve("icons/4.png")),
    nativeImage.createFromPath(path.resolve("icons/5.png")),
    nativeImage.createFromPath(path.resolve("icons/6.png")),
    nativeImage.createFromPath(path.resolve("icons/7.png")),
    nativeImage.createFromPath(path.resolve("icons/8.png")),
    nativeImage.createFromPath(path.resolve("icons/9.png"))
  ],
  WATCHER_ICON: nativeImage.createFromPath(path.resolve("icons/watcher.png")),
  LOCK_ICON: nativeImage.createFromPath(path.resolve("icons/lock.png")),
  SAFE_ICON: nativeImage.createFromPath(path.resolve("icons/safe.png"))
};
