import { useEffect, useState } from 'react'
import './SpotifyNowPlaying.css'

/**
 * Shows the track currently playing on Spotify.
 *
 * Set `VITE_SPOTIFY_NOW_PLAYING_URL` in `.env` to a URL you control that
 * returns JSON (browser must be allowed by CORS). Typical setup: a small
 * serverless function that calls Spotify’s Web API with a refresh token and
 * returns a simplified payload.
 *
 * Supported JSON shapes:
 * - `{ title, artist, url, image, isPlaying }` (camelCase)
 * - `{ track, artists, songUrl, albumImage, isPlaying }` (common alternates)
 * - Raw Spotify `currently-playing` response (`item`, `is_playing`)
 */

const POLL_MS = 30_000

function normalizeTrack(data) {
  if (!data || typeof data !== 'object') return null

  if (data.title || data.track) {
    const title = data.title || data.track
    const artist =
      typeof data.artist === 'string'
        ? data.artist
        : typeof data.artists === 'string'
          ? data.artists
          : Array.isArray(data.artists)
            ? data.artists.map((a) => (typeof a === 'string' ? a : a?.name)).filter(Boolean).join(', ')
            : ''
    return {
      title,
      artist: artist || '',
      url: data.url || data.songUrl || data.external_urls?.spotify,
      image:
        data.image ||
        data.albumImage ||
        data.album_art_url ||
        data.albumImageUrl,
      isPlaying: data.isPlaying !== false && data.is_playing !== false,
    }
  }

  const item = data.item
  if (!item) return null

  return {
    title: item.name,
    artist: (item.artists || []).map((a) => a.name).filter(Boolean).join(', '),
    url: item.external_urls?.spotify,
    image:
      item.album?.images?.find((i) => i.width && i.width <= 160)?.url ||
      item.album?.images?.[1]?.url ||
      item.album?.images?.[0]?.url,
    isPlaying: Boolean(data.is_playing),
  }
}

export function SpotifyNowPlaying() {
  const apiUrl = import.meta.env.VITE_SPOTIFY_NOW_PLAYING_URL
  const [loading, setLoading] = useState(Boolean(apiUrl))
  const [track, setTrack] = useState(null)
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    if (!apiUrl) return

    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch(apiUrl, {
          headers: { Accept: 'application/json' },
        })
        if (cancelled) return

        if (res.status === 204) {
          setTrack(null)
          setIdle(true)
          setLoading(false)
          return
        }

        if (!res.ok) {
          setTrack(null)
          setIdle(false)
          setLoading(false)
          return
        }

        const data = await res.json()
        const next = normalizeTrack(data)
        setTrack(next)
        setIdle(!next)
        setLoading(false)
      } catch {
        if (!cancelled) {
          setTrack(null)
          setIdle(false)
          setLoading(false)
        }
      }
    }

    load()
    const id = setInterval(load, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [apiUrl])

  const body = (() => {
    if (!apiUrl) {
      return (
        <>
          <p className="spotify-now__label">Spotify</p>
          <p className="spotify-now__track">Now playing</p>
          <p className="spotify-now__artist">Add VITE_SPOTIFY_NOW_PLAYING_URL</p>
        </>
      )
    }
    if (loading) {
      return (
        <>
          <p className="spotify-now__label">Spotify</p>
          <p className="spotify-now__track">Loading…</p>
        </>
      )
    }
    if (track) {
      return (
        <>
          <p className="spotify-now__label">
            Spotify
            {track.isPlaying ? (
              <span className="spotify-now__live" title="Playing">
                <span className="spotify-now__dot" />
              </span>
            ) : null}
          </p>
          <p className="spotify-now__track">
            {track.url ? (
              <a href={track.url} target="_blank" rel="noreferrer">
                {track.title}
              </a>
            ) : (
              track.title
            )}
          </p>
          {track.artist ? (
            <p className="spotify-now__artist">{track.artist}</p>
          ) : null}
        </>
      )
    }
    if (idle) {
      return (
        <>
          <p className="spotify-now__label">Spotify</p>
          <p className="spotify-now__track">Nothing playing</p>
        </>
      )
    }
    return (
      <>
        <p className="spotify-now__label">Spotify</p>
        <p className="spotify-now__track">Unavailable</p>
      </>
    )
  })()

  return (
    <aside className="spotify-now" aria-label="Spotify now playing">
      {track?.image ? (
        <img
          className="spotify-now__art"
          src={track.image}
          alt=""
          width={48}
          height={48}
        />
      ) : (
        <div className="spotify-now__art spotify-now__art--placeholder" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="spotify-now__logo" focusable="false">
            <path
              fill="currentColor"
              d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.180-.539.18-1.198.78-1.377 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"
            />
          </svg>
        </div>
      )}
      <div className="spotify-now__text">{body}</div>
    </aside>
  )
}
