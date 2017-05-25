// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron')
const spotify = require('spotify-node-applescript')
const textFit = require('textFit')

const wrapper = document.getElementById('wrapper')

// Controls
const previous = document.getElementById('previous')
const playPause = document.getElementById('playPause')
const playPauseIcon = document.getElementById('playPauseIcon')
const next = document.getElementById('next')

// Components
const position = document.getElementById('position')
const art = document.getElementById('art')
const trackArtist = document.getElementById('trackArtist')
const trackName = document.getElementById('trackName')

// position timeout placeholder
let positionPollerTimeout = null

/**
 * Update UI with album art, artist, and track info
 */
const setTrackDetails = () =>
  spotify.getTrack((err, track) => {
    // Album art
    art.style.backgroundImage = `url(${track.artwork_url})`
    // Artist
    trackArtist.innerText = track.artist
    // Title
    trackName.innerText = track.name

    // Fit text to boxes
    textFit(document.getElementsByClassName('trackDetails'), {
      multiLine: true,
      minFontSize: 8,
      maxFontSize: 14
    })

    setState(track)
  })

/**
 * Update UI play / pause icon based on current player state
 */
const setState = track =>
  spotify.getState((err, state) => {
    switch (state.state) {
      case 'playing':
        playPauseIcon.classList.remove('fa-play')
        playPauseIcon.classList.add('fa-pause')
        wrapper.classList.remove('is-paused')
        pollPosition(track)
        break
      case 'paused':
        playPauseIcon.classList.remove('fa-pause')
        playPauseIcon.classList.add('fa-play')
        wrapper.classList.add('is-paused')
        clearTimeout(positionPollerTimeout)
        break
      default:
        break
    }
  })

const pollPosition = track => {
  clearTimeout(positionPollerTimeout)
  positionPollerTimeout = setTimeout(() => {
    spotify.getState((err, state) => {
      console.log(track)
      const duration = track.duration
      position.style.transform = `scale(${state.position / track.duration * 1000}, 1)`
      pollPosition(track)
    })
  }, 1000)
}

// On load...
setTrackDetails()

// Listen for track/status changes and update
electron.ipcRenderer.on('notification', function(event, message) {
  setTrackDetails()
})

// Bind actions to controls
previous.addEventListener('click', () => spotify.previous())
playPause.addEventListener('click', () => spotify.playPause())
next.addEventListener('click', () => spotify.next())

// Click to play/pause, this filters-out window drags
// let screenX = null
// let screenY = null
// document.body.addEventListener(
//   'mousedown',
//   e => {
//     console.log('mousedown')
//     screenX = e.screenX
//     screenY = e.screenY
//   },
//   false
// )
// document.body.addEventListener(
//   'mouseup',
//   e => {
//     console.log('mouseup')
//     if (screenX === e.screenX && screenY === e.screenY) {
//       console.log('click')
//       spotify.playPause()
//     } else {
//       console.log('drag')
//     }
//   },
//   false
// )
