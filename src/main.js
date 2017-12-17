import { app, BrowserWindow, Tray, Menu, systemPreferences } from 'electron'
import openAboutWindow from 'about-window'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let tray = null

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 50,
    minWidth: 100,
    maxWidth: 400,
    height: 50,
    minHeight: 100,
    maxHeight: 400,
    acceptFirstMouse: true,
    alwaysOnTop: true,
    icon: `file://${__dirname}/images/icon/icon.png`,
    focusable: false,
    frame: false,
    resizable: true,
    show: false, // prevents flash of white
    title: 'SpotSpot',
    backgroundColor: '#000000',
    type: 'desktop'
  })

  registerNotificationListeners()

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Menubar icon
  tray = new Tray(`${__dirname}/images/icon/tray_iconTemplate.png`)
  tray.setPressedImage(`${__dirname}/images/icon/tray_iconHighlight.png`)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'About',
      click: function() {
        openAboutWindow({
          icon_path: `${__dirname}/images/icon/icon.png`
        })
      }
    },
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

  // Maintain square window ratio
  mainWindow.setAspectRatio(1.0)

  // Only show window when it's ready; prevents flash of white
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

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
app.on('ready', createMainWindow)
