import { spawn } from 'child_process'
import { ipcRenderer } from 'electron'
import * as React from 'react'
import { SpotifyPlayingState, TrackInfo } from 'spotify-node-applescript'
import { getIsRunning, getPlayerState, getTrackInfo } from '../utils/spotify'
import App from './App'

interface State {
  isControlsTimingOut: boolean
  isLoaded: boolean
  isMouseOver: boolean
  playerState: SpotifyPlayingState
  track?: TrackInfo
}

const INITIAL_STATE: State = {
  isControlsTimingOut: false,
  isLoaded: false,
  isMouseOver: false,
  playerState: 'stopped',
  track: undefined,
}

class AppContainer extends React.Component<{}, State> {
  state = INITIAL_STATE
  detailsTimeout: NodeJS.Timer

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
        getTrackInfo(),
      ])
      this.setState({
        playerState,
        track,
      })
    }
  }

  registerEventListeners = () => {
    ipcRenderer.on(
      'PlaybackStateChanged',
      (_: unknown, playerState: SpotifyPlayingState) => {
        this.setDetails(playerState, () => {
          this.showControls()
          this.hideControls()
        })
      },
    )
  }

  setDetails = async (
    playerState: SpotifyPlayingState,
    callback = () => {},
  ) => {
    const track =
      playerState === 'stopped' ? INITIAL_STATE.track : await getTrackInfo()
    this.setState(
      {
        track,
        playerState,
      },
      callback,
    )
  }

  showControls = () => {
    clearTimeout(this.detailsTimeout)
    this.setState({
      isControlsTimingOut: true,
    })
  }

  hideControls = () => {
    this.detailsTimeout = global.setTimeout(() => {
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

    return (
      <App
        isLoaded={isLoaded}
        isControlsTimingOut={isControlsTimingOut}
        isPaused={isPaused}
        isMouseOver={isMouseOver}
        isStopped={isStopped}
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
