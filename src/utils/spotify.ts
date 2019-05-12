import {
  getState,
  getTrack,
  isRunning,
  SpotifyState,
  TrackInfo,
} from 'spotify-node-applescript'

export const getTrackInfo = (): Promise<TrackInfo> =>
  new Promise((resolve, reject) =>
    getTrack((err, trackInfo) => {
      if (err) {
        reject(err)
      }
      resolve(trackInfo)
    }),
  )

export const getPlayerState = (): Promise<SpotifyState> =>
  new Promise((resolve, reject) =>
    getState((err, playerState) => {
      if (err) {
        reject(err)
      }
      resolve(playerState)
    }),
  )

export const getIsRunning = (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    return isRunning((err, isRunning) => {
      if (err) {
        reject(err)
      }
      resolve(isRunning)
    })
  })
