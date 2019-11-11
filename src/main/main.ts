import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  Rectangle,
  systemPreferences,
  Tray,
} from 'electron'
import Store from 'electron-store'
import { SpotifyPlayingState } from 'spotify-node-applescript'

import { BLACK } from '../config'
import eventEmitter from '../utils/eventEmitter'

// Autp update
// require('update-electron-app')({
//   repo: 'will-stone/SpotSpot',
// })

const store = new Store()

const DEFAULT_BOUNDS: Rectangle = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
}

const bounds = store.get('bounds', DEFAULT_BOUNDS) as Rectangle

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null = null

let tray = null

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    minWidth: 100,
    maxWidth: 400,
    height: bounds.height,
    minHeight: 100,
    maxHeight: 400,
    acceptFirstMouse: true,
    alwaysOnTop: true,
    icon: `${__dirname}/static/icon/icon.png`,
    focusable: false,
    frame: false,
    resizable: true,
    show: false, // prevents flash of white
    title: 'SpotSpot',
    webPreferences: {
      nodeIntegration: true,
      // @ts-ignore
      // eslint-disable-next-line no-undef
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    backgroundColor: BLACK,
  })

  // and load the index.html of the app.
  // @ts-ignore
  // eslint-disable-next-line no-undef
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Menubar icon
  tray = new Tray(`${__dirname}/static/icon/tray_iconTemplate.png`)
  const pressedImage = nativeImage.createFromPath(
    `${__dirname}/static/icon/tray_iconHighlight.png`,
  )
  tray.setPressedImage(pressedImage)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'About',
      click: app.showAboutPanel,
    },
    {
      label: 'Quit',
      click: function() {
        app.quit()
      },
    },
  ])
  tray.setToolTip('SpotSpot')
  tray.setContextMenu(contextMenu)

  // Open the DevTools.
  if (process.env.ENV === 'DEV') {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  // Hide dock icon
  app.dock.hide()

  // Move window across desktops when switching
  mainWindow.setVisibleOnAllWorkspaces(true)

  // Maintain square window ratio
  mainWindow.setAspectRatio(1.0, { width: 0, height: 0 })

  // Only show window when it's ready; prevents flash of white
  mainWindow.on('ready-to-show', () => {
    mainWindow && mainWindow.show()
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.on('resize', () => {
    const mainWindowBounds =
      (mainWindow && mainWindow.getBounds()) || DEFAULT_BOUNDS
    store.set('bounds', mainWindowBounds)
  })

  mainWindow.on('moved', () => {
    const mainWindowBounds =
      (mainWindow && mainWindow.getBounds()) || DEFAULT_BOUNDS
    store.set('bounds', mainWindowBounds)
  })

  eventEmitter.on(
    'PlaybackStateChanged',
    (playerState: SpotifyPlayingState) => {
      mainWindow &&
        mainWindow.webContents.send(
          'PlaybackStateChanged',
          playerState.toLowerCase(),
        )
    },
  )
}

// System events
systemPreferences.subscribeNotification(
  'com.spotify.client.PlaybackStateChanged',
  (_, { 'Player State': playerState }) => {
    eventEmitter.emit('PlaybackStateChanged', playerState)
  },
)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow)
