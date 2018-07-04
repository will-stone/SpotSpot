import { css } from 'emotion'
import * as React from 'react'

interface IAlbumArtProps {
  url: Track['artwork_url']
  style: React.CSSProperties
}

const AlbumArt: React.SFC<IAlbumArtProps> = ({ url, style }) => {
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
