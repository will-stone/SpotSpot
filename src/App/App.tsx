import * as React from 'react'
import { animated, useSpring, useTransition } from 'react-spring'
import { next, playPause, previous, TrackInfo } from 'spotify-node-applescript'

const stopPropagation = (e: React.MouseEvent<HTMLButtonElement>) =>
  e.stopPropagation()

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
//  const isOverlayShown = true
  const isDisplayingPaused = isPaused && !isMouseOver

  const trackDetailsStyles = useSpring({
    // transform: `translateY(${isOverlayShown ? '0%' : '-100%'})`,
    backgroundColor: `${isOverlayShown ? 'var(--overlayBgHover)' : 'var(--overlayBg)'}`,
  })

  const controlsStyles = useSpring({
//    transform: `translateY(${isOverlayShown ? '0%' : '100%'})`,
    backgroundColor: `${isOverlayShown ? 'var(--overlayBgHover)' : 'var(--overlayBg)'}`,
})

  const logoAlbumArtTransitions = useTransition(
    !!(!track || isLogoShown),
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onDoubleClick}
    >
      {logoAlbumArtTransitions.map(({ item, key, props }) =>
        item ? (
          <animated.div key={key} className="logo" style={props}>
            <div className="logo__goo">
              <div className="logo__blob1" />
              <div className="logo__blob2" />
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
              <defs>
                <filter id="goo">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="10"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                    result="goo"
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
              backgroundImage: track ? `url(${track.artwork_url})` : 'none',
            }}
          />
        ),
      )}

      {track && !isLogoShown && (
        <>
          <animated.div style={trackDetailsStyles} className="trackDetails">
            <div className="trackDetails__name">{track.name}</div>
            <div className="trackDetails__artist">{track.artist}</div>
          </animated.div>

          <animated.div style={controlsStyles} className="controls">
            {isDisplayingPaused ? (
              'PAUSED'
            ) : (
              <>
                <button
                  className="controls__button"
                  onClick={() => previous()}
                  onDoubleClick={stopPropagation}
                >
                  <i className="fa fa-step-backward" />
                </button>
                <button
                  className="controls__button"
                  onClick={() => playPause()}
                  onDoubleClick={stopPropagation}
                >
                  {isPlaying ? (
                    <i className="fa fa-pause" />
                  ) : (
                    <i className="fa fa-play" />
                  )}
                </button>
                <button
                  className="controls__button"
                  onClick={() => next()}
                  onDoubleClick={stopPropagation}
                >
                  <i className="fa fa-step-forward" />
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
