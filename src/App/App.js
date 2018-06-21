import electron from 'electron'
import React, { Component } from 'react'
import spotify from 'spotify-node-applescript'

class App extends Component {
  state = {
    playerState: 'stopped' // stopped || paused || playing
  }

  componentDidMount() {
    spotify.isRunning((err, isRunning) => {
      if (isRunning) {
        spotify.getTrack((err, track) => console.log('track', track))
        spotify.getState((err, { state: playerState } = {}) =>
          this.setState({ playerState })
        )
      }
    })

    electron.ipcRenderer.on('PlaybackStateChanged', (event, playerState) =>
      this.setState({ playerState })
    )
  }

  render() {
    const { playerState } = this.state
    console.log(playerState)

    return <div>{playerState}</div>
  }
}

export default App
