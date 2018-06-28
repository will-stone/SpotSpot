import electron from 'electron'
import { spawn } from 'child_process'
import React, { Component } from 'react'
import { css } from 'emotion'
import { getTrack, getPlayerState, getIsRunning } from '../utils/spotify'
import Logo from './components/Logo'
import { Spring, Transition } from 'react-spring'

const wrapperStyle = css`
  height: 100%;
  width: 100%;
`

const trackWrapperStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
`

const trackDetailsStyle = css`
  opacity: 0.9;
  width: 100%;
  height: 70%;
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5%;
`

const controlsStyle = css`
  opacity: 0.9;
  width: 100%;
  height: 30%;
  background-color: black;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5%;
`

const INITIAL_STATE = {
  playerState: 'stopped', // stopped || paused || playing
  track: {
    id: '',
    name: '',
    artist: '',
    artwork_url: '',
  },
  loaded: false,
  showTrackDetails: false,
}

class App extends Component {
  state = INITIAL_STATE

  componentDidMount() {
    this.setupInitialState()
    this.registerEventListeners()

    setTimeout(() => {
      this.setState({ loaded: true })
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
      this.setDetails(playerState)
    })
  }

  setDetails = async playerState => {
    const track =
      playerState === 'stopped' ? INITIAL_STATE.track : await getTrack()
    this.setState({
      track,
      playerState,
    })
  }

  handleLogoClick = async () => {
    const isRunning = await getIsRunning()
    if (!isRunning) {
      spawn('open', ['-a', 'spotify'])
    }
  }

  handleMouseEnter = () => {
    this.setState({
      showTrackDetails: true,
    })
  }

  handleMouseLeave = () => {
    this.setState({
      showTrackDetails: false,
    })
  }

  render() {
    const { track, playerState, loaded, showTrackDetails } = this.state
    const { id, name, artist, artwork_url } = track
    // const { enter, enterActive, exit, exitActive } = fadeStyles

    const showLogo = !loaded || playerState === 'stopped'

    return (
      <div
        className={wrapperStyle}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Transition
          keys={showLogo ? 'logo' : id}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {showLogo
            ? styles => <Logo key="logo" style={styles} />
            : styles => (
                <div
                  key={id}
                  className={trackWrapperStyle}
                  style={{
                    ...styles,
                    backgroundImage: `url(${artwork_url})`,
                  }}
                >
                  <Spring
                    to={{
                      transform: `translateY(${
                        showTrackDetails ? '0%' : '-100%'
                      })`,
                    }}
                  >
                    {styles => (
                      <div style={styles} className={trackDetailsStyle}>
                        <div>{artist}</div>
                        <div>{name}</div>
                      </div>
                    )}
                  </Spring>
                  <Spring
                    to={{
                      transform: `translateY(${
                        showTrackDetails ? '0%' : '100%'
                      })`,
                    }}
                  >
                    {styles => (
                      <div style={styles} className={controlsStyle}>
                        <div>{playerState}</div>
                      </div>
                    )}
                  </Spring>
                </div>
              )}
        </Transition>
      </div>
    )
  }
}

export default App
