/**
 * OAuth helper: local server catches Spotify redirect, exchanges ?code= for tokens.
 * Run from `personal-website`: `npm run spotify:refresh-token`
 *
 * Prereqs:
 * 1. [Spotify Dashboard](https://developer.spotify.com/dashboard) → your app → Redirect URIs
 * 2. Add EXACTLY the URI printed (default `http://127.0.0.1:8765/callback`)
 * 3. `.env.local` with SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
 *
 * Manual paste mode (no local server): `npm run spotify:refresh-token -- --manual`
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as http from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const execFileAsync = promisify(execFile)

const DEFAULT_REDIRECT = 'http://127.0.0.1:8765/callback'
const SCOPES = ['user-read-currently-playing', 'user-read-playback-state'].join(' ')

const manualMode = process.argv.includes('--manual')

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const env = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    env[k] = v
  }
  return env
}

function buildAuthUrl(clientId, redirectUri) {
  const u = new URL('https://accounts.spotify.com/authorize')
  u.searchParams.set('client_id', clientId)
  u.searchParams.set('response_type', 'code')
  u.searchParams.set('redirect_uri', redirectUri)
  u.searchParams.set('scope', SCOPES)
  return u.toString()
}

async function exchangeCode(clientId, clientSecret, code, redirectUri) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64')
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  })
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status}): ${text}`)
  }
  return JSON.parse(text)
}

function normalizePath(p) {
  if (!p || p === '/') return '/'
  return p.endsWith('/') ? p.slice(0, -1) || '/' : p
}

async function openBrowser(url) {
  const platform = process.platform
  if (platform === 'darwin') {
    await execFileAsync('open', [url])
  } else if (platform === 'win32') {
    await execFileAsync('cmd', ['/c', 'start', '', url])
  } else {
    await execFileAsync('xdg-open', [url])
  }
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function runServerFlow(clientId, clientSecret, redirectUri) {
  const ru = new URL(redirectUri)
  if (ru.protocol !== 'http:') {
    throw new Error(
      'Use an http:// redirect URI for auto mode (e.g. http://127.0.0.1:8765/callback).',
    )
  }
  const port = Number(ru.port || 80)
  if (!port) {
    throw new Error('Redirect URI must include a port (e.g. :8765).')
  }
  const expectedPath = normalizePath(ru.pathname || '/')

  /** @type {{ resolve: (v: unknown) => void, reject: (e: Error) => void } | null} */
  let done = null

  const server = http.createServer(async (req, res) => {
    let reqUrl
    try {
      reqUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? `127.0.0.1:${port}`}`)
    } catch {
      res.writeHead(400)
      res.end('Bad request')
      return
    }

    if (reqUrl.pathname === '/favicon.ico') {
      res.writeHead(204)
      res.end()
      return
    }

    if (normalizePath(reqUrl.pathname) !== expectedPath) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found.')
      return
    }

    const err = reqUrl.searchParams.get('error')
    const desc = reqUrl.searchParams.get('error_description')
    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(
        `<!DOCTYPE html><meta charset="utf-8"><title>Spotify</title><p>Spotify returned <code>${err}</code>${desc ? `: ${desc}` : ''}.</p>`,
      )
      if (done) {
        done.reject(
          new Error(`Spotify authorize error: ${err}${desc ? ` — ${desc}` : ''}`),
        )
        done = null
      }
      server.close()
      return
    }

    const code = reqUrl.searchParams.get('code')
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end('<p>Missing <code>code</code>.</p>')
      return
    }

    try {
      const json = await exchangeCode(clientId, clientSecret, code, redirectUri)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(
        '<!DOCTYPE html><meta charset="utf-8"><title>Spotify</title><h1>Success</h1><p>You can close this tab. Check the terminal for <code>SPOTIFY_REFRESH_TOKEN</code>.</p>',
      )
      if (done) {
        done.resolve(json)
        done = null
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(`<p>Token exchange failed:</p><pre>${escapeHtml(msg)}</pre>`)
      if (done) {
        done.reject(e instanceof Error ? e : new Error(msg))
        done = null
      }
    } finally {
      server.close()
    }
  })

  const listenPromise = new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '0.0.0.0', () => {
      server.off('error', reject)
      resolve(undefined)
    })
  })

  try {
    await listenPromise
  } catch (e) {
    if (/** @type {NodeJS.ErrnoException} */ (e).code === 'EADDRINUSE') {
      throw new Error(
        `Port ${port} is in use. Stop the other process, or set SPOTIFY_REDIRECT_URI to another http://127.0.0.1:PORT/callback and add it in Spotify Dashboard.`,
      )
    }
    throw e
  }

  console.log('\n1) Spotify Dashboard → your app → Redirect URIs — must include exactly:\n')
  console.log(`   ${redirectUri}\n`)
  console.log('2) Opening your browser. Log in and click Agree.\n')

  const resultPromise = new Promise((resolve, reject) => {
    done = { resolve, reject }
  })

  try {
    await openBrowser(buildAuthUrl(clientId, redirectUri))
  } catch {
    console.log('Could not open a browser automatically. Open this URL:\n')
    console.log(`   ${buildAuthUrl(clientId, redirectUri)}\n`)
  }

  const json = await resultPromise
  return json
}

