const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const printerService = require('./printer-service/printer-service');

var tray = null

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainWindow.loadFile('gui/index.html');
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    tray = new Tray('./img/icon-printer.png')
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Abrir', type: 'normal', click: createWindow },
        { label: 'Cerrar', type: 'normal', click: closeApp }
    ])
    tray.setToolTip('Sistema de impresion de tickets')
    tray.setContextMenu(contextMenu);
    printerService.initialize();
})


app.on('window-all-closed', function () {

})

function closeApp() {
    if (process.platform !== 'darwin') app.quit()
}

//app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
//  if (BrowserWindow.getAllWindows().length === 0) createWindow()
//})
