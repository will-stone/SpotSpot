const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  systemPreferences
} = require('electron')

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let tray = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 250,
    height: 70,
    acceptFirstMouse: true,
    alwaysOnTop: true,
    backgroundColor: '#191917',
    icon: path.join(__dirname, 'images/icon/icon.png'),
    frame: false,
    resizable: false,
    title: 'SpotSpot',
    transparent: true
  })

  registerNotificationListeners()

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // Hide dock icon
  app.dock.hide()

  tray = new Tray(path.join(__dirname, 'images/icon/tray_iconTemplate.png'))
  tray.setPressedImage(
    path.join(__dirname, 'images/icon/tray_iconHighlight.png')
  )
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: function() {
        app.quit()
      }
    }
  ])
  tray.setToolTip('SpotSpot')
  tray.setContextMenu(contextMenu)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function registerNotificationListeners() {
  systemPreferences.subscribeNotification(
    'com.spotify.client.PlaybackStateChanged',
    () => mainWindow.webContents.send('notification', 'PlaybackStateChanged')
  )
}

// Set dock icon
// app.dock.setIcon(path.join(__dirname, 'images/icon/icon.png'))

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
