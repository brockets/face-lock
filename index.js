const { app, Menu, Tray } = require("electron");
const path = require("path");
const lockSystem = require("lock-system");

let tray = null;

app.dock.hide();

app.on("ready", () => {
  tray = new Tray(path.join("red.ico"));

  tray.on("click", function(event) {
    lockSystem();
  });

  tray.setToolTip("This is my application.");

  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" }
  ]);
  tray.setContextMenu(contextMenu);
});
