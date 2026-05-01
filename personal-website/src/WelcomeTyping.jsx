import { useEffect, useMemo, useState } from 'react'

const GREETINGS = ['hello', 'hi', 'hey', 'howdy', "what's up", "welcome", "greetings"]
const NAME_LINE = 'Hanson'
const CHAR_MS = 52

function pickGreeting() {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
}

function capitalizeFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function WelcomeTyping() {
  const config = useMemo(() => {
    const word = pickGreeting()
    return {
      greetingLine: `${capitalizeFirst(word)}, I'm`,
      nameLine: NAME_LINE,
    }
  }, [])

  const [line1, setLine1] = useState(() =>
    prefersReducedMotion() ? config.greetingLine : '',
  )
  const [line2, setLine2] = useState(() =>
    prefersReducedMotion() ? config.nameLine : '',
  )

  useEffect(() => {
    if (prefersReducedMotion()) return

    const { greetingLine, nameLine } = config
    let cancelled = false

    ;(async () => {
      for (let i = 1; i <= greetingLine.length && !cancelled; i++) {
        setLine1(greetingLine.slice(0, i))
        await delay(CHAR_MS)
      }
      for (let j = 1; j <= nameLine.length && !cancelled; j++) {
        setLine2(nameLine.slice(0, j))
        await delay(CHAR_MS)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [config])

  const { greetingLine, nameLine } = config

  const typingLine1 = line1.length < greetingLine.length
  const typingLine2 =
    line1.length === greetingLine.length && line2.length < nameLine.length

  const srGreeting = `${greetingLine} ${nameLine}`

  return (
    <>
      <span className="welcome-type__sr">{srGreeting}</span>
      <div className="welcome-type" aria-hidden="true">
        <p className="eyebrow welcome-type__line1">
          {line1}
          {typingLine1 ? (
            <span className="welcome-type__cursor">|</span>
          ) : null}
        </p>
        <h1 className="welcome__title welcome-type__line2">
          {line2}
          {typingLine2 ? (
            <span className="welcome-type__cursor">|</span>
          ) : null}
        </h1>
      </div>
    </>
  )
}
