import { spawn } from 'child_process'
import electron from 'electron'
import React, { Component } from 'react'
import { getIsRunning, getPlayerState, getTrack } from '../utils/spotify'
import App from './App'

const INITIAL_STATE = {
  isControlsTimingOut: false,
  isLoaded: false,
  isMouseOver: false,
  playerState: 'stopped', // stopped || paused || playing
  track: {
    id: '',
    name: '',
    artist: '',
    artwork_url: '',
  },
}

class AppContainer extends Component {
  state = INITIAL_STATE

  componentDidMount() {
    this.setupInitialState()
    this.registerEventListeners()

    setTimeout(() => {
      this.setState({ isLoaded: true })
    }, 3500)
  }

  setupInitialState = async () => {
    const isRunning = await getIsRunning()
    if (isRunning) {
      const [playerState, track] = await Promise.all([
        getPlayerState(), // playerState is not sent from main on load.
        getTrack(),
      ])
      this.setState({
        playerState,
        track,
      })
    }
  }

  registerEventListeners = () => {
    electron.ipcRenderer.on('PlaybackStateChanged', (e, playerState) => {
      this.setDetails(playerState, () => {
        this.showControls()
        this.hideControls()
      })
    })
  }

  setDetails = async (playerState, callback = () => {}) => {
    const track =
      playerState === 'stopped' ? INITIAL_STATE.track : await getTrack()
    this.setState(
      {
        track,
        playerState,
      },
      callback
    )
  }

  showControls = () => {
    clearTimeout(this.detailsTimeout)
    this.setState({
      isControlsTimingOut: true,
    })
  }

  hideControls = () => {
    this.detailsTimeout = setTimeout(() => {
      this.setState({
        isControlsTimingOut: false,
      })
    }, 7000)
  }

  handleDoubleClick = () => spawn('open', ['-a', 'spotify'])

  handleMouseEnter = () => {
    this.setState({ isMouseOver: true })
    this.showControls()
  }

  handleMouseLeave = () => {
    this.setState({ isMouseOver: false })
    this.hideControls()
  }

  render() {
    const {
      isControlsTimingOut,
      isLoaded,
      isMouseOver,
      track,
      playerState,
    } = this.state

    const isPlaying = playerState === 'playing'
    const isPaused = playerState === 'paused'
    const isStopped = playerState === 'stopped'

    const isLogoShown = !isLoaded || isStopped

    const isOverlayShown = isControlsTimingOut || isPaused || isMouseOver

    const isDisplayingPaused = isPaused && !isMouseOver

    return (
      <App
        isLogoShown={isLogoShown}
        isOverlayShown={isOverlayShown}
        isDisplayingPaused={isDisplayingPaused}
        isPlaying={isPlaying}
        onDoubleClick={this.handleDoubleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        track={track}
      />
    )
  }
}

export default AppContainer
