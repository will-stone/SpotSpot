// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Versions
// console.log('electron', process.versions.electron)
// console.log('chrome', process.versions.chrome)
// console.log('node', process.versions.node)

import electron from 'electron'
import spotify from 'spotify-node-applescript'

// Controls
const previous = document.getElementById('js-previous')
const playPause = document.getElementById('js-playPause')
const playPauseIcon = document.getElementById('js-playPauseIcon')
const next = document.getElementById('js-next')

// Components
const art = document.getElementById('js-art')
const trackArtist = document.getElementById('js-trackArtist')
const trackName = document.getElementById('js-trackName')

const setTrackDetails = ({ artwork_url, artist = '', name = '' } = {}) => {
  art.style.backgroundImage = artwork_url ? `url(${artwork_url})` : ''
  trackArtist.innerText = artist
  trackName.innerText = name
}

const setState = ({ state } = {}) => {
  switch (state) {
    case 'playing':
      playPauseIcon.classList.remove('fa-play')
      playPauseIcon.classList.add('fa-pause')
      document.body.classList.remove('is-paused')
      document.body.classList.add('is-playing')
      break
    case 'paused':
      playPauseIcon.classList.remove('fa-pause')
      playPauseIcon.classList.add('fa-play')
      document.body.classList.add('is-paused')
      document.body.classList.remove('is-playing')
      break
    default:
      break
  }
}

const updateWidget = isRunning => {
  if (isRunning) {
    spotify.getTrack((err, track) => setTrackDetails(track))
    spotify.getState((err, state) => setState(state))
  }
}

// Load...
spotify.isRunning((err, isRunning) => updateWidget(isRunning))

// Listen for track/status changes and update
electron.ipcRenderer.on('notification', function() {
  spotify.isRunning((err, isRunning) => updateWidget(isRunning))
})

// Bind actions to controls
previous.addEventListener('click', () => spotify.previous())
playPause.addEventListener('click', () => spotify.playPause())
next.addEventListener('click', () => spotify.next())