async function runManualPasteFlow(clientId, clientSecret, redirectUri) {
  console.log('\n1) Spotify Dashboard → Redirect URIs — add exactly:\n')
  console.log(`   ${redirectUri}\n`)
  console.log('2) Open this URL:\n')
  console.log(`   ${buildAuthUrl(clientId, redirectUri)}\n`)
  console.log(
    '3) After approving, if the page fails to load, copy the FULL URL from the address bar\n' +
      '   (it still contains ?code=... before you dismiss it) and paste below.\n',
  )

  const rl = readline.createInterface({ input, output })
  const pasted = (await rl.question('Paste redirect URL: ')).trim()
  rl.close()

  let code
  try {
    const u = new URL(pasted.includes('://') ? pasted : `http://local${pasted}`)
    code = u.searchParams.get('code')
    const err = u.searchParams.get('error')
    if (err) {
      console.error(`Spotify returned error=${err}`)
      process.exit(1)
    }
  } catch {
    console.error('Could not parse URL. Paste the full URL including ?code=...')
    process.exit(1)
  }

  if (!code) {
    console.error('No ?code= in URL.')
    process.exit(1)
  }

  return exchangeCode(clientId, clientSecret, code, redirectUri)
}

const root = process.cwd()
const fileEnv = loadDotEnv(path.join(root, '.env.local'))
const merged = { ...fileEnv, ...process.env }

const clientId = merged.SPOTIFY_CLIENT_ID?.trim()
const clientSecret = merged.SPOTIFY_CLIENT_SECRET?.trim()
const redirectUri = (
  merged.SPOTIFY_REDIRECT_URI?.trim() || DEFAULT_REDIRECT
).trim()

if (!clientId || !clientSecret) {
  console.error(
    'Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET.\n' +
      'Put them in .env.local in this folder, or export them in your shell.',
  )
  process.exit(1)
}

try {
  const json = manualMode
    ? await runManualPasteFlow(clientId, clientSecret, redirectUri)
    : await runServerFlow(clientId, clientSecret, redirectUri)

  if (!json.refresh_token) {
    console.error('No refresh_token in response:', json)
    process.exit(1)
  }
  console.log('\n--- Add / update in Vercel and .env.local ---\n')
  console.log(`SPOTIFY_REFRESH_TOKEN=${json.refresh_token}\n`)
  console.log('Redeploy on Vercel if needed.\n')
} catch (e) {
  console.error(e instanceof Error ? e.message : e)
  if (!manualMode) {
    console.error(
      '\nTip: if the browser or firewall blocks localhost, try:\n' +
        '  npm run spotify:refresh-token -- --manual\n',
    )
  }
  process.exit(1)
}
