declare enum PlayerState {
  stopped = 'stopped',
  paused = 'paused',
  playing = 'playing',
}

declare interface Track {
  id: string
  name: string
  artist: string
  artwork_url: string
}
