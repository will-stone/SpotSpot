import { css } from 'emotion'
import React from 'react'
import { BLACK } from '../../config'

const Paused = ({ style }) => {
  return (
    <div
      style={style}
      className={css`
        width: 100%;
        height: 30%;
        background-color: ${BLACK};
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.5);
      `}
    >
      PAUSED
    </div>
  )
}

export default Paused
