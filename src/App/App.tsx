import { css } from 'emotion'
import * as React from 'react'
import { Spring, Transition } from 'react-spring/renderprops.cjs'
import { TrackInfo } from 'spotify-node-applescript'
import AlbumArt from './components/AlbumArt'
import Controls from './components/Controls'
import Logo from './components/Logo'
import Paused from './components/Paused'
import TrackDetails from './components/TrackDetails'

const appStyle = css`
  height: 100%;
  width: 100%;
`

interface AppProps {
  isLoaded: boolean
  isStopped: boolean
  isControlsTimingOut: boolean
  isPaused: boolean
  isMouseOver: boolean
  isPlaying: boolean
  onDoubleClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  track?: TrackInfo
}

const App: React.FC<AppProps> = ({
  isLoaded,
  isStopped,
  isControlsTimingOut,
  isPaused,
  isMouseOver,
  isPlaying,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  track,
}) => {
  const isLogoShown = !isLoaded || isStopped
  const isOverlayShown = isControlsTimingOut || isPaused || isMouseOver
  const isDisplayingPaused = isPaused && !isMouseOver

  return (
    <div
      className={appStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onDoubleClick}
    >
      <Transition
        // @ts-ignore
        items={!!(!track || isLogoShown)}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {toggle => {
          if (toggle) {
            return function logoWrapper(props) {
              return <Logo style={props} />
            }
          }
          return function albumArtWrapper(props) {
            return <AlbumArt url={track && track.artwork_url} style={props} />
          }
        }}
      </Transition>

      {track && !isLogoShown && (
        <>
          <Spring
            to={{
              transform: `translateY(${isOverlayShown ? '0%' : '-100%'})`,
            }}
          >
            {(styles: React.CSSProperties) => (
              <TrackDetails
                style={styles}
                name={track.name}
                artist={track.artist}
              />
            )}
          </Spring>

          <Spring
            to={{
              transform: `translateY(${isOverlayShown ? '0%' : '100%'})`,
            }}
          >
            {(styles: React.CSSProperties) =>
              isDisplayingPaused ? (
                <Paused style={styles} />
              ) : (
                <Controls style={styles} isPlaying={isPlaying} />
              )
            }
          </Spring>
        </>
      )}
    </div>
  )
}

export default App
