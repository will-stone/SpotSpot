import {
  app,
  BrowserWindow,
  Menu,
  Rectangle,
  systemPreferences,
  Tray,
} from 'electron'
import Store from 'electron-store'
import path from 'path'

import { BLACK } from '../config'

// Autp update
// require('update-electron-app')({
//   repo: 'will-stone/SpotSpot',
// })

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const store = new Store()

const DEFAULT_BOUNDS: Rectangle = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
}

const bounds = store.get('bounds', DEFAULT_BOUNDS) as Rectangle

// Prevents garbage collection
let bWindow: Electron.BrowserWindow | undefined
let tray: Tray | undefined

function createMainWindow() {
  bWindow = new BrowserWindow({
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
    icon: path.join(__dirname, '/static/icon/icon.png'),
    focusable: false,
    frame: false,
    resizable: true,
    // prevents flash of white
    show: false,
    title: 'SpotSpot',
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    backgroundColor: BLACK,
  })

  // and load the index.html of the app.
  bWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Menubar icon
  tray = new Tray(path.join(__dirname, '/static/icon/tray_iconTemplate.png'))
  tray.setPressedImage(
    path.join(__dirname, '/static/icon/tray_iconHighlight.png'),
  )
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'About',
      click: app.showAboutPanel,
    },
    {
      label: 'Quit',
      click() {
        app.quit()
      },
    },
  ])
  tray.setToolTip('SpotSpot')
  tray.setContextMenu(contextMenu)

  // Open the DevTools.
  if (process.env.ENV === 'DEV') {
    bWindow.webContents.openDevTools({ mode: 'detach' })
  }

  // Hide dock icon
  app.dock.hide()

  // Move window across desktops when switching
  bWindow.setVisibleOnAllWorkspaces(true)

  // Maintain square window ratio
  bWindow.setAspectRatio(1, { width: 0, height: 0 })

  // Only show window when it's ready; prevents flash of white
  bWindow.on('ready-to-show', () => {
    bWindow?.show()
  })

  // Emitted when the window is closed.
  bWindow.on('closed', () => {
    bWindow = undefined
  })

  bWindow.on('resize', () => {
    const mainWindowBounds = bWindow?.getBounds() || DEFAULT_BOUNDS
    store.set('bounds', mainWindowBounds)
  })

  bWindow.on('moved', () => {
    const mainWindowBounds = bWindow?.getBounds() || DEFAULT_BOUNDS
    store.set('bounds', mainWindowBounds)
  })
}

// System events
systemPreferences.subscribeNotification(
  'com.spotify.client.PlaybackStateChanged',
  (_, { 'Player State': playerState }) => {
    if (typeof playerState === 'string') {
      bWindow?.webContents.send(
        'PlaybackStateChanged',
        playerState.toLowerCase(),
      )
    }
  },
)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow)
