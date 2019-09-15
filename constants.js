const { nativeImage } = require("electron");
const path = require("path");

module.exports = {
  ONE_ICON: nativeImage.createFromPath(path.join("icons/1.png")),
  TWO_ICON: nativeImage.createFromPath(path.join("icons/2.png")),
  THREE_ICON: nativeImage.createFromPath(path.join("icons/3.png")),
  FOUR_ICON: nativeImage.createFromPath(path.join("icons/4.png")),
  FIVE_ICON: nativeImage.createFromPath(path.join("icons/5.png")),
  SIX_ICON: nativeImage.createFromPath(path.join("icons/6.png")),
  SEVEN_ICON: nativeImage.createFromPath(path.join("icons/7.png")),
  EIGHT_ICON: nativeImage.createFromPath(path.join("icons/8.png")),
  NINE_ICON: nativeImage.createFromPath(path.join("icons/9.png")),

  WATCHER_ICON: nativeImage.createFromPath(path.join("icons/watcher.png")),
  LOCK_ICON: nativeImage.createFromPath(path.join("icons/lock.png")),
  SAFE_ICON: nativeImage.createFromPath(path.join("icons/safe.png"))
};
