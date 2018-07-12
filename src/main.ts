import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import * as path from "path";
import * as url from "url";
import { convertExcelToQif } from "./index";

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({});

  mainWindow.setMenu(Menu.buildFromTemplate([
    {
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
    },
  ]));

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "../index.html"),
    protocol: "file:",
    slashes: true,
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function switchButton(btn, active) {
  mainWindow.webContents.send("btn:" + btn, active);
}

ipcMain.on("path:excel", (e, path) => switchButton("excel", path === ""));
ipcMain.on("path:qif", (e, path) => switchButton("qif", path === ""));

ipcMain.on("btn:selectExcel", () => {
  dialog.showOpenDialog(mainWindow,
    {
      filters: [
        {name: "Excel", extensions: ["xlsx"]},
      ],
    },
    (filename) => {
      switchButton("excel", filename === undefined);
      mainWindow.webContents.send("path:excel", filename[0]);
    },
  );
});

ipcMain.on("btn:selectQif", () => {
  dialog.showSaveDialog(mainWindow,
    {
      filters: [
        { name: "Qif", extensions: ["qif"] },
      ],
    },
    (filename) => {
      switchButton("qif", filename === undefined);
      mainWindow.webContents.send("path:qif", filename);
    },
  );
});

ipcMain.on("btn:convert", (e, excelPath: string, qifPath: string) => {
  try {
    convertExcelToQif(excelPath, qifPath);
    mainWindow.webContents.send("success");
  } catch (error) {
    mainWindow.webContents.send("error", error.message);
  }
});

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
