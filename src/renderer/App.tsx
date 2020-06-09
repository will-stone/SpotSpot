import {
  faPause,
  faPlay,
  faStepBackward,
  faStepForward,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as React from 'react'
import { animated, useSpring, useTransition } from 'react-spring'

import {
  next,
  playPause,
  previous,
  SpotifyPlayingState,
  TrackInfo,
} from '../utils/spotify'

const stopPropagation = (event: React.MouseEvent<HTMLButtonElement>) =>
  event.stopPropagation()

interface AppProps {
  isLoaded: boolean
  isControlsTimingOut: boolean
  playerState: SpotifyPlayingState
  isMouseOver: boolean
  onDoubleClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  track?: TrackInfo
}

const App: React.FC<AppProps> = ({
  isLoaded,
  isControlsTimingOut,
  isMouseOver,
  playerState,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  track,
}) => {
  const isLogoShown = !isLoaded || playerState === 'stopped'
  const isOverlayShown =
    isControlsTimingOut || playerState === 'paused' || isMouseOver
  const isDisplayingPaused = playerState === 'paused' && !isMouseOver

  const trackDetailsStyles = useSpring({
    transform: `translateY(${isOverlayShown ? '0%' : '-100%'})`,
  })

  const controlsStyles = useSpring({
    transform: `translateY(${isOverlayShown ? '0%' : '100%'})`,
  })

  const logoAlbumArtTransitions = useTransition(
    Boolean(!track || isLogoShown),
    // eslint-disable-next-line unicorn/no-null
    null,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    },
  )

  return (
    <div
      className="app"
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {logoAlbumArtTransitions.map(({ item, key, props }) =>
        item ? (
          <animated.div key={key} className="logo" style={props}>
            <div className="logo__goo">
              <div className="logo__blob1" />
              <div className="logo__blob2" />
            </div>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="goo">
                  <feGaussianBlur
                    in="SourceGraphic"
                    result="blur"
                    stdDeviation="10"
                  />
                  <feColorMatrix
                    in="blur"
                    result="goo"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  />
                  <feBlend in="SourceGraphic" />
                </filter>
              </defs>
            </svg>
          </animated.div>
        ) : (
          <animated.div
            key={key}
            className="albumArt"
            style={{
              ...props,
              backgroundImage: track ? `url(${track.artworkUrl})` : 'none',
            }}
          />
        ),
      )}

      {track && !isLogoShown && (
        <>
          <animated.div className="trackDetails" style={trackDetailsStyles}>
            <div className="trackDetails__name">{track.name}</div>
            <div className="trackDetails__artist">{track.artist}</div>
          </animated.div>

          <animated.div className="controls" style={controlsStyles}>
            {isDisplayingPaused ? (
              'PAUSED'
            ) : (
              <>
                <button
                  className="controls__button"
                  onClick={previous}
                  onDoubleClick={stopPropagation}
                  type="button"
                >
                  <FontAwesomeIcon fixedWidth icon={faStepBackward} />
                </button>
                <button
                  className="controls__button"
                  onClick={playPause}
                  onDoubleClick={stopPropagation}
                  type="button"
                >
                  {playerState === 'playing' ? (
                    <FontAwesomeIcon fixedWidth icon={faPause} />
                  ) : (
                    <FontAwesomeIcon fixedWidth icon={faPlay} />
                  )}
                </button>
                <button
                  className="controls__button"
                  onClick={next}
                  onDoubleClick={stopPropagation}
                  type="button"
                >
                  <FontAwesomeIcon icon={faStepForward} />
                </button>
              </>
            )}
          </animated.div>
        </>
      )}
    </div>
  )
}

export default App
