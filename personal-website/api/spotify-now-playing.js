import { getSpotifyCurrentlyPlayingHttp } from '../server/spotifyCurrentlyPlaying.js'

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
}

export default async function handler(req, res) {
  try {
    cors(res)

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      return res.end()
    }

    if (req.method !== 'GET') {
      res.statusCode = 405
      res.setHeader('Allow', 'GET, OPTIONS')
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: 'Method not allowed' }))
    }

    const env = {
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
      SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
    }

    const { status, body } = await getSpotifyCurrentlyPlayingHttp(env)

    if (status === 204) {
      res.statusCode = 204
      return res.end()
    }

    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify(body))
  } catch (e) {
    cors(res)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(
      JSON.stringify({
        error: e instanceof Error ? e.message : String(e),
      }),
    )
  }
}
