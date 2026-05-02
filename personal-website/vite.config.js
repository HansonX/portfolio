import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { getSpotifyCurrentlyPlayingHttp } from './server/spotifyCurrentlyPlaying.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const loaded = loadEnv(mode, process.cwd(), '')
  const mergedEnv = { ...process.env, ...loaded }

  return {
    plugins: [
      react(),
      {
        name: 'spotify-now-playing-dev-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const pathname = req.url?.split('?')[0] ?? ''
            if (pathname !== '/api/spotify-now-playing') return next()

            if (req.method === 'OPTIONS') {
              res.statusCode = 204
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
              res.end()
              return
            }

            if (req.method !== 'GET') {
              res.statusCode = 405
              res.setHeader('Allow', 'GET, OPTIONS')
              res.end()
              return
            }

            const env = {
              SPOTIFY_CLIENT_ID: mergedEnv.SPOTIFY_CLIENT_ID,
              SPOTIFY_CLIENT_SECRET: mergedEnv.SPOTIFY_CLIENT_SECRET,
              SPOTIFY_REFRESH_TOKEN: mergedEnv.SPOTIFY_REFRESH_TOKEN,
            }

            try {
              const { status, body } = await getSpotifyCurrentlyPlayingHttp(env)
              res.setHeader('Access-Control-Allow-Origin', '*')
              if (status === 204) {
                res.statusCode = 204
                res.end()
                return
              }
              res.statusCode = status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(body))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(
                JSON.stringify({
                  error:
                    err instanceof Error ? err.message : String(err),
                }),
              )
            }
          })
        },
      },
    ],
  }
})
