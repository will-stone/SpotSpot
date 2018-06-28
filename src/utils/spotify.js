import spotify from 'spotify-node-applescript'

export const getTrack = () =>
  new Promise((resolve, reject) =>
    spotify.getTrack((err, { id, artist, name, artwork_url } = {}) => {
      resolve({
        id,
        artist,
        name,
        artwork_url,
      })
    })
  )

export const getPlayerState = () =>
  new Promise((resolve, reject) =>
    spotify.getState((err, { state: playerState } = {}) => {
      resolve(playerState)
    })
  )

export const getIsRunning = () =>
  new Promise((resolve, reject) =>
    spotify.isRunning((err, isRunning) => {
      resolve(isRunning)
    })
  )
