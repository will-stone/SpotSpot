import { spawn } from 'child_process'
import electron from 'electron'
import { css, cx } from 'emotion'
import React, { Component } from 'react'
import { Spring, Transition } from 'react-spring'
import { GREEN } from '../config'
import {
  getIsRunning,
  getPlayerState,
  getTrack,
  previous,
  playPause,
  next,
} from '../utils/spotify'
import Logo from './components/Logo'

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
  flex-basis: 30%;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: space-around;
  padding: 0 10%;

  button {
    transition: opacity 100ms linear;
    opacity: 0.5;
    color: white;
    border: 0;
    outline: none;
    background-color: transparent;
    font-size: calc(18px + (24 + 18) * (100vw - 100px) / (400 - 100));
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    &:active {
      opacity: 0.5;
    }
  }
`

const clampStyle = css`
  display: -webkit-box;
  overflow: hidden;
  cursor: default;
  text-overflow: ellipsis;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`

const trackNameStyle = css`
  padding: 2%;
`

const artistStyle = css`
  color: ${GREEN};
  padding: 2%;
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
  mouseEnter: false,
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

  handleSpotifyClick = () => spawn('open', ['-a', 'spotify'])

  handleMouseEnter = () => {
    clearTimeout(this.timeout)
    this.setState({
      mouseEnter: true,
    })
  }

  handleMouseLeave = () => {
    this.timeout = setTimeout(() => {
      this.setState({
        mouseEnter: false,
      })
    }, 2000)
  }

  handleButtonDoubleClick = e => e.stopPropagation()

  render() {
    const { track, playerState, loaded, mouseEnter } = this.state
    const { id, name, artist, artwork_url } = track

    const showLogo = !loaded || playerState === 'stopped'

    return (
      <div
        className={wrapperStyle}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onDoubleClick={this.handleSpotifyClick}
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
                      transform: `translateY(${mouseEnter ? '0%' : '-100%'})`,
                    }}
                  >
                    {styles => (
                      <div style={styles} className={trackDetailsStyle}>
                        <div className={cx(clampStyle, trackNameStyle)}>
                          {name}
                        </div>
                        <div className={cx(clampStyle, artistStyle)}>
                          {artist}
                        </div>
                      </div>
                    )}
                  </Spring>
                  <Spring
                    to={{
                      transform: `translateY(${mouseEnter ? '0%' : '100%'})`,
                    }}
                  >
                    {styles => (
                      <div style={styles} className={controlsStyle}>
                        <button
                          onClick={previous}
                          onDoubleClick={this.handleButtonDoubleClick}
                        >
                          <i className="fa fa-step-backward" />
                        </button>
                        <button
                          onClick={playPause}
                          onDoubleClick={this.handleButtonDoubleClick}
                        >
                          {playerState === 'playing' ? (
                            <i className="fa fa-pause" />
                          ) : (
                            <i className="fa fa-play" />
                          )}
                        </button>
                        <button
                          onClick={next}
                          onDoubleClick={this.handleButtonDoubleClick}
                        >
                          <i className="fa fa-step-forward" />
                        </button>
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
