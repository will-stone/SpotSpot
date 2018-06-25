import electron from 'electron'
import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { css } from 'emotion'
import { getTrack, getPlayerState, getIsRunning } from '../utils/spotify'

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
    details: {
      playerState: 'stopped', // stopped || paused || playing
      id: '',
      name: '',
      artist: '',
      artwork_url: '',
    },
  }

  componentDidMount() {
    this.setupInitialState()
    this.registerEventListeners()
  }

  setupInitialState = async () => {
    const isRunning = await getIsRunning()
    if (isRunning) {
      this.setDetails()
    }
  }

  registerEventListeners = () => {
    electron.ipcRenderer.on('PlaybackStateChanged', () => {
      this.setDetails()
    })
  }

  setDetails = async () => {
    const [playerState, track] = await Promise.all([
      getPlayerState(),
      getTrack(),
    ])
    this.setState({
      details: { playerState, ...track },
    })
  }

  render() {
    const { details } = this.state
    const { id, playerState, name, artist, artwork_url } = details
    const { enter, enterActive, exit, exitActive } = fadeStyles

    return (
      <TransitionGroup component={null}>
        <CSSTransition
          key={id}
          timeout={500}
          classNames={{
            enter,
            enterActive,
            exit,
            exitActive,
          }}
        >
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
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

export default App
