// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron')
const spotify = require('spotify-node-applescript')

const setAlbumDetails = () =>
  spotify.getTrack((err, track) => {
    const art = document.getElementById('art')
    art.style.backgroundImage = `url(${track.artwork_url})`

    const trackArtist = document.getElementById('trackArtist')
    trackArtist.innerText = track.artist

    const trackName = document.getElementById('trackName')
    trackName.innerText = track.name
  })

// Set details on load
setAlbumDetails()

// Listen for track/status changes and update
electron.ipcRenderer.on('notification', function(event, message) {
  setAlbumDetails()
})

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
