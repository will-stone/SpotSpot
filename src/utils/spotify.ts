import execa from 'execa'

export interface TrackInfo {
  artist: string
  artworkUrl: string
  name: string
}

async function getArtist(): Promise<string> {
  const { stdout: artist } = await execa('osascript', [
    '-e',
    'tell application "Spotify" to return current track\'s artist',
  ])
  return artist
}

async function getName(): Promise<string> {
  const { stdout: name } = await execa('osascript', [
    '-e',
    'tell application "Spotify" to return current track\'s name',
  ])
  return name
}

async function getArtworkUrl(): Promise<string> {
  const { stdout: artworkUrl } = await execa('osascript', [
    '-e',
    'tell application "Spotify" to return current track\'s artwork url',
  ])
  return artworkUrl
}

export async function getTrackInfo(): Promise<TrackInfo> {
  const [artist, name, artworkUrl] = await Promise.all([
    getArtist(),
    getName(),
    getArtworkUrl(),
  ])
  return { artist, name, artworkUrl }
}

export type SpotifyPlayingState = 'playing' | 'paused' | 'stopped'

export async function getPlayerState(): Promise<SpotifyPlayingState> {
  const { stdout } = await execa('osascript', [
    '-e',
    'tell application "Spotify" to return player state',
  ])
  if (String(stdout) === 'playing') return 'playing'
  if (String(stdout) === 'paused') return 'paused'
  return 'stopped'
}

export async function getIsRunning(): Promise<boolean> {
  const { stdout } = await execa('osascript', [
    '-e',
    'tell application "System Events" to (name of processes) contains "Spotify"',
  ])
  return stdout === 'true'
}

export async function playPause(): Promise<void> {
  await execa('osascript', ['-e', 'tell application "Spotify" to playpause'])
}

export async function next(): Promise<void> {
  await execa('osascript', ['-e', 'tell application "Spotify" to next track'])
}

export async function previous(): Promise<void> {
  await execa('osascript', [
    '-e',
    'tell application "Spotify" to previous track',
  ])
}
