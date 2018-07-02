import { css } from 'emotion'
import React from 'react'

const AlbumArt = ({ url, style }) => {
  return (
    <div
      className={css`
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-size: cover;
      `}
      style={{
        ...style,
        backgroundImage: `url(${url})`,
      }}
    />
  )
}

export default AlbumArt
