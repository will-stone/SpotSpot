import { css } from 'emotion'
import * as React from 'react'
import { TrackInfo } from 'spotify-node-applescript'

interface AlbumArtProps {
  url?: TrackInfo['artwork_url']
  style: React.CSSProperties
}

const AlbumArt: React.FC<AlbumArtProps> = ({ url, style }) =>
  url ? (
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
  ) : null

export default AlbumArt
