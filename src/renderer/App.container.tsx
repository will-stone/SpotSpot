import { spawn } from 'child_process'
import { ipcRenderer } from 'electron'
import React, { useCallback, useEffect, useState } from 'react'

import {
  getIsRunning,
  getPlayerState,
  getTrackInfo,
  SpotifyPlayingState,
  TrackInfo,
} from '../utils/spotify'
import App from './App'

let detailsTimeout: NodeJS.Timer

const handleDoubleClick = () => spawn('open', ['-a', 'spotify'])

const AppContainer: React.FC = () => {
  const [isControlsTimingOut, setIsControlsTimingOut] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [playerState, setPlayerState] = useState<SpotifyPlayingState>('stopped')
  const [track, setTrack] = useState<TrackInfo>()

  const showControls = useCallback(() => {
    clearTimeout(detailsTimeout)
    setIsControlsTimingOut(true)
  }, [setIsControlsTimingOut])

  const hideControls = useCallback(() => {
    detailsTimeout = global.setTimeout(() => {
      setIsControlsTimingOut(false)
    }, 7000)
  }, [setIsControlsTimingOut])

  // Init
  useEffect(() => {
    const init = async () => {
      const isRunning = await getIsRunning()
      if (isRunning) {
        const [pState, trackInfo] = await Promise.all([
          getPlayerState(),
          getTrackInfo(),
        ])
        setPlayerState(pState)
        setTrack(trackInfo)
      }

      setTimeout(() => {
        setIsLoaded(true)
      }, 3500)
    }

    init()

    ipcRenderer.on(
      'PlaybackStateChanged',
      async (_: unknown, pState: SpotifyPlayingState) => {
        if (pState !== 'stopped') {
          setTrack(await getTrackInfo())
        }

        setPlayerState(pState)
        showControls()
        hideControls()
      },
    )
  }, [setPlayerState, setTrack, setIsLoaded, showControls, hideControls])

  const handleMouseEnter = useCallback(() => {
    setIsMouseOver(true)
    showControls()
  }, [setIsMouseOver, showControls])

  const handleMouseLeave = useCallback(() => {
    setIsMouseOver(false)
    hideControls()
  }, [setIsMouseOver, hideControls])

  return (
    <App
      isControlsTimingOut={isControlsTimingOut}
      isLoaded={isLoaded}
      isMouseOver={isMouseOver}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      playerState={playerState}
      track={track}
    />
  )
}

export default AppContainer
