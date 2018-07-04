import { css } from 'emotion'
import * as React from 'react'
import { Spring, Transition } from 'react-spring'
import { next, playPause, previous } from '../utils/spotify'
import AlbumArt from './components/AlbumArt'
import Controls from './components/Controls'
import Logo from './components/Logo'
import Paused from './components/Paused'
import TrackDetails from './components/TrackDetails'

const appStyle = css`
  height: 100%;
  width: 100%;
`

interface IAppProps {
  isDisplayingPaused: boolean
  isLogoShown: boolean
  isOverlayShown: boolean
  isPlaying: boolean
  onDoubleClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  track: Track
}

const App: React.SFC<IAppProps> = ({
  isDisplayingPaused,
  isLogoShown,
  isOverlayShown,
  isPlaying,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  track,
}) => {
  const { id, name, artist, artwork_url } = track

  return (
    <div
      className={appStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onDoubleClick}
    >
      <Transition
        keys={isLogoShown ? 'logo' : id}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {isLogoShown
          ? (styles: React.CSSProperties) => <Logo key="logo" style={styles} />
          : (styles: React.CSSProperties) => (
              <AlbumArt key={id} url={artwork_url} style={styles} />
            )}
      </Transition>

      {!isLogoShown && (
        <>
          <Spring
            to={{
              transform: `translateY(${isOverlayShown ? '0%' : '-100%'})`,
            }}
          >
            {(styles: React.CSSProperties) => (
              <TrackDetails style={styles} name={name} artist={artist} />
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
                <Controls
                  style={styles}
                  isPlaying={isPlaying}
                  onPreviousClick={previous}
                  onPlayPauseClick={playPause}
                  onNextClick={next}
                />
              )
            }
          </Spring>
        </>
      )}
    </div>
  )
}

export default App
