import { css } from 'emotion'
import * as React from 'react'
import { BLACK } from '../../config'
import { next, playPause, previous } from 'spotify-node-applescript'

const controlsStyle = css`
  width: 100%;
  height: 30%;
  background-color: ${BLACK};
  position: absolute;
  bottom: 0;
  left: 0;
  flex-shrink: 0;
  padding: 0 10%;

  button {
    width: calc(100% / 3);
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

const stopPropagation = (e: React.MouseEvent<HTMLButtonElement>) =>
  e.stopPropagation()

interface ControlsProps {
  isPlaying: boolean
  style: React.CSSProperties
}

const Controls: React.SFC<ControlsProps> = ({ isPlaying, style }) => {
  return (
    <div style={style} className={controlsStyle}>
      <button onClick={() => previous()} onDoubleClick={stopPropagation}>
        <i className="fa fa-step-backward" />
      </button>
      <button onClick={() => playPause()} onDoubleClick={stopPropagation}>
        {isPlaying ? (
          <i className="fa fa-pause" />
        ) : (
          <i className="fa fa-play" />
        )}
      </button>
      <button onClick={() => next()} onDoubleClick={stopPropagation}>
        <i className="fa fa-step-forward" />
      </button>
    </div>
  )
}

export default Controls
