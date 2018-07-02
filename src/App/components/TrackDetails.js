import { css } from 'emotion'
import React from 'react'
import { BLACK, GREEN } from '../../config'

const wrapperStyle = css`
  width: 100%;
  height: 70%;
  background-color: ${BLACK};
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5%;
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
  ${clampStyle};
  padding: 2%;
`

const artistStyle = css`
  ${clampStyle};
  color: ${GREEN};
  padding: 2%;
`

const TrackDetails = ({ style, name, artist }) => {
  return (
    <div style={style} className={wrapperStyle}>
      <div className={trackNameStyle}>{name}</div>
      <div className={artistStyle}>{artist}</div>
    </div>
  )
}

export default TrackDetails
