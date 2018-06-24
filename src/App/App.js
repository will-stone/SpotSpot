import electron from 'electron'
import React, { Component } from 'react'
import spotify from 'spotify-node-applescript'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { css } from 'emotion'

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
  `
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
    name: '',
    artist: '',
    artwork_url: ''
  }

  componentDidMount() {
    this.setupInitialState()
    this.registerEventListeners()
  }

  setupInitialState = () => {
    spotify.isRunning((err, isRunning) => {
      if (isRunning) {
        spotify.getTrack((err, { artist, name, artwork_url }) => {
          this.setState({ artist, name, artwork_url })
        })
        spotify.getState((err, { state: playerState } = {}) =>
          this.setState({ playerState })
        )
      }
    })
  }

  registerEventListeners = () => {
    electron.ipcRenderer.on(
      'PlaybackStateChanged',
      (event, { playerState } = {}) => {
        spotify.getTrack((err, { artist, name, artwork_url } = {}) => {
          this.setState({ playerState, artist, name, artwork_url })
        })
      }
    )
  }

  render() {
    const { playerState, name, artist, artwork_url } = this.state
    const { enter, enterActive, exit, exitActive } = fadeStyles

    return (
      <TransitionGroup component={null}>
        <CSSTransition
          key={artwork_url}
          timeout={500}
          classNames={{
            enter,
            enterActive,
            exit,
            exitActive
          }}
        >
          <div
            className={wrapperStyle}
            style={{
              backgroundImage: `url(${artwork_url})`
            }}
          >
            <div>{playerState}</div>
            <div>{artist}</div>
            <div>{name}</div>
          </div>
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

export default App
