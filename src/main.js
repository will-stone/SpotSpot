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
    focusable: false,
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

  // Menubar icon
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
  if (process.env.SPOTSPOT_ENV === 'DEV') {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  // Hide dock icon
  app.dock.hide()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

function registerNotificationListeners() {
  systemPreferences.subscribeNotification(
    'com.spotify.client.PlaybackStateChanged',
    () => mainWindow.webContents.send('notification', 'PlaybackStateChanged')
  )
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
