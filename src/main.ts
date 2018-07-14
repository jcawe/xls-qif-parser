import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import * as path from "path";
import * as url from "url";
import { QifFile } from "./Models/QifFile";

let mainWindow: Electron.BrowserWindow;
const menuTemplate = {
  label: "DevTools",
  submenu: [
    {
      role: "reload",
    },
    {
      label: "Open Devpanel",
      click(item, focusedWindow) {
        focusedWindow.webContents.openDevTools();
      },
    },
  ],
};

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ show: false });

  mainWindow.setMenu(Menu.buildFromTemplate([
    menuTemplate,
  ]));

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "../views/index.html"),
    protocol: "file:",
    slashes: true,
  }));

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function createModalWindow(viewPath: string): Electron.BrowserWindow {
  let auxWindow = new BrowserWindow({ parent: mainWindow, modal: true, show: false });
  auxWindow.webContents.loadURL(url.format({
    pathname: path.join(__dirname, viewPath),
    protocol: "file:",
    slashes: true,
  }));
  auxWindow.on("closed", () => { auxWindow = null; });
  auxWindow.setMenu(Menu.buildFromTemplate([
    menuTemplate,
  ]));

  auxWindow.once("ready-to-show", () => auxWindow.show());
  auxWindow.on("close", () => auxWindow.webContents.send("close"));
  return auxWindow;
}

ipcMain.on("window:detail", (e, text: string, file: QifFile) => {
  const win = createModalWindow("../views/detail.html");

  win.webContents.once("dom-ready", () => {
    console.log("READY");
    win.webContents.send("load", text, file);
  });
});

ipcMain.on("update:file", (e, file: QifFile, filename: string) => {
  mainWindow.webContents.send("update:file", file, filename);
});
