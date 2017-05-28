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
const openSpotify = document.getElementById('js-open-spotify')

// Components
const art = document.getElementById('art')
const trackArtist = document.getElementById('trackArtist')
const trackName = document.getElementById('trackName')

/**
 * Update UI with album art, artist, and track info
 */
const setTrackDetails = () =>
  spotify.getTrack((err, track) => {
    if (track) {
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
    } else {
      populateDetails() // this catches a bug in the notification listener when closing Spotify
    }
  })

/**
 * Update UI play / pause icon based on current player state
 */
const setState = () =>
  spotify.getState((err, state) => {
    if (state) {
      switch (state.state) {
        case 'playing':
          playPauseIcon.classList.remove('icon-play')
          playPauseIcon.classList.add('icon-pause')
          wrapper.classList.remove('is-paused')
          break
        case 'paused':
          playPauseIcon.classList.remove('icon-pause')
          playPauseIcon.classList.add('icon-play')
          wrapper.classList.add('is-paused')
          break
        default:
          break
      }
    }
  })

/**
 * Populate the details for the UI. (the loader script)
 */
const populateDetails = () => {
  spotify.isRunning((err, isRunning) => {
    if (isRunning) {
      wrapper.classList.remove('spotify-not-open')
      setTrackDetails()
      setState()
    } else {
      wrapper.classList.add('spotify-not-open')
    }
  })
}

// Load...
populateDetails()

// Listen for track/status changes and update
electron.ipcRenderer.on('notification', function(event, message) {
  populateDetails()
})

// Bind actions to controls
previous.addEventListener('click', () => spotify.previous())
playPause.addEventListener('click', () => spotify.playPause())
next.addEventListener('click', () => spotify.next())

openSpotify.addEventListener('click', () => spotify.playPause())

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
