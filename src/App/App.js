import electron from 'electron'
import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { css } from 'emotion'
import { getTrack, getPlayerState, getIsRunning } from '../utils/spotify'
import Logo from './components/Logo'

const fadeStyles = {
  enter: css`
    opacity: 0.01;
  `,
  enterActive: css`
    opacity: 1;
    transition: opacity 500ms ease-in;
  `,
  exit: css`
    opacity: 1;
  `,
  exitActive: css`
    opacity: 0.01;
    transition: opacity 500ms ease-in;
  `,
}

const wrapperStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
`

class App extends Component {
  state = {
    playerState: 'stopped', // stopped || paused || playing
    track: {
      id: '',
      name: '',
      artist: '',
      artwork_url: '',
    },
    loaded: false,
  }

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
    const track = await getTrack()
    this.setState({
      track,
      playerState,
    })
  }

  render() {
    const { track, playerState, loaded } = this.state
    const { id, name, artist, artwork_url } = track
    const { enter, enterActive, exit, exitActive } = fadeStyles

    const showLogo = !loaded || playerState === 'stopped'

    return (
      <TransitionGroup component={null}>
        <CSSTransition
          key={showLogo ? 'logo' : id}
          timeout={500}
          classNames={{
            enter,
            enterActive,
            exit,
            exitActive,
          }}
        >
          {showLogo ? (
            <Logo />
          ) : (
            <div
              className={wrapperStyle}
              style={{
                backgroundImage: `url(${artwork_url})`,
              }}
            >
              <div>{playerState}</div>
              <div>{artist}</div>
              <div>{name}</div>
            </div>
          )}
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

export default App
