import { css } from 'emotion'
import React from 'react'
import { BLACK } from '../../config'

const controlsStyle = css`
  width: 100%;
  height: 30%;
  background-color: ${BLACK};
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
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

const stopPropagation = e => e.stopPropagation()

const Controls = ({
  isPlaying,
  onPreviousClick,
  onPlayPauseClick,
  onNextClick,
  style,
}) => {
  return (
    <div style={style} className={controlsStyle}>
      <button onClick={onPreviousClick} onDoubleClick={stopPropagation}>
        <i className="fa fa-step-backward" />
      </button>
      <button onClick={onPlayPauseClick} onDoubleClick={stopPropagation}>
        {isPlaying ? (
          <i className="fa fa-pause" />
        ) : (
          <i className="fa fa-play" />
        )}
      </button>
      <button onClick={onNextClick} onDoubleClick={stopPropagation}>
        <i className="fa fa-step-forward" />
      </button>
    </div>
  )
}

export default Controls
