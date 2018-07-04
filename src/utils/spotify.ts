import * as spotify from 'spotify-node-applescript'

export const getTrack = () =>
  new Promise((resolve, reject) =>
    spotify.getTrack(
      (
        err: string,
        { id = '', artist = '', name = '', artwork_url = '' } = {}
      ) => {
        if (err) {
          reject(err)
        }
        resolve({
          id,
          artist,
          name,
          artwork_url,
        })
      }
    )
  )

export const getPlayerState = () =>
  new Promise((resolve, reject) =>
    spotify.getState((err: string, { state = {} }: { state: PlayerState }) => {
      if (err) {
        reject(err)
      }
      resolve(state)
    })
  )

export const getIsRunning = () =>
  new Promise((resolve, reject) => {
    return spotify.isRunning((err: string, isRunning: boolean) => {
      if (err) {
        reject(err)
      }
      resolve(isRunning)
    })
  })

export const previous = () => spotify.previous()
export const playPause = () => spotify.playPause()
export const next = () => spotify.next()
