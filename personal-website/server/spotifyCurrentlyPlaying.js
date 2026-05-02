/**
 * Server-only Spotify helpers (refresh token + currently-playing).
 * Do not import from React components — secrets stay in env on the server.
 */

async function refreshAccessToken(env) {
  const basic = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
    'utf8',
  ).toString('base64')

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: env.SPOTIFY_REFRESH_TOKEN,
  })

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Spotify token refresh failed (${res.status}): ${text}`)
  }

  return res.json()
}

async function fetchCurrentlyPlaying(accessToken) {
  const res = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  if (res.status === 204) return null
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Spotify API failed (${res.status}): ${text}`)
  }

  return res.json()
}

const REQUIRED = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'SPOTIFY_REFRESH_TOKEN',
]

/**
 * @param {Record<string, string | undefined>} env
 * @returns {Promise<{ status: number; body: unknown | null }>}
 */
export async function getSpotifyCurrentlyPlayingHttp(env) {
  const trimmed = { ...env }
  for (const k of REQUIRED) {
    const v = trimmed[k]
    if (typeof v === 'string') trimmed[k] = v.trim()
  }

  const missing = REQUIRED.filter((k) => !trimmed[k])
  if (missing.length) {
    return {
      status: 503,
      body: {
        error: 'Spotify env vars missing',
        missing,
      },
    }
  }

  try {
    const tokens = await refreshAccessToken(trimmed)
    if (!tokens.access_token) {
      return {
        status: 502,
        body: { error: 'No access_token from Spotify token endpoint' },
      }
    }

    const playing = await fetchCurrentlyPlaying(tokens.access_token)
    if (!playing) {
      return { status: 204, body: null }
    }

    return { status: 200, body: playing }
  } catch (e) {
    return {
      status: 500,
      body: { error: e instanceof Error ? e.message : String(e) },
    }
  }
}
